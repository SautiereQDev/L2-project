<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Dto\DisciplineInput;
use App\Dto\DisciplineOutput;
use App\Enums\DisciplineType;
use App\Enums\RunningType;
use App\Repository\DisciplineRepository;
use App\State\DisciplineOutputProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Enums\CategorieType;

#[ApiResource(
	normalizationContext: [
		'groups' => ['discipline:read', 'record:read'],
		'enable_max_depth' => true,
	],
	denormalizationContext: ['groups' => ['discipline:write']],
	input: DisciplineInput::class,
	output: DisciplineOutput::class,
	provider: DisciplineOutputProvider::class
)]
#[ORM\Entity(repositoryClass: DisciplineRepository::class)]
class Discipline
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: "Le nom de la discipline est requis.")]
	#[Assert\Length(max: 255, maxMessage: "Le nom de la discipline ne doit pas dépasser {{ limit }} caractères.")]
	#[Assert\Regex(pattern: '/^[a-zA-ZÀ-ÿ\s\-]+$/', message: "Le nom de la discipline ne doit contenir que des lettres, des espaces et des tirets.")]
	private ?string $name = null;

	#[ORM\Column]
	#[Assert\Choice(choices: DisciplineType::VALID_VALUES, message: 'Choisissez un type valide.')]
	#[Assert\NotBlank(message: "Le type de la discipline est requis.")]
	private DisciplineType $type = DisciplineType::RUN;

	#[ORM\Column(length: 255, nullable: true)]
	#[Assert\NotBlank(message: "Les catégories de la discipline sont requises.")]
	#[Assert\Choice(choices: CategorieType::CHOICES, message: 'Choisissez une catégorie valide.')]
	private ?string $categorie = null;

	#[ORM\OneToMany(targetEntity: Record::class, mappedBy: 'discipline', cascade: ['persist', 'remove'])]
	#[Assert\Valid]
	#[Assert\Count(min: 2, minMessage: 'Il doit y avoir au moins deux records associés à cette discipline (H \& F).')]
	private ?Collection $records = null;

	#[ORM\Column]
	#[Assert\NotBlank(message: "La date de création est requise.")]
	#[Assert\DateTime(message: "La date de création doit être au format valide.")]
	#[Assert\LessThan('today', message: "La date de création doit être dans le passé.")]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	#[Assert\NotBlank(message: "La date de mise à jour est requise.")]
	#[Assert\DateTime(message: "La date de mise à jour doit être au format valide.")]
	#[Assert\LessThan('today', message: "La date de mise à jour doit être dans le passé.")]
	private ?\DateTimeImmutable $updatedAt = null;

	#[ORM\Column(nullable: true)]
	#[Assert\NotBlank(message: "Le type de course est requis.")]
	#[Assert\Choice(choices: RunningType::CHOICES, message: 'Choisissez un type valide pour la course.')]
	private ?RunningType $runningType = null;

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
		return $this->categorie;
	}

	public function setCategories(string $categories): static
	{
		$this->categorie = $categories;
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

	public function getRunningType(): ?RunningType
	{
		return $this->runningType;
	}

	public function setRunningType(RunningType $runningType): static
	{
		$this->runningType = $runningType;
		return $this;
	}
}
