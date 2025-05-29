<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Doctrine\Orm\Filter\OrderFilter;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Doctrine\Orm\Filter\DateFilter;
use ApiPlatform\Metadata\ApiFilter;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use App\Enums\GenderType;
use App\Repository\RecordRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Dto\RecordInput;
use App\Dto\RecordOutput;
use Symfony\Component\Serializer\Annotation\MaxDepth;
use App\Enums\CategorieType;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use App\State\RecordOutputProvider;

#[ApiResource(
	operations: [
		new GetCollection(),
		new Get(),
		new Post(),
		new Put()
	],
	normalizationContext: ['groups' => ['record:read'], 'enable_max_depth' => true],
	denormalizationContext: ['groups' => ['record:write']],
	input: RecordInput::class,
	output: RecordOutput::class,
	provider: RecordOutputProvider::class
)]
#[ApiFilter(OrderFilter::class, properties: [
	'id',
	'discipline.name',
	'athlete.lastname',
	'athlete.firstname',
	'performance',
	'lastRecord',
	'genre',
	'categorie',
	'location.name',
	'isCurrentRecord'
], arguments: ['orderParameterName' => 'order'])]
#[ApiFilter(SearchFilter::class, properties: [
	'discipline.type' => 'exact',
	'genre' => 'exact',
	'categorie' => 'exact',
	'athlete.lastname' => 'partial',
	'athlete.firstname' => 'partial'
])]
#[ApiFilter(DateFilter::class, properties: ['lastRecord'])]
#[ORM\Entity(repositoryClass: RecordRepository::class)]
#[UniqueEntity(
	fields: ['discipline', 'genre', 'categorie'],
	message: 'Ce record existe déjà pour cette discipline, ce genre et cette catégorie d\'âge.',
	errorPath: 'categorie'
)]
class Record
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\ManyToOne(inversedBy: 'records')]
	#[Assert\NotBlank(message: 'Discipline cannot be blank')]
	#[ApiProperty(readableLink: true)]
	#[MaxDepth(1)]
	#[Groups(['record:read', 'record:write'])]
	private ?Discipline $discipline = null;

	#[ORM\ManyToOne(inversedBy: 'records')]
	#[Assert\NotBlank(message: 'Athlete cannot be blank')]
	#[ApiProperty(readableLink: true)]
	#[MaxDepth(1)]
	#[Groups(['record:read', 'record:write'])]
	private ?Athlete $athlete = null;

	#[ORM\Column(type: Types::DATE_MUTABLE)]
	#[Groups(['record:read', 'record:write'])]
	private ?\DateTimeInterface $lastRecord = null;

	#[ORM\Column]
	#[Groups(['record:read', 'record:write'])]
	private \DateTime|float|null $performance = null;

	#[ORM\Column(type: 'string', length: 10, nullable: true, enumType: CategorieType::class)]
	#[Groups(['record:read', 'record:write'])]
	private ?CategorieType $categorie = null;

	#[ORM\Column(type: 'string', length: 1, enumType: GenderType::class)]
	#[Groups(['record:read', 'record:write'])]
	private ?GenderType $genre = null;

	#[ORM\Column]
	#[Groups(['record:read', 'record:write'])]
	private ?bool $isCurrentRecord = false;

	#[ORM\ManyToOne(targetEntity: self::class, inversedBy: 'nextRecords')]
	#[ORM\JoinColumn(nullable: true)]
	#[ApiProperty(readableLink: true)]
	#[MaxDepth(1)]
	#[Groups(['record:read', 'record:write'])]
	private ?self $previousRecord = null;

	#[ORM\OneToMany(targetEntity: self::class, mappedBy: 'previousRecord')]
	#[ApiProperty(readableLink: true)]
	#[MaxDepth(1)]
	#[Groups(['record:read', 'record:write'])]
	private Collection $nextRecords;

	#[ORM\Column]
	#[Groups(['record:read', 'record:write'])]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	#[Groups(['record:read', 'record:write'])]
	private ?\DateTimeImmutable $updatedAt = null;

	#[ORM\ManyToOne(targetEntity: Location::class, inversedBy: 'records')]
	#[ORM\JoinColumn(nullable: false)]
	#[ApiProperty(readableLink: true)]
	#[MaxDepth(1)]
	#[Groups(['record:read', 'record:write'])]
	private ?Location $location = null;

	public function __construct()
	{
		$this->nextRecords = new ArrayCollection();
	}

	public function getId(): ?int
	{
		return $this->id;
	}

	public function getDiscipline(): ?Discipline
	{
		return $this->discipline;
	}

	public function setDiscipline(?Discipline $discipline): self
	{
		$this->discipline = $discipline;
		return $this;
	}

	public function getAthlete(): ?Athlete
	{
		return $this->athlete;
	}

	public function setAthlete(?Athlete $athlete): self
	{
		$this->athlete = $athlete;
		return $this;
	}

	public function getLastRecord(): ?\DateTimeInterface
	{
		return $this->lastRecord;
	}

	public function setLastRecord(?\DateTimeInterface $lastRecord): self
	{
		$this->lastRecord = $lastRecord;
		return $this;
	}

	public function getPerformance(): \DateTime|float|null
	{
		return $this->performance;
	}

	public function setPerformance(\DateTime|float|null $performance): self
	{
		$this->performance = $performance;
		return $this;
	}

	public function getCategorie(): ?CategorieType
	{
		return $this->categorie;
	}

	public function setCategorie(?CategorieType $categorie): self
	{
		$this->categorie = $categorie;
		return $this;
	}

	public function getGenre(): ?GenderType
	{
		return $this->genre;
	}

	public function setGenre(GenderType $genre): self
	{
		$this->genre = $genre;
		return $this;
	}

	public function isCurrentRecord(): ?bool
	{
		return $this->isCurrentRecord;
	}

	public function setIsCurrentRecord(bool $isCurrentRecord): self
	{
		$this->isCurrentRecord = $isCurrentRecord;
		return $this;
	}

	public function getPreviousRecord(): ?self
	{
		return $this->previousRecord;
	}

	public function setPreviousRecord(?self $previousRecord): self
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

	public function addNextRecord(self $nextRecord): self
	{
		if (!$this->nextRecords->contains($nextRecord)) {
			$this->nextRecords->add($nextRecord);
			$nextRecord->setPreviousRecord($this);
		}
		return $this;
	}

	public function removeNextRecord(self $nextRecord): self
	{
		if ($this->nextRecords->removeElement($nextRecord) && $nextRecord->getPreviousRecord() === $this) {
			$nextRecord->setPreviousRecord(null);
		}
		return $this;
	}

	public function getCreatedAt(): ?\DateTimeImmutable
	{
		return $this->createdAt;
	}

	public function setCreatedAt(\DateTimeImmutable $createdAt): self
	{
		$this->createdAt = $createdAt;
		return $this;
	}

	public function getUpdatedAt(): ?\DateTimeImmutable
	{
		return $this->updatedAt;
	}

	public function setUpdatedAt(\DateTimeImmutable $updatedAt): self
	{
		$this->updatedAt = $updatedAt;
		return $this;
	}

	public function getLocation(): ?Location
	{
		return $this->location;
	}

	public function setLocation(?Location $location): self
	{
		$this->location = $location;
		return $this;
	}

}
