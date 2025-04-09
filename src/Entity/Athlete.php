<?php

namespace App\Entity;

use App\Enums\GenderType;
use App\Repository\AthleteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use PHPUnit\Util\Json;
use SebastianBergmann\Type\MixedType;
use Symfony\Component\Validator\Constraints as Assert;

#[ORM\Entity(repositoryClass: AthleteRepository::class)]
class Athlete implements \JsonSerializable
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	private ?int $id = null;

	#[ORM\Column(length: 255)]
	private ?string $firstname = null;

	#[ORM\Column(length: 255)]
	private ?string $lastname = null;

	#[ORM\Column(length: 255)]
	private ?string $country = null;

	#[ORM\Column(type: Types::DATE_MUTABLE)]
	private ?\DateTimeInterface $birthdate = null;

	#[ORM\Column(nullable: true)]
	private ?int $heigth = null;

	#[ORM\Column(nullable: true)]
	private ?int $weigth = null;

	#[ORM\Column(length: 255, nullable: true)]
	private ?string $coach = null;

	#[ORM\OneToMany(targetEntity: Record::class, mappedBy: 'athlete')]
	private Collection $records;

	#[ORM\Column]
	private ?\DateTimeImmutable $createdAt = null;

	#[ORM\Column]
	private ?\DateTimeImmutable $updatedAt = null;

	#[ORM\Column]
	#[Assert\Choice("Vous devez choisir parmis les options de GenderType", GenderType::CHOICES)]
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
