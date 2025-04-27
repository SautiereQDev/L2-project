<?php

namespace App\Command;

use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputArgument;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[AsCommand(
	name: 'app:create-user',
	description: 'Creates a new user.',
)]
class CreateUserCommand extends Command
{
	public function __construct(
		private readonly EntityManagerInterface      $entityManager,
		private readonly UserPasswordHasherInterface $passwordHasher,
		private readonly ValidatorInterface          $validator
	)
	{
		parent::__construct();
	}

	protected function configure(): void
	{
		$this
			->addArgument('email', InputArgument::REQUIRED, 'The email of the user.')
			->addArgument('password', InputArgument::REQUIRED, 'The password of the user.');
	}

	protected function execute(InputInterface $input, OutputInterface $output): int
	{
		$io = new SymfonyStyle($input, $output);
		$email = $input->getArgument('email');
		$password = $input->getArgument('password');

		// Vérification de l'existence de l'utilisateur
		$existingUser = $this->entityManager->getRepository(User::class)->findOneBy(['email' => $email]);
		if ($existingUser) {
			$io->error(sprintf('User with email "%s" already exists.', $email));
			return Command::FAILURE;
		}

		$user = new User();
		$user->setEmail($email);

		// Hachage du mot de passe
		$hashedPassword = $this->passwordHasher->hashPassword($user, $password);
		$user->setPassword($hashedPassword);

		// Attribution d'un rôle par défaut (à adapter si nécessaire)
		$user->setRoles(['ROLE_USER']);

		// Validation de l'entité utilisateur
		$errors = $this->validator->validate($user);
		if (count($errors) > 0) {
			$io->error('User validation failed:');
			// Affichage des erreurs de validation
			foreach ($errors as $error) {
				$io->error(sprintf('- %s: %s', $error->getPropertyPath(), $error->getMessage()));
			}
			return Command::FAILURE;
		}

		$this->entityManager->persist($user);
		$this->entityManager->flush();

		$io->success(sprintf('User "%s" was created successfully.', $email));

		return Command::SUCCESS;
	}
}
