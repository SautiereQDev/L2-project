<?php
declare(strict_types=1);

namespace App\Dto;

use App\Enums\GenderType;
use App\Enums\CategorieType;
use Symfony\Component\Serializer\Annotation\Groups;

final readonly class RecordOutput
{
    public function __construct(
        #[Groups(['record:read', 'athlete:read'])]
        public int $id,

        #[Groups(['record:read', 'athlete:read'])]
        public DisciplineOutput $discipline,

        #[Groups(['record:read', 'athlete:read'])]
        public AthleteOutput $athlete,

        #[Groups(['record:read', 'athlete:read'])]
        public \DateTimeInterface $lastRecord,

        #[Groups(['record:read', 'athlete:read'])]
        public float|int|null $performance,

        #[Groups(['record:read', 'athlete:read'])]
        public GenderType $genre,
        
        #[Groups(['record:read', 'athlete:read'])]
        public CategorieType $categorie,

        #[Groups(['record:read', 'athlete:read'])]
        public bool $isCurrentRecord,

        #[Groups(['record:read', 'athlete:read'])]
        public ?self $previousRecord,

        #[Groups(['record:read', 'athlete:read'])]
        public array $nextRecords,

        #[Groups(['record:read', 'athlete:read'])]
        public \DateTimeImmutable $createdAt,

        #[Groups(['record:read', 'athlete:read'])]
        public \DateTimeImmutable $updatedAt,

        #[Groups(['record:read', 'athlete:read'])]
        public LocationOutput $location,
    ) {}
}
