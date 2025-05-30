<?php
declare(strict_types=1);

namespace App\Controller;

use App\Entity\Athlete;
use App\Enums\GenderType;
use App\State\AthleteOutputProvider;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Vich\UploaderBundle\Templating\Helper\UploaderHelper;

class AthleteUploadController extends AbstractController
{
    public function __construct(
        private readonly EntityManagerInterface $entityManager,
        private readonly ValidatorInterface $validator,
        private readonly AthleteOutputProvider $outputProvider,
        private readonly UploaderHelper $uploaderHelper,
    ) {}

    public function testRoute(): JsonResponse
    {
        return new JsonResponse(['message' => 'Upload route is working']);
    }

    public function upload(Request $request): JsonResponse
    {
        try {
            // Detect content type and extract data accordingly
            $contentType = $request->headers->get('content-type', '');
            $isJson = str_contains($contentType, 'application/json');
            $isMultipart = str_contains($contentType, 'multipart/form-data');
            
            if ($isJson) {
                // Handle JSON request
                $jsonData = json_decode($request->getContent(), true);
                if (json_last_error() !== JSON_ERROR_NONE) {
                    return new JsonResponse([
                        'success' => false,
                        'code' => 400,
                        'message' => 'Invalid JSON data',
                        'data' => null,
                        'errors' => ['code' => 400, 'message' => 'Invalid JSON data']
                    ], Response::HTTP_BAD_REQUEST);
                }
                
                $firstname = $jsonData['firstname'] ?? '';
                $lastname = $jsonData['lastname'] ?? '';
                $country = $jsonData['country'] ?? '';
                $birthdate = $jsonData['birthdate'] ?? '';
                $heigth = $jsonData['heigth'] ?? null;
                $weigth = $jsonData['weigth'] ?? null;
                $coach = $jsonData['coach'] ?? null;
                $gender = $jsonData['gender'] ?? 'MEN';
                $uploadedFile = null; // No file upload in JSON
                
            } elseif ($isMultipart) {
                // Handle multipart/form-data request
                $firstname = $request->request->get('firstname', '');
                $lastname = $request->request->get('lastname', '');
                $country = $request->request->get('country', '');
                $birthdate = $request->request->get('birthdate', '');
                $heigth = $request->request->get('heigth');
                $weigth = $request->request->get('weigth');
                $coach = $request->request->get('coach');
                $gender = $request->request->get('gender', 'MEN');
                $uploadedFile = $request->files->get('profileImageFile');
                
            } else {
                return new JsonResponse([
                    'success' => false,
                    'code' => 400,
                    'message' => 'Unsupported content type. Use application/json or multipart/form-data',
                    'data' => null,
                    'errors' => ['code' => 400, 'message' => 'Unsupported content type']
                ], Response::HTTP_BAD_REQUEST);
            }
            
            // Debug: log received values and their types
            error_log('Received data:');
            error_log('firstname: ' . var_export($firstname, true) . ' (type: ' . gettype($firstname) . ')');
            error_log('lastname: ' . var_export($lastname, true) . ' (type: ' . gettype($lastname) . ')');
            error_log('country: ' . var_export($country, true) . ' (type: ' . gettype($country) . ')');
            error_log('birthdate: ' . var_export($birthdate, true) . ' (type: ' . gettype($birthdate) . ')');
            error_log('gender: ' . var_export($gender, true) . ' (type: ' . gettype($gender) . ')');
            
            // Ensure all required fields are strings
            $firstname = (string) trim($firstname);
            $lastname = (string) trim($lastname);
            $country = (string) trim($country);
            $birthdate = (string) trim($birthdate);
            
            // Validate required fields - check for empty strings
            if (empty($firstname) || empty($lastname) || empty($country) || empty($birthdate)) {
                return new JsonResponse([
                    'success' => false,
                    'code' => 400,
                    'message' => 'Missing required fields: firstname, lastname, country, birthdate',
                    'data' => null,
                    'errors' => [
                        'code' => 400,
                        'message' => 'Missing required fields: firstname, lastname, country, birthdate'
                    ]
                ], Response::HTTP_BAD_REQUEST);
            }

            // Create new Athlete entity
            $athlete = new Athlete();
            
            // Set basic data - ensure we pass proper strings
            $athlete->setFirstname($firstname);
            $athlete->setLastname($lastname);
            $athlete->setCountry($country);
            
            // Convert and set birthdate
            try {
                $birthdateObj = new \DateTime($birthdate);
                $athlete->setBirthdate($birthdateObj);
            } catch (\Exception $e) {
                return new JsonResponse([
                    'success' => false,
                    'code' => 400,
                    'message' => 'Invalid birthdate format. Expected: YYYY-MM-DD',
                    'data' => null,
                    'errors' => [
                        'code' => 400,
                        'message' => 'Invalid birthdate format. Expected: YYYY-MM-DD'
                    ]
                ], Response::HTTP_BAD_REQUEST);
            }
            
            // Set optional fields - only if they have valid values
            if ($heigth !== null && $heigth !== '' && is_numeric($heigth)) {
                $athlete->setHeigth((int) $heigth);
            }
            if ($weigth !== null && $weigth !== '' && is_numeric($weigth)) {
                $athlete->setWeigth((int) $weigth);
            }
            if ($coach !== null && trim($coach) !== '') {
                $athlete->setCoach(trim($coach));
            }
            
            // Set gender (default to MEN if not provided or invalid)
            try {
                // Normalize gender input - accept multiple formats
                $genderUpper = strtoupper(trim($gender));
                $genderEnum = match($genderUpper) {
                    'MALE', 'M', 'MEN' => GenderType::MEN,
                    'FEMALE', 'F', 'WOMAN', 'W' => GenderType::WOMAN,
                    default => GenderType::MEN // Default fallback
                };
                $athlete->setGender($genderEnum);
            } catch (\ValueError $e) {
                return new JsonResponse([
                    'success' => false,
                    'code' => 400,
                    'message' => 'Invalid gender. Allowed values: MALE/MEN, FEMALE/WOMAN',
                    'data' => null,
                    'errors' => [
                        'code' => 400,
                        'message' => 'Invalid gender. Allowed values: MALE/MEN, FEMALE/WOMAN'
                    ]
                ], Response::HTTP_BAD_REQUEST);
            }
            
                // Handle file upload using VichUploader
                if ($uploadedFile instanceof UploadedFile) {
                    // Validate file
                    if (!$uploadedFile->isValid()) {
                        return new JsonResponse([
                            'success' => false,
                            'code' => 400,
                            'message' => 'Invalid file upload',
                            'data' => null,
                            'errors' => [
                                'code' => 400,
                                'message' => 'Invalid file upload'
                            ]
                        ], Response::HTTP_BAD_REQUEST);
                    }
                    
                    // Check file size (5MB max)
                    if ($uploadedFile->getSize() > 5 * 1024 * 1024) {
                        return new JsonResponse([
                            'success' => false,
                            'code' => 400,
                            'message' => 'File size exceeds 5MB limit',
                            'data' => null,
                            'errors' => [
                                'code' => 400,
                                'message' => 'File size exceeds 5MB limit'
                            ]
                        ], Response::HTTP_BAD_REQUEST);
                    }
                    
                    // Check MIME type
                    $allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
                    if (!in_array($uploadedFile->getMimeType(), $allowedMimeTypes)) {
                        return new JsonResponse([
                            'success' => false,
                            'code' => 400,
                            'message' => 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP',
                            'data' => null,
                            'errors' => [
                                'code' => 400,
                                'message' => 'Invalid file type. Allowed: JPEG, PNG, GIF, WebP'
                            ]
                        ], Response::HTTP_BAD_REQUEST);
                    }
                    
                    // Use VichUploader to handle the file
                    $athlete->setProfileImageFile($uploadedFile);
                }
            
            // Set timestamps
            $now = new \DateTimeImmutable();
            $athlete->setCreatedAt($now);
            $athlete->setUpdatedAt($now);
            
            // Validate entity
            $errors = $this->validator->validate($athlete);
            if (count($errors) > 0) {
                $errorMessages = [];
                $debugMessages = [];
                foreach ($errors as $error) {
                    $errorMessage = $error->getMessage();
                    $propertyPath = $error->getPropertyPath();
                    $invalidValue = $error->getInvalidValue();
                    
                    $errorMessages[] = $errorMessage;
                    $debugMessages[] = sprintf(
                        "Property: %s, Error: %s, Invalid value: %s (type: %s)",
                        $propertyPath,
                        $errorMessage,
                        is_object($invalidValue) ? get_class($invalidValue) : var_export($invalidValue, true),
                        gettype($invalidValue)
                    );
                }
                
                // Log detailed error information
                error_log('Validation errors:');
                foreach ($debugMessages as $debugMessage) {
                    error_log($debugMessage);
                }
                
                return new JsonResponse([
                    'success' => false,
                    'code' => 422,
                    'message' => implode(', ', $errorMessages),
                    'data' => null,
                    'errors' => [
                        'code' => 422,
                        'message' => implode(', ', $errorMessages),
                        'details' => $debugMessages
                    ]
                ], Response::HTTP_UNPROCESSABLE_ENTITY);
            }
            
            // Persist the entity (VichUploader will handle file upload automatically)
            $this->entityManager->persist($athlete);
            $this->entityManager->flush();
            
            // Get profile image URL if available
            $profileImageUrl = null;
            if ($athlete->getProfileImageName()) {
                $profileImageUrl = $this->uploaderHelper->asset($athlete, 'profileImageFile');
            }
            
            // Return response with image URL
            return new JsonResponse([
                'success' => true,
                'code' => 201,
                'message' => 'Athlete created successfully',
                'data' => [
                    'id' => $athlete->getId(),
                    'firstname' => $athlete->getFirstname(),
                    'lastname' => $athlete->getLastname(),
                    'country' => $athlete->getCountry(),
                    'birthdate' => $athlete->getBirthdate()?->format('Y-m-d'),
                    'gender' => $athlete->getGender()->value,
                    'heigth' => $athlete->getHeigth(),
                    'weigth' => $athlete->getWeigth(),
                    'coach' => $athlete->getCoach(),
                    'profileImageUrl' => $profileImageUrl,
                ],
                'errors' => null
            ], Response::HTTP_CREATED);
            
        } catch (\Exception $e) {
            return new JsonResponse([
                'success' => false,
                'code' => 500,
                'message' => 'Internal server error: ' . $e->getMessage(),
                'data' => null,
                'errors' => [
                    'code' => 500,
                    'message' => 'Internal server error: ' . $e->getMessage()
                ]
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
