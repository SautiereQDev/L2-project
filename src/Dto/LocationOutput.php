<?php

namespace App\Dto;

use App\Enums\LocationType;
use Symfony\Component\Serializer\Annotation\Groups;

final readonly class LocationOutput
{
	public function __construct(
		#[Groups(['location:read', 'record:read'])]
		public int    $id,
		
		#[Groups(['location:read', 'record:read'])]
		public string $name,

		#[Groups(['location:read', 'record:read'])]
		public string $city,

		#[Groups(['location:read', 'record:read'])]
		public string $country,

		#[Groups(['location:read', 'record:read'])]
		public LocationType $type,

		#[Groups(['location:read', 'record:read'])]
		public \DateTimeImmutable $createdAt,

		#[Groups(['location:read', 'record:read'])]
		public \DateTimeImmutable $updatedAt,
	)
	{
	}
}
