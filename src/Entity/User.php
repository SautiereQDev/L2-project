<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\UserRepository;
use App\State\UserPasswordHasher;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use App\Controller\UserController;

#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
#[UniqueEntity(fields: ['email'], message: 'Il y a déjà un compte avec cet e-mail')]
#[ApiResource(
	operations: [

		new Get(
			uriTemplate: '/me',
			controller: UserController::class,
			normalizationContext: ['groups' => ['user:read']],
			security: "is_granted('ROLE_USER')",
			read: false,
			name: 'app_me'
		),
		new GetCollection(
			normalizationContext: ['groups' => ['user:read']],
			security: "is_granted('ROLE_ADMIN')"
		),
		new Post(
			uriTemplate: '/register',
			normalizationContext: ['groups' => ['user:read']],
			denormalizationContext: ['groups' => ['user:create']],
			validationContext: ['groups' => ['user:create']],
			name: 'app_user_register',
			processor: UserPasswordHasher::class
		),
		new Get(
			normalizationContext: ['groups' => ['user:read']],
			security: "is_granted('ROLE_ADMIN') or object == user"
		),
		new Put(
			normalizationContext: ['groups' => ['user:read']],
			denormalizationContext: ['groups' => ['user:update']],
			security: "is_granted('ROLE_ADMIN') or object == user",
			validationContext: ['groups' => ['user:update']],
			processor: UserPasswordHasher::class
		),
		new Delete(
			security: "is_granted('ROLE_ADMIN') or object == user"
		)
	],
	normalizationContext: ['groups' => ['user:read']],
	denormalizationContext: ['groups' => ['user:create']]
)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
	#[ORM\Id]
	#[ORM\GeneratedValue]
	#[ORM\Column]
	#[Groups(['user:read'])]
	private ?int $id = null;

	#[ORM\Column(length: 180)]
	#[Groups(['user:read', 'user:create', 'user:update'])]
	#[Assert\NotBlank(groups: ['user:create'])]
	#[Assert\Email(groups: ['user:create', 'user:update'])]
	private ?string $email = null;

	/**
	 * @var list<string> The user roles
	 */
	#[ORM\Column]
	#[Groups(['user:read'])]
	private array $roles = [];

	/**
	 * @var string The hashed password
	 */
	#[ORM\Column]
	#[Groups(['user:create', 'user:update'])]
	#[Assert\NotBlank(groups: ['user:create'])]
	#[Assert\Length(min: 6, groups: ['user:create', 'user:update'])]
	private ?string $password = null;

	#[ORM\Column(length: 255, nullable: true)]
	#[Groups(['user:read', 'user:create', 'user:update'])]
	private ?string $firstName = null;

	#[ORM\Column(length: 255, nullable: true)]
	#[Groups(['user:read', 'user:create', 'user:update'])]
	private ?string $lastName = null;

	#[ORM\Column]
	#[Groups(['user:read'])]
	private \DateTimeImmutable $createdAt;

	#[ORM\Column]
	#[Groups(['user:read'])]
	private \DateTimeImmutable $updatedAt;

	public function __construct()
	{
		$this->createdAt = new \DateTimeImmutable();
		$this->updatedAt = new \DateTimeImmutable();
	}

	public function getId(): ?int
	{
		return $this->id;
	}

	public function getEmail(): ?string
	{
		return $this->email;
	}

	public function setEmail(string $email): static
	{
		$this->email = $email;

		return $this;
	}

	/**
	 * A visual identifier that represents this user.
	 *
	 * @see UserInterface
	 */
	public function getUserIdentifier(): string
	{
		return (string)$this->email;
	}

	/**
	 * @return list<string>
	 * @see UserInterface
	 *
	 */
	public function getRoles(): array
	{
		$roles = $this->roles;
		// guarantee every user at least has ROLE_USER
		$roles[] = 'ROLE_USER';

		return array_unique($roles);
	}

	/**
	 * @param list<string> $roles
	 */
	public function setRoles(array $roles): static
	{
		$this->roles = $roles;

		return $this;
	}

	/**
	 * @see PasswordAuthenticatedUserInterface
	 */
	public function getPassword(): ?string
	{
		return $this->password;
	}

	public function setPassword(string $password): static
	{
		$this->password = $password;

		return $this;
	}

	/**
	 * @see UserInterface
	 */
	public function eraseCredentials(): void
	{
		// If you store any temporary, sensitive data on the user, clear it here
		// $this->plainPassword = null;
	}

	public function getFirstName(): ?string
	{
		return $this->firstName;
	}

	public function setFirstName(?string $firstName): static
	{
		$this->firstName = $firstName;

		return $this;
	}

	public function getLastName(): ?string
	{
		return $this->lastName;
	}

	public function setLastName(?string $lastName): static
	{
		$this->lastName = $lastName;

		return $this;
	}

	public function getCreatedAt(): \DateTimeImmutable
	{
		return $this->createdAt;
	}

	public function getUpdatedAt(): \DateTimeImmutable
	{
		return $this->updatedAt;
	}

	public function setUpdatedAt(\DateTimeImmutable $updatedAt): static
	{
		$this->updatedAt = $updatedAt;

		return $this;
	}

	public function getName(): ?string
	{
		if ($this->firstName && $this->lastName) {
			return $this->firstName . ' ' . $this->lastName;
		}
		return $this->firstName ?: $this->lastName;
	}

	public function setName(?string $name): static
	{
		if ($name) {
			$parts = explode(' ', $name, 2);
			$this->firstName = $parts[0];
			$this->lastName = $parts[1] ?? null;
		}
		return $this;
	}
}
