<?php
declare(strict_types=1);

namespace App\Dto;

use App\Enums\DisciplineType;
use App\Enums\RunningType;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

final readonly class DisciplineInput
{
    public function __construct(
        #[Assert\NotBlank]
        #[Groups(['discipline:write'])]
        public string $name,

        #[Assert\Choice(choices: DisciplineType::VALID_VALUES)]
        #[Groups(['discipline:write'])]
        public DisciplineType $type,

        #[Groups(['discipline:write'])]
        public ?string $categories = null,

        #[Groups(['discipline:write'])]
        public ?RunningType $runningType = null,
    ) {}
}
