<?php

namespace App\DataFixtures;

use App\Entity\Record;
use App\Entity\Discipline;
use App\Entity\Athlete;
use App\Entity\Location;
use App\Enums\DisciplineType;
use App\Enums\RunningType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use DateTime;
use DateTimeImmutable;
use DateTimeZone;
use Faker\Factory;
use Random\RandomException;

class RecordFixtures extends Fixture implements DependentFixtureInterface
{
	public function load(ObjectManager $manager): void
	{
		$faker = Factory::create('fr_FR');
		$now = new DateTimeImmutable();

		// Utiliser une référence de location existante
		$location = $this->getReference(LocationFixtures::LOCATION_PREFIX . 0, Location::class);

		// Créer des records pour chaque discipline
		foreach ($this->getDisciplinesReferences() as $disciplineRef) {
			try {
				$discipline = $this->getReference($disciplineRef, Discipline::class);
				$disciplineType = $discipline->getType();

				// Générer plusieurs performances pour cette discipline
				for ($i = 0; $i < $faker->numberBetween(3, 8); $i++) {
					$record = new Record();
					$record->setDiscipline($discipline);
					$athlete = $this->getReference(AthleteFixtures::ATHLETE_PREFIX . $faker->numberBetween(0, 49), Athlete::class);
					$record->setAthlete($athlete);
					$competitionDate = $faker->dateTimeBetween('-5 years', 'now');
					$record->setCreatedAt(DateTimeImmutable::createFromMutable($competitionDate));
					$record->setLastRecord($competitionDate);
					$record->setLocation($location);

					// Générer une performance adaptée au type de discipline
					if ($disciplineType === DisciplineType::RUN) {
						$runningType = $discipline->getRunningType();
						$performanceTime = $this->generateRunningTime($runningType);
						// Conversion du DateTime en float (secondes avec microsecondes)
						$performanceFloat = (float)$performanceTime->format('U.u');
						$record->setPerformance($performanceFloat);
						$record->setTime($performanceTime);
					} else {
						$distance = $this->generateDistance($disciplineType);
						$record->setPerformance($distance);
						$record->setTime(new DateTime('2000-01-01 00:00:00', new DateTimeZone('UTC')));
					}

					// Définir le genre du record en fonction de l'athlète
					$record->setGenre($athlete->getGender());
					$record->setCreatedAt($now);
					$record->setUpdatedAt($now);

					$manager->persist($record);
				}
			} catch (\Exception $e) {
				// Ignorer les disciplines qui n'existent pas dans les références
			}
		}

		$manager->flush();
	}

	/**
	 * Génère un temps de course selon le type
	 * @throws RandomException
	 */
	private function generateRunningTime(?RunningType $type): DateTime
	{
		$date = new DateTime('2000-01-01 00:00:00', new DateTimeZone('UTC'));

		if ($type === RunningType::SHORT) {
			// Sprints : 9-20 secondes
			$seconds = random_int(9, 20);
			$microseconds = random_int(0, 999999);
			$date->modify("+ {$seconds} seconds");
			$date->modify("+ {$microseconds} microseconds");
		} elseif ($type === RunningType::MIDDLE) {
			// Demi-fond : 1-5 minutes
			$minutes = random_int(1, 4);
			$seconds = random_int(0, 59);
			$date->modify("+ {$minutes} minutes");
			$date->modify("+ {$seconds} seconds");
		} else {
			// Fond : 10 minutes - 3 heures
			$hours = random_int(0, 2);
			$minutes = random_int(10, 59);
			$seconds = random_int(0, 59);
			$date->modify("+ {$hours} hours");
			$date->modify("+ {$minutes} minutes");
			$date->modify("+ {$seconds} seconds");
		}

		return $date;
	}

	/**
	 * Génère une distance pour les sauts ou lancers
	 * @throws RandomException
	 */
	private function generateDistance(DisciplineType $type): float
	{
		if ($type === DisciplineType::JUMP) {
			// Sauts : entre 1 et 8 mètres
			return random_int(100, 800) / 100;
		}
		// Lancers : entre 10 et 100 mètres
		return random_int(1000, 10000) / 100;
	}

	/**
	 * Liste des références de disciplines à utiliser
	 */
	private function getDisciplinesReferences(): array
	{
		return [
			DisciplineFixtures::DISCIPLINE_PREFIX . '100m_',
			DisciplineFixtures::DISCIPLINE_PREFIX . '200m_',
			DisciplineFixtures::DISCIPLINE_PREFIX . '400m_',
			DisciplineFixtures::DISCIPLINE_PREFIX . '800m_',
			DisciplineFixtures::DISCIPLINE_PREFIX . '1500m_',
			DisciplineFixtures::DISCIPLINE_PREFIX . '5000m_',
			DisciplineFixtures::DISCIPLINE_PREFIX . '10000m_',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'marathon',
			DisciplineFixtures::DISCIPLINE_PREFIX . '110m_haies',
			DisciplineFixtures::DISCIPLINE_PREFIX . '400m_haies',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'saut_en_hauteur',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'saut_en_longueur',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'triple_saut',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'saut_a_la_perche',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'lancer_du_poids',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'lancer_du_disque',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'lancer_du_javelot',
			DisciplineFixtures::DISCIPLINE_PREFIX . 'lancer_du_marteau',
		];
	}

	public function getDependencies(): array
	{
		return [
			DisciplineFixtures::class,
			AthleteFixtures::class,
			LocationFixtures::class,
		];
	}
}
