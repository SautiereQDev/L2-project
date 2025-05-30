<?php
declare(strict_types=1);

namespace App\DataTransformer;

use ApiPlatform\Core\DataTransformer\DataTransformerInterface;
use App\Dto\AthleteInput;
use App\Entity\Athlete;
use App\Enums\GenderType;

final class AthleteInputDataTransformer implements DataTransformerInterface
{
    public function transform($data, string $to, array $context = []): Athlete
    {
        $athlete = new Athlete();
        
        if ($data instanceof AthleteInput) {
            $athlete->setFirstname($data->firstname);
            $athlete->setLastname($data->lastname);
            $athlete->setCountry($data->country);
            
            // Handle birthdate as string
            if ($data->birthdate) {
                $birthdate = new \DateTime($data->birthdate);
                $athlete->setBirthdate($birthdate);
            }
            
            $athlete->setHeigth($data->heigth);
            $athlete->setWeigth($data->weigth);
            $athlete->setCoach($data->coach);
            
            // Convert string gender to enum
            $genderEnum = match(strtoupper($data->gender)) {
                'M', 'MEN', 'MALE' => GenderType::MEN,
                'W', 'WOMAN', 'FEMALE' => GenderType::WOMAN,
                default => GenderType::MEN
            };
            $athlete->setGender($genderEnum);
        }
        
        return $athlete;
    }

    public function supportsTransformation($data, string $to, array $context = []): bool
    {
        return $data instanceof AthleteInput && $to === Athlete::class;
    }
}
