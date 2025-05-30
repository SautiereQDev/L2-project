<?php
declare(strict_types=1);

namespace App\Dto;

use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

final class AthleteInput
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

    #[Assert\NotNull(message: "La date de naissance de l'athlète est requise.")]
    #[Assert\Type(type: \DateTimeInterface::class, message: "La date de naissance doit être une date valide au format YYYY-MM-DD.")]
    #[Assert\LessThan('today', message: "La date de naissance doit être dans le passé.")]
    #[Assert\GreaterThan('1900-01-01', message: "La date de naissance doit être après le 1er janvier 1900.")]
    #[Groups(['athlete:write'])]
    public ?\DateTimeInterface $birthdate = null;

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
}
