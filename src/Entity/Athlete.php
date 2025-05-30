<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiProperty;
use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use App\Enums\GenderType;
use App\Repository\AthleteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\HttpFoundation\File\File;
use Symfony\Component\Validator\Constraints as Assert;
use Vich\UploaderBundle\Mapping\Annotation as Vich;
use App\Dto\AthleteInput;
use App\Dto\AthleteMultipartInput;
use App\Dto\AthleteOutput;
use App\State\AthleteOutputProvider;
use App\State\AthleteProcessor;

#[
	ApiResource(
        operations: [
            new GetCollection(
                normalizationContext: ['groups' => ['athlete:read']],
                provider: AthleteOutputProvider::class
            ),
            new Get(
                normalizationContext: ['groups' => ['athlete:read']],
                provider: AthleteOutputProvider::class
            ),
            // JSON POST
            new Post(
                '/athletes',
                denormalizationContext: ['groups' => ['athlete:write']],
                normalizationContext: ['groups' => ['athlete:read']],
                input: AthleteInput::class,
                output: AthleteOutput::class,
                processor: AthleteProcessor::class
            ),
        ]
	),
	ORM\Entity(repositoryClass: AthleteRepository::class),
    ORM\HasLifecycleCallbacks,
    Vich\Uploadable
]
class Athlete
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
    // No #[Groups] needed here anymore for direct output, DTO handles it.
    // Keep if needed for relations in *other* DTOs.
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: "Le prénom de l'athlète est requis.")]
	#[Assert\Length(max: 255, maxMessage: "Le prénom de l'athlète ne doit pas dépasser {{ limit }} caractères.")]
	#[Assert\Regex(pattern: '/^[a-zA-ZÀ-ÿ\s-]+$/', message: "Le prénom de l'athlète ne doit contenir que des lettres, des espaces et des tirets.")]
    // No #[Groups] needed here anymore for direct output
	private ?string $firstname = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: "Le nom de l'athlète est requis.")]
	#[Assert\Length(max: 255, maxMessage: "Le nom de l'athlète ne doit pas dépasser {{ limit }} caractères.")]
	#[Assert\Regex(pattern: '/^[a-zA-ZÀ-ÿ\s-]+$/', message: "Le nom de l'athlète ne doit contenir que des lettres, des espaces et des tirets.")]
	private ?string $lastname = null;

	#[ORM\Column(length: 2)]
	#[Assert\NotBlank(message: "Le code du pays est requis.")]
	#[Assert\Length(min: 2, max: 2, exactMessage: "Le code pays doit comporter exactement {{ limit }} caractères.")]
	#[Assert\Regex(pattern: '/^[A-Z]{2}$/', message: "Le code pays doit être composé de 2 lettres majuscules.")]
	private ?string $country = null;

	#[ORM\Column(type: Types::DATE_MUTABLE)]
	#[Assert\NotNull(message: "La date de naissance de l'athlète est requise.")]
	#[Assert\Type(type: \DateTimeInterface::class, message: "La date de naissance doit être une date valide.")]
	#[Assert\LessThan('today', message: "La date de naissance doit être dans le passé.")]
	#[Assert\GreaterThan('1900-01-01', message: "La date de naissance doit être après le 1er janvier 1900.")]
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
	private Collection $records;

	#[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column(options: ['default' => 'CURRENT_TIMESTAMP'])]
	private ?\DateTimeImmutable $updatedAt = null;

	#[ORM\Column(length: 255)]
	#[Assert\NotBlank(message: "Le genre de l'athlète est requis.")]
	private GenderType $gender = GenderType::MEN;

	// VichUploader fields for profile image
	#[Vich\UploadableField(mapping: 'athlete_profile_image', fileNameProperty: 'profileImageName', size: 'profileImageSize')]
	private ?File $profileImageFile = null;

	#[ORM\Column(nullable: true)]
	private ?string $profileImageName = null;

	#[ORM\Column(nullable: true)]
	private ?int $profileImageSize = null;

	#[ORM\Column(nullable: true)]
	private ?\DateTimeImmutable $profileImageUpdatedAt = null;

	public function __construct()
	{
		$this->records = new ArrayCollection();
		$this->createdAt = new \DateTimeImmutable();
		$this->updatedAt = new \DateTimeImmutable();
	}

	#[ORM\PrePersist]
	public function setCreatedAtValue(): void
	{
		if ($this->createdAt === null) {
			$this->createdAt = new \DateTimeImmutable();
		}
		$this->updatedAt = new \DateTimeImmutable();
	}

	#[ORM\PreUpdate]
	public function setUpdatedAtValue(): void
	{
		$this->updatedAt = new \DateTimeImmutable();
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

	// VichUploader methods
	public function setProfileImageFile(?File $profileImageFile = null): void
	{
		$this->profileImageFile = $profileImageFile;

		if (null !== $profileImageFile) {
			// It is required that at least one field changes if you are using doctrine
			// otherwise the event listeners won't be called and the file is lost
			$this->profileImageUpdatedAt = new \DateTimeImmutable();
		}
	}

	public function getProfileImageFile(): ?File
	{
		return $this->profileImageFile;
	}

	public function setProfileImageName(?string $profileImageName): void
	{
		$this->profileImageName = $profileImageName;
	}

	public function getProfileImageName(): ?string
	{
		return $this->profileImageName;
	}

	public function setProfileImageSize(?int $profileImageSize): void
	{
		$this->profileImageSize = $profileImageSize;
	}

	public function getProfileImageSize(): ?int
	{
		return $this->profileImageSize;
	}

	public function getProfileImageUpdatedAt(): ?\DateTimeImmutable
	{
		return $this->profileImageUpdatedAt;
	}

	public function setProfileImageUpdatedAt(?\DateTimeImmutable $profileImageUpdatedAt): void
	{
		$this->profileImageUpdatedAt = $profileImageUpdatedAt;
	}
}

