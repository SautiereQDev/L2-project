<?php
declare(strict_types=1);

namespace App\Dto;

use App\Enums\GenderType;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

final readonly class AthleteInput
{
    public function __construct(
        #[Assert\NotBlank]
        #[Groups(['athlete:write'])]
        public string $firstname,

        #[Assert\NotBlank]
        #[Groups(['athlete:write'])]
        public string $lastname,

        #[Assert\NotBlank]
        #[Groups(['athlete:write'])]
        public string $country,

        #[Assert\NotBlank]
        #[Assert\Date]
        #[Groups(['athlete:write'])]
        public \DateTimeInterface $birthdate,

        #[Assert\Positive]
        #[Assert\LessThan(300)]
        #[Groups(['athlete:write'])]
        public ?int $heigth = null,

        #[Assert\Positive]
        #[Assert\LessThan(500)]
        #[Groups(['athlete:write'])]
        public ?int $weigth = null,

        #[Groups(['athlete:write'])]
        public ?string $coach = null,

        #[Assert\Choice(choices: GenderType::CHOICES)]
        #[Groups(['athlete:write'])]
        public GenderType $gender = GenderType::MEN,
    ) {}
}
