<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\AthleteInput;
use App\Dto\AthleteMultipartInput;
use App\Entity\Athlete;
use App\Enums\GenderType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\RequestStack;

final readonly class AthleteProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private RequestStack $requestStack,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        // Create new Athlete entity
        $athlete = new Athlete();
        
        // Handle JSON request with DTO
        if ($data instanceof AthleteInput || $data instanceof AthleteMultipartInput) {
            $this->processJsonData($athlete, $data);
        } else {
            throw new \InvalidArgumentException('Invalid input data');
        }
        
        // Persist the entity
        $this->entityManager->persist($athlete);
        $this->entityManager->flush();
        
        return $athlete;
    }
    
    private function processJsonData(Athlete $athlete, AthleteInput|AthleteMultipartInput $data): void
    {
        $athlete->setFirstname($data->firstname);
        $athlete->setLastname($data->lastname);
        $athlete->setCountry($data->country);
        
        // Convert string date to DateTime object
        if ($data->birthdate instanceof \DateTimeInterface) {
            $athlete->setBirthdate($data->birthdate);
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
        
        // Handle file upload for AthleteMultipartInput
        if ($data instanceof AthleteMultipartInput && $data->profileImageFile instanceof UploadedFile) {
            $athlete->setProfileImageFile($data->profileImageFile);
        }
    }
}