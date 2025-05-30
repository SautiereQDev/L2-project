<?php
declare(strict_types=1);

namespace App\Dto;

use App\Enums\GenderType;
use App\Enums\CategorieType;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

final readonly class RecordInput
{
	public function __construct(
		#[Assert\NotBlank]
		#[Groups(['record:write'])]
		public int                $disciplineId,

		#[Assert\NotBlank]
		#[Groups(['record:write'])]
		public int                $athleteId,

		#[Assert\NotBlank]
		#[Assert\DateTime]
		#[Groups(['record:write'])]
		public \DateTimeInterface $lastRecord,

		#[Assert\NotBlank]
		#[Groups(['record:write'])]
		public float              $performance,

		#[Assert\NotBlank]
		#[Groups(['record:write'])]
		public int                $locationId,

		#[Assert\Choice(choices: GenderType::CHOICES)]
		#[Groups(['record:write'])]
		public GenderType         $genre = GenderType::MEN,
        
        #[Assert\Choice(choices: CategorieType::CHOICES)]
		#[Groups(['record:write'])]
		public CategorieType      $categorie = CategorieType::SENIOR,

		#[Groups(['record:write'])]
		public bool               $isCurrentRecord = false,

		#[Groups(['record:write'])]
		public ?int               $previousRecordId = null,

		#[Groups(['record:write'])]
		public ?string            $formattedRecordDate = null,
	)
	{
	}
}
