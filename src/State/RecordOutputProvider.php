<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\PaginatorInterface;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use App\Dto\RecordOutput;
use App\Dto\DisciplineOutput;
use App\Dto\AthleteOutput;
use App\Dto\LocationOutput;
use App\Entity\Record;
use Psr\Log\LoggerInterface;
use ArrayIterator;

/**
 * State Provider to transform Record entities to RecordOutput DTOs for read operations.
 *
 * @template T of object The DTO class (RecordOutput)
 * @implements ProviderInterface<RecordOutput>
 */
final readonly class RecordOutputProvider implements ProviderInterface
{
	public function __construct(
		private ProviderInterface $itemProvider,
		private ProviderInterface $collectionProvider,
		private LoggerInterface   $logger
	)
	{
	}

	/**
	 * Provides the state (RecordOutput DTO or collection/paginator of DTOs).
	 */
	public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
	{
		$this->logger->debug('RecordOutputProvider::provide called', [
			'operation_name' => $operation->getName(),
			'resource_class' => $operation->getClass(),
			'uriVariables' => $uriVariables,
		]);

		try {
			$provider = $operation instanceof CollectionOperationInterface ? $this->collectionProvider : $this->itemProvider;
			$this->logger->debug('Using provider', ['provider_class' => get_class($provider)]);
			$state = $provider->provide($operation, $uriVariables, $context);

			if (is_iterable($state)) {
				$count = is_array($state) ? count($state) : iterator_count($state instanceof \Traversable ? $state : new \ArrayIterator([]));
				$this->logger->debug('Provider returned iterable', ['count' => $count]);
			} else {
				$this->logger->debug('Provider returned', ['type' => get_debug_type($state)]);
			}

			if (null === $state) {
				return null;
			}

			// Handle collections
			if ($state instanceof PaginatorInterface || (is_iterable($state) && !$state instanceof Record)) {
				return $this->transformCollection($state);
			}

			// Handle single item
			if ($state instanceof Record) {
				$this->logger->debug('Transforming single Record to DTO', ['record_id' => $state->getId()]);
				try {
					return $this->createDto($state);
				} catch (\LogicException $e) {
					$this->logger->error('Failed to create DTO for single record', ['record_id' => $state->getId(), 'error' => $e->getMessage(), 'exception' => $e]);
					throw $e;
				}
			}

			$this->logger->error('Provider decorated by RecordOutputProvider returned unexpected state type', [
				'type' => get_debug_type($state),
				'operation' => $operation->getName(),
			]);
			throw new \LogicException(sprintf('Expected instance of %s or iterable, got %s from decorated provider', Record::class, get_debug_type($state)));
		} catch (\Exception $e) {
			$this->logger->error('Exception in RecordOutputProvider::provide', [
				'message' => $e->getMessage(),
				'trace' => $e->getTraceAsString(),
			]);
			throw $e;
		}
	}

	/**
	 * Transforms a collection or paginator of Record entities into DTOs.
	 */
	private function transformCollection(iterable $collection): array|PaginatorInterface
	{
		$outputDtos = [];
		$count = 0;
		$failedCount = 0;

		foreach ($collection as $record) {
			if ($record instanceof Record) {
				try {
					$outputDtos[] = $this->createDto($record);
					$count++;
				} catch (\LogicException $e) {
					$failedCount++;
					$this->logger->error('Failed to create DTO for record in collection', [
						'record_id' => $record->getId() ?? 'null',
						'error' => $e->getMessage(),
						'trace' => $e->getTraceAsString()
					]);
				}
			} else {
				$this->logger->warning('Item in collection is not a Record instance', ['item_type' => get_debug_type($record)]);
			}
		}

		$this->logger->debug(sprintf('Transformed %d records to DTOs for collection (failed: %d)', $count, $failedCount));

		if ($collection instanceof PaginatorInterface) {
			return new TraversablePaginator(
				new ArrayIterator($outputDtos),
				$collection->getCurrentPage(),
				$collection->getItemsPerPage(),
				$collection->getTotalItems()
			);
		}
		return $outputDtos;
	}

	/**
	 * Creates a RecordOutput DTO from a Record entity.
	 */
	private function createDto(Record $record): RecordOutput
	{
		$id = $record->getId();
		if (null === $id) {
			throw new \LogicException('Record ID is null.');
		}

		$createdAt = $record->getCreatedAt();
		if (!$createdAt) {
			$this->logger->warning('Record createdAt is null, using current time.', ['record_id' => $id]);
			$createdAt = new \DateTimeImmutable();
		}

		$updatedAt = $record->getUpdatedAt();
		if (!$updatedAt) {
			$this->logger->warning('Record updatedAt is null, using current time.', ['record_id' => $id]);
			$updatedAt = new \DateTimeImmutable();
		}

		$discipline = $record->getDiscipline();
		if (null === $discipline) {
			$this->logger->warning('Record discipline is null, skipping record', ['record_id' => $id]);
			throw new \LogicException('Record discipline is null.');
		}

		$athlete = $record->getAthlete();
		if (null === $athlete) {
			$this->logger->warning('Record athlete is null, skipping record', ['record_id' => $id]);
			throw new \LogicException('Record athlete is null.');
		}

		$location = $record->getLocation();
		if (null === $location) {
			$this->logger->warning('Record location is null, skipping record', ['record_id' => $id]);
			throw new \LogicException('Record location is null.');
		}

		$lastRecord = $record->getLastRecord();
		if (null === $lastRecord) {
			$this->logger->warning('Record lastRecord is null, skipping record', ['record_id' => $id]);
			throw new \LogicException('Record lastRecord is null.');
		}

		$performance = $record->getPerformance();

		// Transform previous record
		$previousRecordDto = null;
		if ($record->getPreviousRecord() !== null) {
			// Simple representation to avoid infinite recursion
			$previousRecord = $record->getPreviousRecord();
			if ($previousRecord !== null && $previousRecord->getId() !== null) {
				// Create a minimal DTO representation
				try {
					// To avoid infinite recursion, we don't pass previousRecord's own previousRecord
					$previousRecordDto = $this->createMinimalRecordDto($previousRecord);
				} catch (\LogicException $e) {
					$this->logger->warning('Could not create DTO for previousRecord', [
						'record_id' => $id,
						'previous_record_id' => $previousRecord->getId(),
						'error' => $e->getMessage()
					]);
				}
			}
		}

		// Transform next records
		$nextRecordsDto = [];
		foreach ($record->getNextRecords() as $nextRecord) {
			if ($nextRecord !== null && $nextRecord->getId() !== null) {
				try {
					$nextRecordsDto[] = $this->createMinimalRecordDto($nextRecord);
				} catch (\LogicException $e) {
					$this->logger->warning('Could not create DTO for a nextRecord', [
						'record_id' => $id,
						'next_record_id' => $nextRecord->getId(),
						'error' => $e->getMessage()
					]);
				}
			}
		}

		// Create discipline, athlete and location DTOs with minimal data to avoid deep nesting
		$disciplineDto = new DisciplineOutput(
			$discipline->getId() ?? throw new \LogicException('Discipline ID is null.'),
			$discipline->getName() ?? '',
			$discipline->getType(),
			$discipline->getCategories(),
			$discipline->getRunningType(),
			$discipline->getCreatedAt() ?? new \DateTimeImmutable(),
			$discipline->getUpdatedAt() ?? new \DateTimeImmutable()
		);

		$athleteDto = new AthleteOutput(
			$athlete->getId() ?? throw new \LogicException('Athlete ID is null.'),
			$athlete->getFirstname() ?? '',
			$athlete->getLastname() ?? '',
			$athlete->getCountry() ?? '',
			$athlete->getBirthdate() ?? throw new \LogicException('Athlete birthdate is null.'),
			$athlete->getHeigth(),
			$athlete->getWeigth(),
			$athlete->getCoach(),
			$athlete->getGender(),
			$athlete->getCreatedAt() ?? new \DateTimeImmutable(),
			$athlete->getUpdatedAt() ?? new \DateTimeImmutable()
		);

		$locationDto = new LocationOutput(
			$location->getId() ?? throw new \LogicException('Location ID is null.'),
			$location->getName() ?? '',
			$location->getCity() ?? '',
			$location->getCountry() ?? '',
			$location->getType(),
			$location->getLongitude() ?? 0.0,
			$location->getLatitude() ?? 0.0,
			$location->getCapacity() ?? 0,
			$location->getCreatedAt() ?? new \DateTimeImmutable(),
			$location->getUpdatedAt() ?? new \DateTimeImmutable()
		);

		return new RecordOutput(
			id: $id,
			discipline: $disciplineDto,
			athlete: $athleteDto,
			lastRecord: $lastRecord,
			performance: $performance,
			genre: $record->getGenre(),
			categorie: $record->getCategorie() ?? \App\Enums\CategorieType::SENIOR,
			isCurrentRecord: $record->isCurrentRecord(),
			previousRecord: $previousRecordDto,
			nextRecords: $nextRecordsDto,
			createdAt: $createdAt,
			updatedAt: $updatedAt,
			location: $locationDto
		);
	}

	/**
	 * Creates a simplified RecordOutput DTO to avoid infinite recursion
	 */
	private function createMinimalRecordDto(Record $record): RecordOutput
	{
		$id = $record->getId();
		if (null === $id) {
			throw new \LogicException('Record ID is null.');
		}

		$discipline = $record->getDiscipline();
		if (null === $discipline) {
			throw new \LogicException('Record discipline is null.');
		}

		$athlete = $record->getAthlete();
		if (null === $athlete) {
			throw new \LogicException('Record athlete is null.');
		}

		$location = $record->getLocation();
		if (null === $location) {
			throw new \LogicException('Record location is null.');
		}

		// Create discipline DTO (simplified)
		$disciplineDto = new DisciplineOutput(
			$discipline->getId() ?? throw new \LogicException('Discipline ID is null.'),
			$discipline->getName() ?? '',
			$discipline->getType(),
			$discipline->getCategories(),
			$discipline->getRunningType(),
			$discipline->getCreatedAt() ?? new \DateTimeImmutable(),
			$discipline->getUpdatedAt() ?? new \DateTimeImmutable()
		);

		// Create athlete DTO (simplified)
		$athleteDto = new AthleteOutput(
			$athlete->getId() ?? throw new \LogicException('Athlete ID is null.'),
			$athlete->getFirstname() ?? '',
			$athlete->getLastname() ?? '',
			$athlete->getCountry() ?? '',
			$athlete->getBirthdate() ?? throw new \LogicException('Athlete birthdate is null.'),
			$athlete->getHeigth(),
			$athlete->getWeigth(),
			$athlete->getCoach(),
			$athlete->getGender(),
			$athlete->getCreatedAt() ?? new \DateTimeImmutable(),
			$athlete->getUpdatedAt() ?? new \DateTimeImmutable()
		);

		// Create location DTO (simplified)
		$locationDto = new LocationOutput(
			$location->getId() ?? throw new \LogicException('Location ID is null.'),
			$location->getName() ?? '',
			$location->getCity() ?? '',
			$location->getCountry() ?? '',
			$location->getType(),
			$location->getLongitude() ?? 0.0,
			$location->getLatitude() ?? 0.0,
			$location->getCapacity() ?? 0,
			$location->getCreatedAt() ?? new \DateTimeImmutable(),
			$location->getUpdatedAt() ?? new \DateTimeImmutable()
		);

		return new RecordOutput(
			id: $id,
			discipline: $disciplineDto,
			athlete: $athleteDto,
			lastRecord: $record->getLastRecord() ?? throw new \LogicException('Record lastRecord is null.'),
			performance: $record->getPerformance(),
			genre: $record->getGenre(),
			categorie: $record->getCategorie() ?? \App\Enums\CategorieType::SENIOR,
			isCurrentRecord: $record->isCurrentRecord(),
			previousRecord: null, // Avoid recursion
			nextRecords: [], // Avoid recursion
			createdAt: $record->getCreatedAt() ?? new \DateTimeImmutable(),
			updatedAt: $record->getUpdatedAt() ?? new \DateTimeImmutable(),
			location: $locationDto
		);
	}
}
