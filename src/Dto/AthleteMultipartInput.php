<?php
declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\HttpFoundation\File\UploadedFile;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

final class AthleteMultipartInput
{
    #[Assert\NotBlank]
    #[Groups(['athlete:write'])]
    public string $firstname = '';

    #[Assert\NotBlank]
    #[Groups(['athlete:write'])]
    public string $lastname = '';

    #[Assert\NotBlank]
    #[Groups(['athlete:write'])]
    public string $country = '';

    #[Assert\NotBlank]
    #[Assert\Date]
    #[Groups(['athlete:write'])]
    public ?string $birthdate = null;

    #[Assert\Positive]
    #[Assert\LessThan(300)]
    #[Groups(['athlete:write'])]
    public ?int $heigth = null;

    #[Assert\Positive]
    #[Assert\LessThan(500)]
    #[Groups(['athlete:write'])]
    public ?int $weigth = null;

    #[Groups(['athlete:write'])]
    public ?string $coach = null;

    #[Assert\Choice(choices: ['M', 'W', 'MEN', 'WOMAN', 'MALE', 'FEMALE'])]
    #[Groups(['athlete:write'])]
    public string $gender = 'M';

    #[Assert\File(
        maxSize: '5M',
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
        mimeTypesMessage: 'Please upload a valid image file (JPEG, PNG, GIF, or WebP)'
    )]
    #[Groups(['athlete:write'])]
    public ?UploadedFile $profileImageFile = null;
}