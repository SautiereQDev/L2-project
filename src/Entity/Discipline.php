<?php

namespace App\Entity;

use App\Enums\DisciplineType;
use App\Repository\DisciplineRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
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


	// les deux records (H, F)
	#[ORM\OneToMany(targetEntity: Record::class, mappedBy: 'discipline', cascade: ['persist', 'remove'])]
	private ?Collection $records = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updatedAt = null;

	public function __construct()
	{
		$this->records = new ArrayCollection();
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

	public function getRecords(): ?Collection
	{
		return $this->records;
	}

	public function setRecords(Collection $records): static
	{
		$this->records = $records;
		return $this;
	}

	public function addRecord(Record $record): static
	{
		if (!$this->records->contains($record)) {
			$this->records[] = $record;
			$record->setDiscipline($this);
		}

		return $this;
	}

	public function removeRecord(Record $record): static
	{
		if ($this->records->removeElement($record) && $record->getDiscipline() === $this) {
			$record->setDiscipline($this);
		}
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
