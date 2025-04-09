<?php

namespace App\Controller;

use App\Repository\AthleteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class AthleteController extends AbstractController
{
	#[Route('/athlete', name: 'api_athletes')]
	public function index(AthleteRepository $athleteRepository): JsonResponse
	{
		$athletesList = $athleteRepository->findAll();

		if (empty($athletesList)) {
			return $this->json(['message' => 'Aucun athlète trouvé.']);
		}

		$data = array_map(static function ($athlete) {
			return $athlete->jsonSerialize();
		}, $athletesList);

		return $this->json($data);
	}

	#[Route('/athlete/{id}', name: 'api_athlete')]
	public function showAthleteById(AthleteRepository $athleteRepository, int $id): JsonResponse
	{
		$athlete = $athleteRepository->find($id);

		if (empty($athlete)) {
			return $this->json(['message' => 'Athlète non trouvé.']);
		}

		return $this->json($athlete->jsonSerialize());
	}
}
