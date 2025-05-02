<?php

namespace App\DataFixtures;

use App\Entity\Discipline;
use App\Enums\DisciplineType;
use App\Enums\RunningType;
use App\Enums\CategorieType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Persistence\ObjectManager;
use DateTimeImmutable;

class DisciplineFixtures extends Fixture
{
	public const DISCIPLINE_PREFIX = 'discipline_';

	// Structure: [nom, type, type de course (si applicable)]
	private const DISCIPLINES = [
		// Courses Sprint/Vitesse
		['100m', DisciplineType::RUN, RunningType::SHORT],
		['200m', DisciplineType::RUN, RunningType::SHORT],
		['400m', DisciplineType::RUN, RunningType::SHORT],
		// Demi-fond
		['800m', DisciplineType::RUN, RunningType::MIDDLE],
		['1000m', DisciplineType::RUN, RunningType::MIDDLE],
		['1500m', DisciplineType::RUN, RunningType::MIDDLE],
		['3000m', DisciplineType::RUN, RunningType::MIDDLE],
		['3000m steeple', DisciplineType::RUN, RunningType::MIDDLE],
		// Fond
		['5000m', DisciplineType::RUN, RunningType::LONG],
		['10000m', DisciplineType::RUN, RunningType::LONG],
		['Semi-marathon', DisciplineType::RUN, RunningType::LONG],
		['Marathon', DisciplineType::RUN, RunningType::LONG],
		// Haies
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

	/**
	 * Normalise le nom d'une discipline pour correspondre aux références
	 * Cette méthode doit être cohérente avec RealRecordFixtures::normalizeDisciplineName()
	 */
	private function normalizeName(string $name): string
	{
		// Cas spéciaux pour les disciplines problématiques
		$specialCases = [
			'3000m steeple' => '3000m_steeple',
			'Semi-marathon' => 'semi_marathon',
			'110m haies' => '110m_haies',
			'400m haies' => '400m_haies',
			'Saut à la perche' => 'saut_a_la_perche',
			'Lancer du marteau' => 'lancer_du_marteau',
		];

		if (array_key_exists($name, $specialCases)) {
			return $specialCases[$name];
		}

		// Traitement standard pour les autres cas
		$normalized = $name;

		// Remplacer les espaces par des underscores
		$normalized = str_replace(' ', '_', $normalized);

		// Remplacer les apostrophes et tirets
		$normalized = str_replace(["'", "-"], ['', '_'], $normalized);

		// Gérer les cas où il y a "m" dans le nom (comme "100m")
		// On cherche spécifiquement les cas où un chiffre est suivi de "m"
		if (preg_match('/\d+m/', $normalized)) {
			$normalized = preg_replace('/(\d+)m/', '$1m_', $normalized);
		}

		// Normaliser les caractères accentués
		$normalized = iconv('UTF-8', 'ASCII//TRANSLIT', $normalized);

		return strtolower($normalized);
	}

	/**
	 * Renvoie toutes les catégories sous forme de chaîne JSON
	 * Pour associer toutes les catégories à chaque discipline
	 */
	private function getRandomCategory(): string
	{
		// Au lieu d'un choix aléatoire, on inclut toutes les catégories
		return json_encode(array_map(fn($case) => $case->value, CategorieType::cases()));
	}
}
