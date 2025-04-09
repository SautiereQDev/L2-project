<?php

namespace App\DataFixtures;

use App\Entity\Discipline;
use App\Enums\DisciplineType;
use App\Enums\RunningType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use DateTimeImmutable;

class DisciplineFixtures extends Fixture
{
	public const DISCIPLINE_PREFIX = 'discipline_';

	// Structure: [nom, type, type de course (si applicable)]
	private const DISCIPLINES = [
		// Courses
		['100m', DisciplineType::RUN, RunningType::SHORT],
		['200m', DisciplineType::RUN, RunningType::SHORT],
		['400m', DisciplineType::RUN, RunningType::SHORT],
		['800m', DisciplineType::RUN, RunningType::MIDDLE],
		['1500m', DisciplineType::RUN, RunningType::MIDDLE],
		['5000m', DisciplineType::RUN, RunningType::LONG],
		['10000m', DisciplineType::RUN, RunningType::LONG],
		['Marathon', DisciplineType::RUN, RunningType::LONG],
		['110m haies', DisciplineType::RUN, RunningType::SHORT],
		['400m haies', DisciplineType::RUN, RunningType::SHORT],
		// Sauts
		['Saut en hauteur', DisciplineType::JUMP, null],
		['Saut en longueur', DisciplineType::JUMP, null],
		['Triple saut', DisciplineType::JUMP, null],
		['Saut à la perche', DisciplineType::JUMP, null],
		// Lancers
		['Lancer du poids', DisciplineType::THROW, null],
		['Lancer du disque', DisciplineType::THROW, null],
		['Lancer du javelot', DisciplineType::THROW, null],
		['Lancer du marteau', DisciplineType::THROW, null],
	];

	public function load(ObjectManager $manager): void
	{
		$now = new DateTimeImmutable();

		foreach (self::DISCIPLINES as [$name, $type, $runningType]) {
			$discipline = new Discipline();
			$discipline->setName($name);
			$discipline->setType($type);
			$discipline->setCategories($this->getRandomCategory());
			$discipline->setCreatedAt($now);
			$discipline->setUpdatedAt($now);

			// Si c'est une course, définir le type de course
			if ($type === DisciplineType::RUN && $runningType !== null) {
				$discipline->setRunningType($runningType);
			}

			$manager->persist($discipline);

			// Référence unique avec nom normalisé
			$normalizedName = $this->normalizeName($name);
			$this->addReference(self::DISCIPLINE_PREFIX . $normalizedName, $discipline);
		}

		$manager->flush();
	}

	private function normalizeName(string $name): string
	{
		return strtolower(str_replace([' ', "'", '-', 'm'], ['_', '', '_', 'm_'], $name));
	}

	private function getRandomCategory(): string
	{
		$categories = ['Senior', 'Junior', 'Elite', 'Open'];
		return $categories[array_rand($categories)];
	}
}
