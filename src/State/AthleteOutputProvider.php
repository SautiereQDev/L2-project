<?php

declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\CollectionOperationInterface;
use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\Pagination\PaginatorInterface;
use ApiPlatform\State\Pagination\TraversablePaginator;
use ApiPlatform\State\ProviderInterface;
use App\Dto\AthleteOutput;
use App\Entity\Athlete;
use Psr\Log\LoggerInterface;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;
use ArrayIterator;

/**
 * State Provider to transform Athlete entities to AthleteOutput DTOs for read operations.
 * It decorates the default Doctrine providers to fetch the entity/collection first.
 *
 * @template T of object The DTO class (AthleteOutput)
 * @implements ProviderInterface<AthleteOutput>
 */
final class AthleteOutputProvider implements ProviderInterface
{
    public function __construct(
        /**
         * The default Doctrine item provider, injected by Symfony's service decoration or autowiring binding.
         * We need to explicitly configure decoration in services.yaml or rely on autowiring bindings.
         * Let's assume autowiring bindings $itemProvider and $collectionProvider are configured or use explicit service IDs.
         * For clarity, let's assume we'll configure decoration explicitly later if needed.
         */
        private readonly ProviderInterface $itemProvider,
        private readonly ProviderInterface $collectionProvider,
        private readonly LoggerInterface $logger,
        private readonly UploaderHelper $uploaderHelper,
    ) {}

    /**
     * Provides the state (AthleteOutput DTO or collection/paginator of DTOs).
     *
     * @param Operation $operation The operation being executed.
     * @param array<string, mixed> $uriVariables The URI variables of the operation.
     * @param array<string, mixed> $context The context of the operation.
     * @return object|array<object>|null Returns an AthleteOutput, an array/paginator of AthleteOutput, or null if not found.
     */
    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        $this->logger->debug('AthleteOutputProvider::provide called', [
            'operation_name' => $operation->getName(),
            'operation_class' => $operation::class,
            'resource_class' => $operation->getClass(),
            'uriVariables' => $uriVariables,
            'is_collection' => $operation instanceof CollectionOperationInterface,
        ]);

        // Determine which decorated provider to call based on the operation type
        $provider = $operation instanceof CollectionOperationInterface ? $this->collectionProvider : $this->itemProvider;
        $state = $provider->provide($operation, $uriVariables, $context);

        if (null === $state) {
            $this->logger->info('Decorated provider returned null.', ['operation' => $operation->getName(), 'uriVariables' => $uriVariables]);
            return null;
        }

        // Handle collections (including paginated collections)
        if ($state instanceof PaginatorInterface || (is_iterable($state) && !$state instanceof Athlete)) {
            return $this->transformCollection($state);
        }

        // Handle single item
        if ($state instanceof Athlete) {
            $this->logger->debug('Transforming single Athlete to DTO', ['athlete_id' => $state->getId()]);
            try {
                return $this->createDto($state);
            } catch (\LogicException $e) {
                $this->logger->error('Failed to create DTO for single athlete', ['athlete_id' => $state->getId(), 'error' => $e->getMessage(), 'exception' => $e]);
                // Re-throw to let API Platform handle it (likely results in 500)
                throw $e;
            }
        }

        // Log error if the state type is unexpected
        $this->logger->error('Decorated provider returned unexpected state type', [
            'type' => get_debug_type($state),
            'operation' => $operation->getName(),
        ]);
        throw new \LogicException(sprintf('Expected instance of %s or iterable, got %s from decorated provider', Athlete::class, get_debug_type($state)));
    }

    /**
     * Transforms a collection or paginator of Athlete entities into DTOs.
     *
     * @param iterable<Athlete>|PaginatorInterface<Athlete> $collection
     * @return array<AthleteOutput>|PaginatorInterface<AthleteOutput>
     */
    private function transformCollection(iterable $collection): array|PaginatorInterface
    {
        $outputDtos = [];
        $count = 0;
        foreach ($collection as $athlete) {
            if ($athlete instanceof Athlete) {
                try {
                    $outputDtos[] = $this->createDto($athlete);
                    $count++;
                } catch (\LogicException $e) {
                    $this->logger->error('Failed to create DTO for athlete in collection', ['athlete_id' => $athlete->getId(), 'error' => $e->getMessage(), 'exception' => $e]);
                    // Decide how to handle: skip, return partial, throw? Skipping for now.
                }
            } else {
                $this->logger->warning('Item in collection is not an Athlete instance', ['item_type' => get_debug_type($athlete)]);
            }
        }
        $this->logger->debug(sprintf('Transformed %d athletes to DTOs for collection', $count));

        // Preserve pagination if the original state was a PaginatorInterface
        if ($collection instanceof PaginatorInterface) {
            return new TraversablePaginator(
                new ArrayIterator($outputDtos),
                $collection->getCurrentPage(),
                $collection->getItemsPerPage(),
                $collection->getTotalItems()
            );
        }

        // Otherwise, return the plain array of DTOs
        return $outputDtos;
    }


    /**
     * Creates an AthleteOutput DTO from an Athlete entity.
     *
     * @param Athlete $athlete The entity to transform.
     * @return AthleteOutput The created DTO.
     * @throws \LogicException If essential data (like ID or non-nullable fields in DTO) is missing.
     */
    private function createDto(Athlete $athlete): AthleteOutput
    {
        $id = $athlete->getId();
        if (null === $id) {
            // This should ideally not happen for persisted entities fetched by Doctrine
            $this->logger->error('Athlete ID is null, cannot create DTO.');
            throw new \LogicException('Attempting to create DTO for an Athlete with null ID.');
        }

        $birthdate = $athlete->getBirthdate();
        if (!$birthdate) {
            // Birthdate is non-nullable in the DTO
            $this->logger->error('Athlete birthdate is null, cannot create DTO.', ['athlete_id' => $id]);
            throw new \LogicException(sprintf('Athlete with ID %d has null birthdate, which is required for AthleteOutput.', $id));
        }

        // Ensure DateTimeImmutable properties have defaults if null (though they shouldn't be based on typical entity logic)
        // It's better practice to ensure these are set during entity creation/update (e.g., via Lifecycle Callbacks or constructor)
        $createdAt = $athlete->getCreatedAt();
        if (!$createdAt) {
             $this->logger->warning('Athlete createdAt is null, using current time.', ['athlete_id' => $id]);
             $createdAt = new \DateTimeImmutable(); // Fallback, but indicates potential issue in entity lifecycle
        }

        $updatedAt = $athlete->getUpdatedAt();
         if (!$updatedAt) {
             $this->logger->warning('Athlete updatedAt is null, using current time.', ['athlete_id' => $id]);
             $updatedAt = new \DateTimeImmutable(); // Fallback
         }

        // Use null coalescing for potentially null strings/ints from the entity if the DTO allows null
        // If DTO requires non-null, add checks similar to birthdate above or ensure entity guarantees non-null values.
        
        // Generate profile image URL using VichUploaderBundle
        $profileImageUrl = null;
        if ($athlete->getProfileImageName()) {
            $profileImageUrl = $this->uploaderHelper->asset($athlete, 'profileImageFile');
        }
        
        return new AthleteOutput(
            id: $id,
            firstname: $athlete->getFirstname() ?? '', // Assuming DTO expects string, provide default if null
            lastname: $athlete->getLastname() ?? '', // Assuming DTO expects string, provide default if null
            country: $athlete->getCountry() ?? '', // Assuming DTO expects string, provide default if null
            birthdate: $birthdate, // Already checked for null
            heigth: $athlete->getHeigth(), // Nullable in DTO
            weigth: $athlete->getWeigth(), // Nullable in DTO
            coach: $athlete->getCoach(), // Nullable in DTO
            gender: $athlete->getGender(), // Assuming GenderType enum handles defaults or is non-null
            createdAt: $createdAt, // Handled null case with fallback
            updatedAt: $updatedAt, // Handled null case with fallback
            profileImageUrl: $profileImageUrl // VichUploader generated URL
        );
    }
}
