<?php
// Test script to validate our upload system configuration
// This script checks if all components are properly configured

require_once __DIR__ . '/../vendor/autoload.php';

use App\Entity\Athlete;
use App\Dto\AthleteInput;
use App\Dto\AthleteMultipartInput;
use App\Enums\GenderType;

echo "=== Athlete Image Upload System Test ===\n\n";

// Test 1: Check if VichUploader annotations are working
echo "1. Testing entity configuration...\n";
$athlete = new Athlete();
echo "✓ Athlete entity can be instantiated\n";

// Test 2: Check DTO instantiation
echo "\n2. Testing DTOs...\n";
try {
    $input = new AthleteInput(
        firstname: 'John',
        lastname: 'Doe',
        country: 'US',
        birthdate: new DateTime('1990-01-01'),
        heigth: 180,
        weigth: 75,
        coach: 'Mike Smith',
        gender: GenderType::MEN
    );
    echo "✓ AthleteInput DTO works\n";
} catch (Exception $e) {
    echo "✗ AthleteInput DTO failed: " . $e->getMessage() . "\n";
}

try {
    $multipartInput = new AthleteMultipartInput(
        firstname: 'Jane',
        lastname: 'Smith',
        country: 'FR',
        birthdate: new DateTime('1992-05-15'),
        heigth: 165,
        weigth: 60,
        coach: 'Paul Martin',
        gender: GenderType::WOMEN,
        profileImageFile: null // No file for this test
    );
    echo "✓ AthleteMultipartInput DTO works\n";
} catch (Exception $e) {
    echo "✗ AthleteMultipartInput DTO failed: " . $e->getMessage() . "\n";
}

// Test 3: Check VichUploader fields
echo "\n3. Testing VichUploader fields...\n";
try {
    $athlete->setProfileImageName('test.jpg');
    $athlete->setProfileImageSize(1024);
    $athlete->setProfileImageUpdatedAt(new DateTimeImmutable());
    echo "✓ VichUploader setter methods work\n";
    
    $name = $athlete->getProfileImageName();
    $size = $athlete->getProfileImageSize();
    $updatedAt = $athlete->getProfileImageUpdatedAt();
    echo "✓ VichUploader getter methods work\n";
} catch (Exception $e) {
    echo "✗ VichUploader methods failed: " . $e->getMessage() . "\n";
}

// Test 4: Check upload directory
echo "\n4. Testing upload directory...\n";
$uploadDir = __DIR__ . '/../public/uploads/athlete/profile';
if (is_dir($uploadDir)) {
    echo "✓ Upload directory exists: $uploadDir\n";
    if (is_writable($uploadDir)) {
        echo "✓ Upload directory is writable\n";
    } else {
        echo "✗ Upload directory is not writable\n";
    }
} else {
    echo "✗ Upload directory does not exist: $uploadDir\n";
}

echo "\n=== Test completed ===\n";
echo "You can now test the API endpoints with:\n";
echo "- POST /api/v1/athletes (JSON)\n";
echo "- POST /api/v1/athletes (multipart/form-data with image)\n";
