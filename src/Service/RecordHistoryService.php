<?php

namespace App\Service;

use App\Entity\Record;
use App\Enums\GenderType;
use App\Entity\Discipline;
use Doctrine\ORM\EntityManagerInterface;
use RuntimeException;

class RecordHistoryService
{
	public function __construct(
		private readonly EntityManagerInterface $entityManager
	)
	{
	}

	/**
	 * Crée un nouveau record et met à jour l'historique
	 * @param Record $newRecord
	 */
	public function createNewRecord(Record $newRecord): void
	{
		// Vérifie s'il existe déjà un record actuel pour cette discipline et ce genre
		$currentRecord = $this->entityManager->getRepository(Record::class)->findOneBy([
			'discipline' => $newRecord->getDiscipline(),
			'genre' => $newRecord->getGenre(),
			'isCurrentRecord' => true
		]);

		if ($currentRecord) {
			// L'ancien record n'est plus le record actuel
			$currentRecord->setIsCurrentRecord(false);

			// Établir la relation historique
			$newRecord->setPreviousRecord($currentRecord);
		}

		// Le nouveau record devient le record actuel
		$newRecord->setIsCurrentRecord(true);

		$this->entityManager->persist($newRecord);
		$this->entityManager->flush();
	}

	/**
	 * Récupère l'historique complet d'une discipline pour un genre spécifique
	 * @param Discipline $discipline
	 * @param GenderType $genre
	 * @return array
	 */
	public function getRecordHistory(Discipline $discipline, GenderType $genre): array
	{
		$currentRecord = $this->entityManager->getRepository(Record::class)->findOneBy([
			'discipline' => $discipline,
			'genre' => $genre,
			'isCurrentRecord' => true
		]);

		if (!$currentRecord) {
			throw new RuntimeException("Aucun historique trouvé pour cette discipline et ce genre.");
		}

		$history = [$currentRecord];
		$record = $currentRecord;

		// Remonter l'historique
		while (!is_null($record) && $previous = $record->getPreviousRecord()) {
			$history[] = $previous;
			$record = $previous;
		}

		return $history;
	}
}
