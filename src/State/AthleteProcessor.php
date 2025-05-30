<?php
declare(strict_types=1);

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Dto\AthleteInput;
use App\Dto\AthleteMultipartInput;
use App\Entity\Athlete;
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
        
        // Get current request to check content type
        $request = $this->requestStack->getCurrentRequest();
        $isMultipart = $request && str_contains($request->headers->get('content-type', ''), 'multipart/form-data');
        
        // Map common fields from both DTOs
        if ($data instanceof AthleteInput || $data instanceof AthleteMultipartInput) {
            $athlete->setFirstname($data->firstname);
            $athlete->setLastname($data->lastname);
            $athlete->setCountry($data->country);
            
            // Convert string date to DateTime object
            if ($data->birthdate) {
                $birthdate = new \DateTime($data->birthdate);
                $athlete->setBirthdate($birthdate);
            }
            
            $athlete->setHeigth($data->heigth);
            $athlete->setWeigth($data->weigth);
            $athlete->setCoach($data->coach);
            $athlete->setGender($data->gender);
            
            // Set timestamps
            $now = new \DateTimeImmutable();
            $athlete->setCreatedAt($now);
            $athlete->setUpdatedAt($now);
        }
        
        // Handle file upload for multipart requests
        if ($isMultipart && $request) {
            // Get the uploaded file from the request directly
            $uploadedFile = $request->files->get('profileImageFile');
            if ($uploadedFile instanceof UploadedFile) {
                $athlete->setProfileImageFile($uploadedFile);
            }
        }
        
        // Also handle if data contains the file (for AthleteMultipartInput)
        if ($data instanceof AthleteMultipartInput && $data->profileImageFile instanceof UploadedFile) {
            $athlete->setProfileImageFile($data->profileImageFile);
        }
        
        // Persist the entity
        $this->entityManager->persist($athlete);
        $this->entityManager->flush();
        
        return $athlete;
    }
}