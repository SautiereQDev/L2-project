<?php

namespace App\Entity;

use App\Repository\RecordRepository;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;

#[ORM\Entity(repositoryClass: RecordRepository::class)]
class Record
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    private ?string $discipline = null;

    #[ORM\Column(length: 255)]
    private ?string $athlete = null;

    #[ORM\Column(type: Types::DATE_MUTABLE)]
    private ?\DateTimeInterface $lastRecord = null;

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getDiscipline(): ?string
    {
        return $this->discipline;
    }

    public function setDiscipline(string $discipline): static
    {
        $this->discipline = $discipline;

        return $this;
    }

    public function getAthlete(): ?string
    {
        return $this->athlete;
    }

    public function setAthlete(string $athlete): static
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
}
