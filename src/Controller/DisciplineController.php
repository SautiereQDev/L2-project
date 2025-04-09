<?php

namespace App\Controller;

use App\Repository\DisciplineRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class DisciplineController extends AbstractController
{
	#[Route('/discipline', name: 'api_disciplines')]
	public function index(DisciplineRepository $repository): JsonResponse
	{
		$disciplinesList = $repository->findAll();

		if (empty($disciplinesList)) {
			return $this->json(['message' => 'Aucune discipline trouvée.'], Response::HTTP_NOT_FOUND);
		}

		$data = array_map(static function ($discipline) {
			return $discipline->jsonSerialize();
		}, $disciplinesList);

		return $this->json($data);
	}

	#[Route('/discipline/{id}', name: 'api_discipline')]
	public function showDisciplineById(DisciplineRepository $repository, int $id): JsonResponse
	{
		$discipline = $repository->find($id);

		if (empty($discipline)) {
			return $this->json(['message' => 'Discipline non trouvée.'], Response::HTTP_NOT_FOUND);
		}

		return $this->json($discipline->jsonSerialize());
	}
}
