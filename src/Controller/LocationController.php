<?php

namespace App\Controller;

use App\Repository\LocationRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class LocationController extends AbstractController
{
	#[Route('/location', name: 'api_locations')]
	public function index(LocationRepository $locationRepository): JsonResponse
	{
		$locationsList = $locationRepository->findAll();

		if (empty($locationsList)) {
			return $this->json(['message' => 'Aucune localisation trouvée.']);
		}

		$data = array_map(static function ($location) {
			return $location->jsonSerialize();
		}, $locationsList);

		return $this->json($data);
	}

	#[Route('/location/{id}', name: 'api_location')]
	public function showLocationsById(LocationRepository $locationRepository, int $id): JsonResponse
	{
		$location = $locationRepository->find($id);

		if (empty($location)) {
			return $this->json(['message' => 'Localisation non trouvée.']);
		}

		return $this->json($location->jsonSerialize());
	}
}
