<?php

namespace App\Entity;

use App\Enums\GenderType;
use App\Repository\RecordRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: RecordRepository::class)]
class Record
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[Assert\NotBlank(message: 'Discipline cannot be blank')]
	private ?Discipline $discipline = null;

	#[ORM\ManyToOne(targetEntity: Athlete::class, inversedBy: 'records')]
	#[Assert\NotBlank(message: 'Athlete cannot be blank')]
	private ?Athlete $athlete = null;

	#[ORM\Column(type: Types::DATE_MUTABLE)]
	#[Assert\NotBlank(message: 'Date cannot be blank')]
	#[Assert\Date(message: 'The date "{{ value }}" is not a valid date.')]
	private ?\DateTimeInterface $lastRecord = null;

	#[ORM\Column(type: 'string', length: 1, enumType: GenderType::class)]
	#[Assert\Choice(choices: GenderType::CHOICES, message: 'Choisissez un genre valide.')]
	private GenderType $genre = GenderType::HOMME;

	#[ORM\Column]
	private bool $isActive = true;

	#[ORM\Column]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	private ?\DateTimeImmutable $updatedAt = null;

	public function getId(): ?int
	{
		return $this->id;
	}

	public function getDiscipline(): Discipline
	{
		return $this->discipline;
	}

	public function setDiscipline(Discipline $discipline): static
	{
		$this->discipline = $discipline;

		return $this;
	}

	public function getAthlete(): ?Athlete
	{
		return $this->athlete;
	}

	public function setAthlete(Athlete $athlete): static
	{
		$this->athlete = $athlete;

		return $this;
	}

	public function getLastRecord(): ?\DateTimeInterface
	{
		return $this->lastRecord;
	}

	public function setLastRecord(\DateTimeInterface $lastRecord): static
	{
		$this->lastRecord = $lastRecord;

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
}
