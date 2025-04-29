<?php
declare(strict_types=1);

namespace App\Dto;

use App\Enums\DisciplineType;
use App\Enums\RunningType;
use Symfony\Component\Serializer\Annotation\Groups;

final readonly class DisciplineOutput
{
	public function __construct(
		#[Groups(['discipline:read', 'record:read'])]
		public int                $id,

		#[Groups(['discipline:read', 'record:read'])]
		public string             $name,

		#[Groups(['discipline:read', 'record:read'])]
		public DisciplineType     $type,

		#[Groups(['discipline:read', 'record:read'])]
		public ?string            $categories,

		#[Groups(['discipline:read', 'record:read'])]
		public ?RunningType       $runningType,

		#[Groups(['discipline:read', 'record:read'])]
		public \DateTimeImmutable $createdAt,

		#[Groups(['discipline:read', 'record:read'])]
		public \DateTimeImmutable $updatedAt,
	)
	{
	}
}