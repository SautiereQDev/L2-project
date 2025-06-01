<?php
declare(strict_types=1);

namespace App\Dto;

use App\Enums\GenderType;
use Symfony\Component\Serializer\Annotation\Context;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Serializer\Normalizer\DateTimeNormalizer;

final readonly class AthleteOutput
{
    public function __construct(
        #[Groups(['athlete:read', 'record:read'])]
        public int $id,

        #[Groups(['athlete:read', 'record:read'])]
        public string $firstname,

        #[Groups(['athlete:read', 'record:read'])]
        public string $lastname,

        #[Groups(['athlete:read', 'record:read'])]
        public string $country,

        #[Groups(['athlete:read', 'record:read'])]
        #[Context([DateTimeNormalizer::FORMAT_KEY => 'Y-m-d'])]
        public \DateTimeInterface $birthdate,

        #[Groups(['athlete:read', 'record:read'])]
        public ?int $heigth,

        #[Groups(['athlete:read', 'record:read'])]
        public ?int $weigth,

        #[Groups(['athlete:read', 'record:read'])]
        public ?string $coach,

        #[Groups(['athlete:read', 'record:read'])]
        public GenderType $gender,

        #[Groups(['athlete:read', 'record:read'])]
        public \DateTimeImmutable $createdAt,

        #[Groups(['athlete:read', 'record:read'])]
        public \DateTimeImmutable $updatedAt,

        #[Groups(['athlete:read', 'record:read'])]
        public ?string $profileImageUrl = null,
    ) {}
}
