<?php

namespace App\Controller;

use App\Repository\AthleteRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class AthleteController extends AbstractController
{
	#[Route('/athletes', name: 'app_app')]
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
}
