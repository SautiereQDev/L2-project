<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Enums\GenderType;
use App\Repository\AthleteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Validator\Constraints as Assert;

#[
	ApiResource(
		normalizationContext: ['groups' => ['athlete:read']],
		denormalizationContext: ['groups' => ['athlete:write']],
	),
	ORM\Entity(repositoryClass: AthleteRepository::class)
]
class Athlete implements \JsonSerializable
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	#[Groups(['athlete:read'])]
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: "Le prénom de l'athlète est requis.")]
	#[Assert\Length(max: 255, maxMessage: "Le prénom de l'athlète ne doit pas dépasser {{ limit }} caractères.")]
	#[Assert\Regex(pattern: '/^[a-zA-ZÀ-ÿ\s-]+$/', message: "Le prénom de l'athlète ne doit contenir que des lettres, des espaces et des tirets.")]
	#[Groups(['athlete:read', 'athlete:write'])]
	private ?string $firstname = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: "Le nom de l'athlète est requis.")]
	#[Assert\Length(max: 255, maxMessage: "Le nom de l'athlète ne doit pas dépasser {{ limit }} caractères.")]
	#[Assert\Regex(pattern: '/^[a-zA-ZÀ-ÿ\s-]+$/', message: "Le nom de l'athlète ne doit contenir que des lettres, des espaces et des tirets.")]
	#[Groups(['athlete:read', 'athlete:write'])]
	private ?string $lastname = null;

	#[ORM\Column(length: 2)]
	#[Assert\NotBlank(message: "Le code du pays est requis.")]
	#[Assert\Length(min: 2, max: 2, exactMessage: "Le code pays doit comporter exactement {{ limit }} caractères.")]
	#[Assert\Regex(pattern: '/^[A-Z]{2}$/', message: "Le code pays doit être composé de 2 lettres majuscules.")]
	private ?string $country = null;

	#[ORM\Column(type: Types::DATE_MUTABLE)]
	#[Assert\NotBlank(message: "La date de naissance de l'athlète est requise.")]
	#[Assert\Date(message: "La date de naissance de l'athlète doit être au format valide.")]
	#[Assert\LessThan('today', message: "La date de naissance de l'athlète doit être dans le passé.")]
	#[Assert\GreaterThan('1900-01-01', message: "La date de naissance de l'athlète doit être après le 1er janvier 1900.")]
	#[Groups(['athlete:read', 'athlete:write'])]
	private ?\DateTimeInterface $birthdate = null;

	#[ORM\Column(type: 'integer', nullable: true)]
	#[Assert\LessThan(300, message: "La taille de l'athlète ne doit pas dépasser {{ limit }} cm.")]
	#[Assert\Positive(message: "La taille de l'athlète doit être un nombre positif.")]
	private ?int $heigth = null;

	#[ORM\Column(type: 'integer', nullable: true)]
	#[Assert\LessThan(500, message: "Le poids de l'athlète ne doit pas dépasser {{ limit }} kg.")]
	#[Assert\Positive(message: "Le poids de l'athlète doit être un nombre positif.")]
	private ?int $weigth = null;

	#[ORM\Column(length: 255, nullable: true)]
	#[Assert\Length(max: 255, maxMessage: "Le nom de l'entraîneur ne doit pas dépasser {{ limit }} caractères.")]
	#[Assert\Regex(pattern: '/^[a-zA-ZÀ-ÿ\s-]+$/', message: "Le nom de l'entraîneur ne doit contenir que des lettres, des espaces et des tirets.")]
	private ?string $coach = null;

	#[ORM\OneToMany(targetEntity: Record::class, mappedBy: 'athlete')]
	#[Groups(['athlete:read', 'athlete:write'])]
	private Collection $records;

	#[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
	#[Assert\NotBlank(message: "La date de création est requise.")]
	#[Assert\DateTime(message: "La date de création doit être au format valide.")]
	#[Groups(['athlete:read'])]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
	#[Assert\NotBlank(message: "La date de mise à jour est requise.")]
	#[Assert\DateTime(message: "La date de mise à jour doit être au format valide.")]
	#[Groups(['athlete:read'])]
	private ?\DateTimeImmutable $updatedAt = null;

	#[ORM\Column(length: 255)]
	#[Assert\Choice(choices: GenderType::CHOICES, message: "Vous devez choisir parmis les options de GenderType")] #[Assert\NotBlank(message: "Le genre de l'athlète est requis.")]
	#[Groups(['athlete:read', 'athlete:write'])]
	private GenderType $gender = GenderType::MEN;

	public function __construct()
	{
		$this->records = new ArrayCollection();
	}

	public function getId(): ?int
	{
		return $this->id;
	}

	public function getFirstname(): ?string
	{
		return $this->firstname;
	}

	public function setFirstname(string $firstname): static
	{
		$this->firstname = $firstname;
		return $this;
	}

	public function getLastname(): ?string
	{
		return $this->lastname;
	}

	public function setLastname(string $lastname): static
	{
		$this->lastname = $lastname;
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

	public function getBirthdate(): ?\DateTimeInterface
	{
		return $this->birthdate;
	}

	public function setBirthdate(\DateTimeInterface $birthdate): static
	{
		$this->birthdate = $birthdate;
		return $this;
	}

	public function getHeigth(): ?int
	{
		return $this->heigth;
	}

	public function setHeigth(?int $heigth): static
	{
		$this->heigth = $heigth;
		return $this;
	}

	public function getWeigth(): ?int
	{
		return $this->weigth;
	}

	public function setWeigth(?int $weigth): static
	{
		$this->weigth = $weigth;
		return $this;
	}

	public function getCoach(): ?string
	{
		return $this->coach;
	}

	public function setCoach(?string $coach): static
	{
		$this->coach = $coach;
		return $this;
	}

	/**
	 * @return Collection<int, Record>
	 * @description This method returns the collection of records associated with the athlete.
	 */
	public function getRecords(): Collection
	{
		return $this->records;
	}

	/**
	 * @param Record $record
	 * @return static
	 * @description This method adds a record to the athlete's records collection.
	 */
	public function addRecord(Record $record): static
	{
		if (!$this->records->contains($record)) {
			$this->records->add($record);
			$record->setAthlete($this);
		}
		return $this;
	}

	/**
	 * @param Record $record
	 * @param Athlete $newRecordMan
	 * @return static
	 * @description This method removes a record from the athlete's records collection.
	 */
	public function removeRecord(Record $record, Athlete $newRecordMan): static
	{
		if ($this->records->removeElement($record) && $record->getAthlete() === $this) {
			$record->setAthlete($newRecordMan);
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

	public function getGender(): GenderType
	{
		return $this->gender;
	}

	public function setGender(GenderType $type): static
	{
		$this->gender = $type;
		return $this;
	}

	public function jsonSerialize(): array
	{
		return [
			'id' => $this->getId(),
			'firstname' => $this->getFirstname(),
			'lastname' => $this->getLastname(),
			'country' => $this->getCountry(),
			'birthdate' => $this->getBirthdate()?->format('Y-m-d'),
			'heigth' => $this->getHeigth(),
			'weigth' => $this->getWeigth(),
			'coach' => $this->getCoach(),
			'createdAt' => $this->getCreatedAt()?->format('Y-m-d H:i:s'),
			'updatedAt' => $this->getUpdatedAt()?->format('Y-m-d H:i:s'),
			'gender' => $this->getGender()->value,
		];
	}
}
