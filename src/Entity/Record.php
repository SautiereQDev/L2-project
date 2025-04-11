<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enums\GenderType;
use App\Repository\RecordRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ApiResource(
	normalizationContext: ['groups' => ['record:read']],
	denormalizationContext: ['groups' => ['record:write']],
)]
#[ORM\Entity(repositoryClass: RecordRepository::class)]
class Record implements \JsonSerializable
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\ManyToOne(inversedBy: 'records')]
	#[Assert\NotBlank(message: 'Discipline cannot be blank')]
	private ?Discipline $discipline = null;

	#[ORM\ManyToOne(inversedBy: 'records')]
	#[Assert\NotBlank(message: 'Athlete cannot be blank')]
	private ?Athlete $athlete = null;

	#[ORM\Column(type: Types::DATE_MUTABLE)]
	#[Assert\NotBlank(message: 'Date cannot be blank')]
	#[Assert\Date(message: 'The date "{{ value }}" is not a valid date.')]
	private ?\DateTimeInterface $lastRecord = null;

	#[ORM\Column]
	private \DateTime|float|null $performance = null;

	#[ORM\Column(type: 'string', length: 1, enumType: GenderType::class)]
	#[Assert\Choice(choices: GenderType::CHOICES, message: 'Choisissez un genre valide.')]
	private ?GenderType $genre = GenderType::MEN;

	#[ORM\Column]
	#[Assert\NotBlank(message: 'The record performance cannot be blank')]
	private ?bool $isCurrentRecord = false;

	#[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'nextRecords')]
	#[ORM\JoinColumn(nullable: true)]
	private ?self $previousRecord = null;

	#[ORM\OneToMany(targetEntity: self::class, mappedBy: 'previousRecord')]
	#[ORM\JoinColumn(nullable: true)]
	private ?Collection $nextRecords;

	#[ORM\Column]
	private ?bool $isActive = true;

	#[ORM\Column]
	#[Assert\NotBlank(message: 'The record creation date cannot be blank')]
	#[Assert\DateTime(message: 'The date "{{ value }}" is not a valid date.')]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	#[Assert\NotBlank(message: 'The record update date cannot be blank')]
	#[Assert\DateTime(message: 'The date "{{ value }}" is not a valid date.')]
	private ?\DateTimeImmutable $updatedAt = null;

	#[ORM\ManyToOne(targetEntity: Location::class, inversedBy: 'disciplines')]
	#[Assert\NotBlank(message: 'Location cannot be blank')]
	private ?Location $location = null;

	public function __construct()
	{
		$this->nextRecords = new ArrayCollection();
	}

	public function isCurrentRecord(): bool
	{
		return $this->isCurrentRecord;
	}

	public function setIsCurrentRecord(bool $isCurrentRecord): static
	{
		$this->isCurrentRecord = $isCurrentRecord;

		return $this;
	}

	public function getPreviousRecord(): ?self
	{
		return $this->previousRecord;
	}

	public function setPreviousRecord(?self $previousRecord): static
	{
		$this->previousRecord = $previousRecord;

		return $this;
	}

	/**
	 * @return Collection<int, Record>
	 */
	public function getNextRecords(): Collection
	{
		return $this->nextRecords;
	}

	public function addNextRecord(self $nextRecord): static
	{
		if (!$this->nextRecords->contains($nextRecord)) {
			$this->nextRecords->add($nextRecord);
			$nextRecord->setPreviousRecord($this);
		}

		return $this;
	}

	public function removeNextRecord(self $nextRecord): static
	{
		if ($this->nextRecords->removeElement($nextRecord) && $nextRecord->getPreviousRecord() === $this) {
			$nextRecord->setPreviousRecord(null);
		}

		return $this;
	}

	public function getPerformance(): \DateTime|float|null
	{
		return $this->performance;
	}

	public function setPerformance(\DateTime|float|null $performance): static
	{
		$this->performance = $performance;

		return $this;
	}

	public function getGenre(): GenderType
	{
		return $this->genre;
	}

	public function setGenre(GenderType $genre): static
	{
		$this->genre = $genre;

		return $this;
	}

	public function isActive(): ?bool
	{
		return $this->isActive;
	}

	public function setIsActive(bool $isActive): static
	{
		$this->isActive = $isActive;

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

	public function getId(): ?int
	{
		return $this->id;
	}

	public function setId(?int $id): static
	{
		$this->id = $id;
		return $this;
	}

	public function getDiscipline(): ?Discipline
	{
		return $this->discipline;
	}

	public function setDiscipline(?Discipline $discipline): static
	{
		$this->discipline = $discipline;
		return $this;
	}

	public function getAthlete(): ?Athlete
	{
		return $this->athlete;
	}

	public function setAthlete(?Athlete $athlete): static
	{
		$this->athlete = $athlete;
		return $this;
	}

	public function getLastRecord(): ?\DateTimeInterface
	{
		return $this->lastRecord;
	}

	public function setLastRecord(?\DateTimeInterface $lastRecord): static
	{
		$this->lastRecord = $lastRecord;
		return $this;
	}

	public function getTime(): \DateTime
	{
		return $this->time;
	}

	public function setTime(\DateTime $time): static
	{
		$this->time = $time;

		return $this;
	}

	public function getLocation(): ?Location
	{
		return $this->location;
	}

	public function setLocation(?Location $location): static
	{
		$this->location = $location;

		return $this;
	}

	public function jsonSerialize(): array
	{
		return [
			'id' => $this->id,
			'discipline' => $this->discipline,
			'athlete' => $this->athlete,
			'lastRecord' => $this->lastRecord,
			'performance' => $this->performance,
			'genre' => $this->genre,
			'isCurrentRecord' => $this->isCurrentRecord,
			'previousRecord' => $this->previousRecord,
			'nextRecords' => $this->nextRecords,
			'isActive' => $this->isActive,
			'createdAt' => $this->createdAt,
			'updatedAt' => $this->updatedAt,
			'location' => $this->location
		];
	}
}
