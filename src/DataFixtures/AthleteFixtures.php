<?php

namespace App\DataFixtures;

use App\Entity\Athlete;
use App\Enums\GenderType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use DateTimeImmutable;

class AthleteFixtures extends Fixture
{
	public const ATHLETE_PREFIX = 'athlete_';

	public function load(ObjectManager $manager): void
	{
		$faker = Factory::create('fr_FR');
		$now = new DateTimeImmutable();

		// Créer 50 athlètes avec des données réalistes
		for ($i = 0; $i < 50; $i++) {
			$athlete = new Athlete();

			$gender = $faker->randomElement(['M', 'W']);
			$firstName = $gender === 'M' ? $faker->firstNameMale : $faker->firstNameFemale;

			$athlete->setFirstName($firstName);
			$athlete->setLastName($faker->lastName);
			$athlete->setGender(GenderType::from($gender));
			$athlete->setBirthdate($faker->dateTimeBetween('-35 years', '-18 years'));
			$athlete->setCountry($faker->countryCode);
			
			// Ajouter une photo de profil aléatoire entre 1.jpeg et 10.jpeg
			$randomImageNumber = $faker->numberBetween(1, 10);
			$athlete->setProfileImageName($randomImageNumber . '.jpeg');
			
			$athlete->setCreatedAt($now);
			$athlete->setUpdatedAt($now);

			$manager->persist($athlete);
			$this->addReference(self::ATHLETE_PREFIX . $i, $athlete);
		}

		$manager->flush();
	}
}
