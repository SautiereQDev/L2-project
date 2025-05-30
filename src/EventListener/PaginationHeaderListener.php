<?php

namespace App\EventListener;

use ApiPlatform\Api\IriConverterInterface;
use ApiPlatform\Core\Metadata\Resource\Factory\ResourceMetadataFactoryInterface;
use ApiPlatform\Doctrine\Orm\Paginator;
use ApiPlatform\State\Pagination\PaginatorInterface;
use ApiPlatform\Symfony\EventListener\EventPriorities;
use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpKernel\Event\ResponseEvent;
use Symfony\Component\HttpKernel\Event\ViewEvent;
use Symfony\Component\HttpKernel\KernelEvents;

/**
 * Écouteur d'événement qui ajoute des métadonnées de pagination dans les réponses JSON
 */
class PaginationHeaderListener implements EventSubscriberInterface
{
	/**
	 * {@inheritdoc}
	 */
	public static function getSubscribedEvents(): array
	{
		return [
			// Utiliser VIEW avec une priorité plus élevée pour intercepter les résultats avant qu'ils ne soient transformés
			KernelEvents::VIEW => ['onKernelView', EventPriorities::PRE_WRITE],
			// Aussi écouter l'événement RESPONSE pour intercepter les réponses JSON déjà formées
			KernelEvents::RESPONSE => ['onKernelResponse', EventPriorities::POST_RESPOND],
		];
	}

	/**
	 * Ajoute des métadonnées de pagination aux résultats avant qu'ils ne soient transformés en réponse
	 */
	public function onKernelView(ViewEvent $event): void
	{
		$request = $event->getRequest();

		// Ne s'applique qu'aux requêtes GET pour des collections
		if (!$request->isMethod(Request::METHOD_GET) || !$this->isCollectionRequest($request)) {
			return;
		}

		$result = $event->getControllerResult();

		// Vérifier si le résultat est une collection paginée
		if (!$this->isPaginatedCollection($result)) {
			return;
		}

		// Récupérer les informations de pagination
		$paginationData = $this->extractPaginationData($result, $request);
		if (empty($paginationData)) {
			return;
		}

		// Pour les résultats qui ne sont pas encore transformés en JSON
		if (is_object($result) && $result instanceof \Traversable) {
			// Convertir les objets traversables en tableaux si nécessaire
			$items = iterator_to_array($result);

			// Créer une nouvelle réponse avec les métadonnées de pagination
			$wrappedResult = [
				'items' => $items,
				'pagination' => $paginationData
			];

			// Remplacer le résultat original par notre résultat enrichi
			$event->setControllerResult($wrappedResult);
		} elseif (is_array($result)) {
			// Si c'est déjà un tableau, ajouter simplement les métadonnées
			if (isset($result['hydra:member'])) {
				// Format hydra, maintenir la structure mais ajouter pagination
				$result['pagination'] = $paginationData;
			} else {
				// Format standard, wrapper le tableau
				$result = [
					'items' => $result,
					'pagination' => $paginationData
				];
			}

			$event->setControllerResult($result);
		}
	}

	/**
	 * Intercepte les réponses pour ajouter les informations de pagination si nécessaire
	 */
	public function onKernelResponse(ResponseEvent $event): void
	{
		$request = $event->getRequest();
		$response = $event->getResponse();

		// Ne s'applique qu'aux requêtes GET pour des collections
		if (!$request->isMethod(Request::METHOD_GET) ||
			!$this->isCollectionRequest($request) ||
			!$response instanceof JsonResponse) {
			return;
		}

		$content = json_decode($response->getContent(), true);
		if (!is_array($content)) {
			return;
		}

		// Si la pagination est déjà présente, ne rien faire
		if (isset($content['pagination'])) {
			return;
		}

		// Si le format est Hydra Collection
		if (isset($content['@type']) && $content['@type'] === 'hydra:Collection') {
			$items = $content['hydra:member'] ?? [];
			$totalItems = $content['hydra:totalItems'] ?? count($items);

			// Récupérer les informations de pagination
			$page = (int)$request->query->get('page', 1);
			$itemsPerPage = (int)$request->query->get('itemsPerPage', 30);
			if ($itemsPerPage <= 0) {
				$itemsPerPage = 30;
			}

			$totalPages = max(1, ceil($totalItems / $itemsPerPage));

			// Ajouter les métadonnées de pagination
			$content['pagination'] = [
				'totalItems' => $totalItems,
				'itemsPerPage' => $itemsPerPage,
				'currentPage' => $page,
				'totalPages' => $totalPages,
				'hasPreviousPage' => $page > 1,
				'hasNextPage' => $page < $totalPages,
			];

			$response->setContent(json_encode($content));
		}
	}

	/**
	 * Détermine si la requête concerne une collection
	 */
	private function isCollectionRequest(Request $request): bool
	{
		$path = $request->getPathInfo();

		// Les chemins de collection se terminent généralement par un nom de ressource pluriel
		// sans identifiant (e.g., /api/records, /api/v1/records)
		$segments = explode('/', trim($path, '/'));
		$lastSegment = end($segments);

		// Si le dernier segment est numérique, ce n'est probablement pas une collection
		if (is_numeric($lastSegment)) {
			return false;
		}

		// Vérifier si le paramètre de pagination est présent
		if ($request->query->has('page') || $request->query->has('itemsPerPage')) {
			return true;
		}

		// Vérifier les segments de l'URL qui indiquent typiquement des collections
		return !preg_match('/\/\d+$/', $path); // Ne se termine pas par /123
	}

	/**
	 * Vérifie si le résultat est une collection paginée
	 */
	private function isPaginatedCollection($result): bool
	{
		// Vérifier les interfaces et classes courantes de pagination
		if ($result instanceof PaginatorInterface) {
			return true;
		}

		// Vérifier les objets avec méthode getTotalItems
		if (is_object($result) && method_exists($result, 'getTotalItems')) {
			return true;
		}

		// Vérifier la structure de données Hydra
		if (is_array($result) && isset($result['hydra:member'])) {
			return true;
		}

		// Vérifier les objets traversables avec méthode count
		if (is_object($result) && $result instanceof \Traversable && method_exists($result, 'count')) {
			return true;
		}

		// Vérifier les tableaux simples qui pourraient être des collections
		if (is_array($result) && !empty($result) && isset($result[0]) && is_array($result[0])) {
			return true;
		}

		return false;
	}

	/**
	 * Extrait les informations de pagination du résultat
	 */
	private function extractPaginationData($result, Request $request): array
	{
		// Récupérer la page actuelle
		$page = (int)$request->query->get('page', 1);

		// Récupérer le nombre d'éléments par page
		$itemsPerPage = (int)$request->query->get('itemsPerPage', 30);
		if ($itemsPerPage <= 0) {
			$itemsPerPage = 30; // Valeur par défaut
		}

		// Déterminer le nombre total d'éléments
		$totalItems = 0;

		if ($result instanceof PaginatorInterface) {
			$totalItems = $result->getTotalItems();
		} elseif (is_object($result) && method_exists($result, 'getTotalItems')) {
			$totalItems = $result->getTotalItems();
		} elseif (is_array($result) && isset($result['hydra:totalItems'])) {
			$totalItems = $result['hydra:totalItems'];
		} elseif (is_array($result) && isset($result['hydra:member'])) {
			$totalItems = count($result['hydra:member']);
			if (isset($result['hydra:totalItems'])) {
				$totalItems = $result['hydra:totalItems'];
			}
		} elseif (is_object($result) && method_exists($result, 'count')) {
			$totalItems = $result->count();
		} elseif (is_array($result)) {
			$totalItems = count($result);
		}

		// Calculer le nombre total de pages
		$totalPages = max(1, ceil($totalItems / $itemsPerPage));

		// Construire les données de pagination complètes
		return [
			'totalItems' => $totalItems,
			'itemsPerPage' => $itemsPerPage,
			'currentPage' => $page,
			'totalPages' => $totalPages,
			'hasPreviousPage' => $page > 1,
			'hasNextPage' => $page < $totalPages,
		];
	}
}
