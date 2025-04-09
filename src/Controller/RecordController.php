<?php

namespace App\Controller;

use App\Repository\RecordRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

final class RecordController extends AbstractController
{
	#[Route('/record', name: 'api_record')]
	public function index(RecordRepository $recordRepository): JsonResponse
	{
		$recordsList = $recordRepository->findAll();

		if (empty($recordsList)) {
			return $this->json(['message' => 'Aucun record trouvé.']);
		}

		$data = array_map(static function ($record) {
			return $record->jsonSerialize();
		}, $recordsList);

		return $this->json($data);
	}

	#[Route('/record/{id}', name: 'api_record_id')]
	public function showRecordById(RecordRepository $recordRepository, int $id): JsonResponse
	{
		$record = $recordRepository->find($id);

		if (empty($record)) {
			return $this->json(['message' => 'Record non trouvé.']);
		}

		return $this->json($record->jsonSerialize());
	}
}
