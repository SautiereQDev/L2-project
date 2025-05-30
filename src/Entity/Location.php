<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Dto\LocationInput;
use App\Dto\LocationOutput;
use App\Enums\LocationType;
use App\Repository\LocationRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;


#[ApiResource(
	normalizationContext: ['groups' => ['location:read']],
	denormalizationContext: ['groups' => ['location:write']],
	input: LocationInput::class,
	output: LocationOutput::class,
)]
#[ORM\Entity(repositoryClass: LocationRepository::class)]
class Location
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: 'Name cannot be blank')]
	#[Assert\Length(max: 255, maxMessage: 'Name cannot exceed {{ limit }} characters')]
	#[Assert\Regex(pattern: '/^[a-zA-ZÀ-ÿ\s-]+$/', message: 'Name can only contain letters, spaces, and hyphens')]
	private ?string $name = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: 'City cannot be blank')]
	#[Assert\Length(max: 255, maxMessage: 'City cannot exceed {{ limit }} characters')]
	private ?string $city = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: 'Country cannot be blank')]
	#[Assert\Length(min: 2, max: 2, exactMessage: 'Le pays doit contenir exactement 2 caractères')]
	private ?string $country = null;

	#[ORM\Column(nullable: true)]
	private ?int $capacity = null;

	// For the coordinates
	#[ORM\Column]
	#[Assert\NotBlank(message: 'Longitude cannot be blank')]
	#[Assert\Range(
		notInRangeMessage: 'Longitude must be between {{ min }} and {{ max }}',
		min: -180,
		max: 180,
	)]
	private ?float $longitude = null;

	#[ORM\Column]
	#[Assert\NotBlank(message: 'Latitude cannot be blank')]
	#[Assert\Range(
		notInRangeMessage: 'Latitude must be between {{ min }} and {{ max }}',
		min: -90,
		max: 90,
	)]
	private ?float $latitude = null;


	#[ORM\Column]
	#[Assert\Choice(choices: LocationType::CHOICES, message: 'Choose a valid type.')]
	private LocationType $type = LocationType::STADIUM;

	#[ORM\Column]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	#[Groups(['discipline:read'])]
	private ?\DateTimeImmutable $updatedAt = null;

	#[ORM\OneToMany(targetEntity: Record::class, mappedBy: 'location', cascade: ['persist', 'remove'])]
	private Collection $records;

	public function __construct()
	{
		$this->records = new ArrayCollection();
		$this->createdAt = new \DateTimeImmutable();
		$this->updatedAt = new \DateTimeImmutable();
	}

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

	public function getType(): LocationType
	{
		return $this->type;
	}

	public function setType(LocationType $type): static
	{
		$this->type = $type;
		return $this;
	}

	public function getCreatedAt(): ?\DateTimeImmutable
	{
		return $this->createdAt;
	}

	public function setCreatedAt(\DateTimeImmutable $createdAt): static
	{
		$this->createdAt = $createdAt;

		return $this;
	}

	public function getUpdatedAt(): ?\DateTimeImmutable
	{
		return $this->updatedAt;
	}

	public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
	{
		$this->updatedAt = $updatedAt;

		return $this;
	}

	public function getRecords(): Collection
	{
		return $this->records;
	}

	public function addRecord(Record $record): static
	{
		if (!$this->records->contains($record)) {
			$this->records->add($record);
			$record->setLocation($this);
		}
		return $this;
	}

	public function removeRecord(Record $record): static
	{
		if ($this->records->removeElement($record)) {
			$record->setLocation(null);
		}
		return $this;
	}
}
