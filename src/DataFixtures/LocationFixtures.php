<?php

namespace App\DataFixtures;

use App\Entity\Location;
use App\Enums\LocationType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use Faker\Factory;
use DateTimeImmutable;

class LocationFixtures extends Fixture
{
	public const LOCATION_PREFIX = 'location_';

	public function load(ObjectManager $manager): void
	{
		$faker = Factory::create('fr_FR');
		$now = new DateTimeImmutable();

		// Liste de noms de stades/complexes connus
		$stadiumNames = [
			'Stade de France', 'Olympic Stadium', 'Luzhniki Stadium',
			'Bird\'s Nest', 'Letzigrund Stadium', 'London Stadium',
			'Hayward Field', 'Olympiastadion Berlin', 'Stade Louis II'
		];

		foreach ($stadiumNames as $index => $name) {
			$location = new Location();
			$location->setName($name);
			$location->setCity($faker->city);
			$location->setCountry($faker->countryCode);
			$location->setCapacity($faker->numberBetween(10000, 80000));
			// Coordonnées aléatoires, mais dans des plages réalistes
			$location->setLatitude($faker->latitude(35, 60));
			$location->setLongitude($faker->longitude(-10, 30));
			$location->setType(LocationType::STADIUM);
			$location->setCreatedAt($now);
			$location->setUpdatedAt($now);

			$manager->persist($location);
			$this->addReference(self::LOCATION_PREFIX . $index, $location);
		}

		$manager->flush();
	}
}
