<?php
declare(strict_types=1);

namespace App\Dto;

use App\Enums\LocationType;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Serializer\Annotation\Groups;

final readonly class LocationInput
{
	public function __construct(
		#[Assert\NotBlank]
		#[Groups(['location:write'])]
		public string       $name,

		#[Assert\NotBlank]
		#[Groups(['location:write'])]
		public string       $city,

		#[Assert\NotBlank]
		#[Groups(['location:write'])]
		public string       $country,

		#[Assert\Range(min: -180, max: 180)]
		#[Groups(['location:write'])]
		public float        $longitude,

		#[Assert\Range(min: -90, max: 90)]
		#[Groups(['location:write'])]
		public float        $latitude,

		#[Assert\Choice(choices: LocationType::CHOICES)]
		#[Groups(['location:write'])]
		public LocationType $type = LocationType::STADIUM,

		#[Assert\Positive]
		#[Groups(['location:write'])]
		public ?int         $capacity = null,
	)
	{
	}
}
