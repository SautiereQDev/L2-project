<?php

namespace App\Entity;

use App\Enums\LocationType;
use App\Repository\LocationRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: LocationRepository::class)]
class Location
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	private ?string $name = null;

	#[ORM\Column(length: 255)]
	private ?string $city = null;

	#[ORM\Column(length: 255)]
	private ?string $country = null;

	#[ORM\Column]
	private ?int $capacity = null;

	// For the coordinates
	#[ORM\Column]
	private ?float $longitude = null;

	#[ORM\Column]
	private ?float $latitude = null;


	#[ORM\Column]
	private LocationType $type = LocationType::STADIUM;

	public function getId(): ?int
	{
		return $this->id;
	}

	public function getName(): ?string
	{
		return $this->name;
	}

	public function setName(string $name): static
	{
		$this->name = $name;

		return $this;
	}

	public function getCity(): ?string
	{
		return $this->city;
	}

	public function setCity(string $city): static
	{
		$this->city = $city;

		return $this;
	}

	public function getCountry(): ?string
	{
		return $this->country;
	}

	public function setCountry(string $country): static
	{
		$this->country = $country;

		return $this;
	}

	public function getCapacity(): ?int
	{
		return $this->capacity;
	}

	public function setCapacity(int $capacity): static
	{
		$this->capacity = $capacity;

		return $this;
	}

	public function getLongitude(): ?float
	{
		return $this->longitude;
	}

	public function setLongitude(float $longitude): static
	{
		$this->longitude = $longitude;

		return $this;
	}

	public function getLatitude(): ?float
	{
		return $this->latitude;
	}

	public function setLatitude(float $latitude): static
	{
		$this->latitude = $latitude;

		return $this;
	}

	public function getType(): ?string
	{
		return $this->type;
	}

	public function setType(string $type): static
	{
		$this->type = $type;

		return $this;
	}
}
