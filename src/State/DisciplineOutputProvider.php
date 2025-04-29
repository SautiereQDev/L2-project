<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\PaginatorInterface;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use App\Dto\DisciplineOutput;
use App\Entity\Discipline;
use Psr\Log\LoggerInterface;
use ArrayIterator;

/**
 * State Provider to transform Discipline entities to DisciplineOutput DTOs for read operations.
 *
 * @template T of object The DTO class (DisciplineOutput)
 * @implements ProviderInterface<DisciplineOutput>
 */
final class DisciplineOutputProvider implements ProviderInterface
{
    // Inject the default Doctrine providers using binding from services.yaml
    public function __construct(
        private readonly ProviderInterface $itemProvider,
        private readonly ProviderInterface $collectionProvider,
        private readonly LoggerInterface $logger
    ) {}

    /**
     * Provides the state (DisciplineOutput DTO or collection/paginator of DTOs).
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // No need for resource check here if this provider is only invoked via Discipline's 'provider' attribute
        $this->logger->debug('DisciplineOutputProvider::provide called', [
            'operation_name' => $operation->getName(),
            'resource_class' => $operation->getClass(),
            'uriVariables' => $uriVariables,
        ]);

        $provider = $operation instanceof CollectionOperationInterface ? $this->collectionProvider : $this->itemProvider;
        $state = $provider->provide($operation, $uriVariables, $context);

        if (null === $state) {
            return null;
        }

        // Handle collections
        if ($state instanceof PaginatorInterface || (is_iterable($state) && !$state instanceof Discipline)) {
            return $this->transformCollection($state);
        }

        // Handle single item
        if ($state instanceof Discipline) {
            $this->logger->debug('Transforming single Discipline to DTO', ['discipline_id' => $state->getId()]);
            try {
                return $this->createDto($state);
            } catch (\LogicException $e) {
                $this->logger->error('Failed to create DTO for single discipline', ['discipline_id' => $state->getId(), 'error' => $e->getMessage(), 'exception' => $e]);
                throw $e;
            }
        }

        // Log error if the state type is unexpected
        $this->logger->error('Provider decorated by DisciplineOutputProvider returned unexpected state type', [
            'type' => get_debug_type($state),
            'operation' => $operation->getName(),
        ]);
        throw new \LogicException(sprintf('Expected instance of %s or iterable, got %s from decorated provider', Discipline::class, get_debug_type($state)));
    }

    /**
     * Transforms a collection or paginator of Discipline entities into DTOs.
     */
    private function transformCollection(iterable $collection): array|PaginatorInterface
    {
        $outputDtos = [];
        $count = 0;
        foreach ($collection as $discipline) {
            if ($discipline instanceof Discipline) {
                try {
                    $outputDtos[] = $this->createDto($discipline);
                    $count++;
                } catch (\LogicException $e) {
                    $this->logger->error('Failed to create DTO for discipline in collection', ['discipline_id' => $discipline->getId() ?? 'null', 'error' => $e->getMessage()]);
                }
            } else {
                $this->logger->warning('Item in collection is not a Discipline instance', ['item_type' => get_debug_type($discipline)]);
            }
        }
        $this->logger->debug(sprintf('Transformed %d disciplines to DTOs for collection', $count));

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
     * Creates a DisciplineOutput DTO from a Discipline entity.
     */
    private function createDto(Discipline $discipline): DisciplineOutput
    {
        $id = $discipline->getId();
        if (null === $id) { throw new \LogicException('Discipline ID is null.'); }

        $createdAt = $discipline->getCreatedAt();
        if (!$createdAt) {
             $this->logger->warning('Discipline createdAt is null, using current time.', ['discipline_id' => $id]);
             $createdAt = new \DateTimeImmutable(); // Fallback
        }

        $updatedAt = $discipline->getUpdatedAt();
        if (!$updatedAt) {
             $this->logger->warning('Discipline updatedAt is null, using current time.', ['discipline_id' => $id]);
             $updatedAt = new \DateTimeImmutable(); // Fallback
        }

        // Check DTO definition for nullability of properties
        return new DisciplineOutput(
            id: $id,
            name: $discipline->getName() ?? '', // Assuming DTO expects string
            type: $discipline->getType(), // Assuming non-null enum
            categories: $discipline->getCategories(), // Check DTO: nullable string?
            runningType: $discipline->getRunningType(), // Check DTO: nullable enum?
            createdAt: $createdAt,
            updatedAt: $updatedAt
        );
    }
}