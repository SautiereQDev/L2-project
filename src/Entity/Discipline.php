<?php

namespace App\Entity;

use App\Enums\DisciplineType;
use App\Repository\DisciplineRepository;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: DisciplineRepository::class)]
class Discipline
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	private ?string $name = null;

	#[ORM\Column]
	private DisciplineType $type = DisciplineType::RUN;

	#[ORM\Column(length: 255, nullable: true)]
	private ?string $categories = null;

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

	public function getType(): DisciplineType
	{
		return $this->type;
	}

	public function setType(DisciplineType $type): static
	{
		$this->type = $type;

		return $this;
	}

	public function getCategories(): ?string
	{
		return $this->categories;
	}

	public function setCategories(string $categories): static
	{
		$this->categories = $categories;

		return $this;
	}
}
