<?php
declare(strict_types=1);

namespace App\Serializer;

use App\Dto\AthleteInput;
use App\Dto\AthleteMultipartInput;
use Symfony\Component\Serializer\Exception\InvalidArgumentException;
use Symfony\Component\Serializer\Normalizer\DenormalizerInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareInterface;
use Symfony\Component\Serializer\Normalizer\DenormalizerAwareTrait;

final class AthleteDtoDenormalizer implements DenormalizerInterface, DenormalizerAwareInterface
{
    use DenormalizerAwareTrait;

    public function denormalize(mixed $data, string $type, string $format = null, array $context = []): mixed
    {
        if (!is_array($data)) {
            throw new InvalidArgumentException('Data expected to be an array, got ' . get_debug_type($data) . '.');
        }

        // Force string conversion for problematic fields BEFORE creating the DTO
        if (isset($data['birthdate'])) {
            if ($data['birthdate'] instanceof \DateTimeInterface) {
                $data['birthdate'] = $data['birthdate']->format('Y-m-d');
            } elseif (is_string($data['birthdate'])) {
                // Ensure it's still a string (no conversion)
                $data['birthdate'] = $data['birthdate'];
            }
        }

        // Create DTO instance
        $dto = new $type();
        
        // Manually assign properties to avoid any automatic conversion
        if (property_exists($dto, 'firstname') && isset($data['firstname'])) {
            $dto->firstname = (string) $data['firstname'];
        }
        if (property_exists($dto, 'lastname') && isset($data['lastname'])) {
            $dto->lastname = (string) $data['lastname'];
        }
        if (property_exists($dto, 'country') && isset($data['country'])) {
            $dto->country = (string) $data['country'];
        }
        if (property_exists($dto, 'birthdate') && isset($data['birthdate'])) {
            $dto->birthdate = (string) $data['birthdate'];
        }
        if (property_exists($dto, 'heigth') && isset($data['heigth'])) {
            $dto->heigth = is_numeric($data['heigth']) ? (int) $data['heigth'] : null;
        }
        if (property_exists($dto, 'weigth') && isset($data['weigth'])) {
            $dto->weigth = is_numeric($data['weigth']) ? (int) $data['weigth'] : null;
        }
        if (property_exists($dto, 'coach') && isset($data['coach'])) {
            $dto->coach = $data['coach'] ? (string) $data['coach'] : null;
        }
        if (property_exists($dto, 'gender') && isset($data['gender'])) {
            $dto->gender = (string) $data['gender'];
        }

        return $dto;
    }

    public function supportsDenormalization(mixed $data, string $type, string $format = null, array $context = []): bool
    {
        return $type === AthleteInput::class || $type === AthleteMultipartInput::class;
    }

    public function getSupportedTypes(?string $format): array
    {
        return [
            AthleteInput::class => true,
            AthleteMultipartInput::class => true,
        ];
    }
}
