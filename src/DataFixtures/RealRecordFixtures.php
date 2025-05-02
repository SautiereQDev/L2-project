<?php

namespace App\DataFixtures;

use App\Entity\Record;
use App\Entity\Discipline;
use App\Entity\Athlete;
use App\Entity\Location;
use App\Enums\DisciplineType;
use App\Enums\RunningType;
use App\Enums\GenderType;
use App\Enums\CategorieType;
use Doctrine\Bundle\FixturesBundle\Fixture;
use Doctrine\Common\DataFixtures\DependentFixtureInterface;
use Doctrine\Persistence\ObjectManager;
use DateTime;
use DateTimeImmutable;
use DateTimeZone;
use Exception;

class RealRecordFixtures extends Fixture implements DependentFixtureInterface
{
    // Référence pour les athlètes créés
    private const ATHLETE_PREFIX = 'real_athlete_';
    // Compteur pour créer des IDs uniques
    private int $athleteCounter = 0;

    /**
     * Records mondiaux SENIOR et facteurs d'ajustement pour chaque catégorie
     * Structure:
     * - 'M' (hommes) et 'W' (femmes)
     * - 'perf': la performance (temps ou distance)
     * - 'date': date du record
     * - 'first': prénom
     * - 'last': nom de famille
     * - 'country': code ISO du pays (2 lettres) 
     * - 'birth': date de naissance
     * - 'height': taille en cm (optionnel)
     * - 'weight': poids en kg (optionnel)
     * - 'type': le type de discipline (RUN, JUMP, THROW)
     */
    private const RECORDS_DATA = [
        '100m' => [
            'M' => ['perf' => '9.58', 'date' => '2009-08-16', 'first' => 'Usain', 'last' => 'Bolt', 'country' => 'JM', 'birth' => '1986-08-21', 'height' => 195, 'weight' => 94, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '10.49', 'date' => '1988-07-16', 'first' => 'Florence', 'last' => 'Griffith-Joyner', 'country' => 'US', 'birth' => '1959-12-21', 'height' => 170, 'weight' => 57, 'type' => DisciplineType::RUN->value]
        ],
        '200m' => [
            'M' => ['perf' => '19.19', 'date' => '2009-08-20', 'first' => 'Usain', 'last' => 'Bolt', 'country' => 'JM', 'birth' => '1986-08-21', 'height' => 195, 'weight' => 94, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '21.34', 'date' => '1988-09-29', 'first' => 'Florence', 'last' => 'Griffith-Joyner', 'country' => 'US', 'birth' => '1959-12-21', 'height' => 170, 'weight' => 57, 'type' => DisciplineType::RUN->value]
        ],
        '400m' => [
            'M' => ['perf' => '43.03', 'date' => '2016-08-14', 'first' => 'Wayde', 'last' => 'van Niekerk', 'country' => 'ZA', 'birth' => '1992-07-15', 'height' => 183, 'weight' => 70, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '47.60', 'date' => '1985-10-06', 'first' => 'Marita', 'last' => 'Koch', 'country' => 'DE', 'birth' => '1957-02-18', 'height' => 171, 'weight' => 62, 'type' => DisciplineType::RUN->value]
        ],
        '800m' => [
            'M' => ['perf' => '1:40.91', 'date' => '2012-08-09', 'first' => 'David', 'last' => 'Rudisha', 'country' => 'KE', 'birth' => '1988-12-17', 'height' => 190, 'weight' => 76, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '1:53.28', 'date' => '1983-07-26', 'first' => 'Jarmila', 'last' => 'Kratochvílová', 'country' => 'CZ', 'birth' => '1951-01-26', 'height' => 172, 'weight' => 62, 'type' => DisciplineType::RUN->value]
        ],
        '1000m' => [
            'M' => ['perf' => '2:11.96', 'date' => '1999-08-24', 'first' => 'Noah', 'last' => 'Ngeny', 'country' => 'KE', 'birth' => '1978-11-02', 'height' => 170, 'weight' => 56, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '2:28.98', 'date' => '1996-09-06', 'first' => 'Svetlana', 'last' => 'Masterkova', 'country' => 'RU', 'birth' => '1968-01-17', 'height' => 169, 'weight' => 55, 'type' => DisciplineType::RUN->value]
        ],
        '1500m' => [
            'M' => ['perf' => '3:26.00', 'date' => '1998-07-14', 'first' => 'Hicham', 'last' => 'El Guerrouj', 'country' => 'MA', 'birth' => '1974-09-14', 'height' => 176, 'weight' => 58, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '3:50.07', 'date' => '2015-07-17', 'first' => 'Genzebe', 'last' => 'Dibaba', 'country' => 'ET', 'birth' => '1991-02-08', 'height' => 168, 'weight' => 48, 'type' => DisciplineType::RUN->value]
        ],
        '3000m' => [
            'M' => ['perf' => '7:20.67', 'date' => '1996-09-01', 'first' => 'Daniel', 'last' => 'Komen', 'country' => 'KE', 'birth' => '1976-05-17', 'height' => 173, 'weight' => 57, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '8:06.11', 'date' => '1993-09-13', 'first' => 'Wang', 'last' => 'Junxia', 'country' => 'CN', 'birth' => '1973-01-19', 'height' => 165, 'weight' => 52, 'type' => DisciplineType::RUN->value]
        ],
        '3000m steeple' => [
            'M' => ['perf' => '7:53.63', 'date' => '2004-09-03', 'first' => 'Saif', 'last' => 'Shaheen', 'country' => 'QA', 'birth' => '1982-10-15', 'height' => 175, 'weight' => 60, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '8:44.32', 'date' => '2018-07-20', 'first' => 'Beatrice', 'last' => 'Chepkoech', 'country' => 'KE', 'birth' => '1991-07-06', 'height' => 165, 'weight' => 50, 'type' => DisciplineType::RUN->value]
        ],
        '5000m' => [
            'M' => ['perf' => '12:35.36', 'date' => '2020-08-14', 'first' => 'Joshua', 'last' => 'Cheptegei', 'country' => 'UG', 'birth' => '1996-09-12', 'height' => 168, 'weight' => 56, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '14:06.62', 'date' => '2020-10-07', 'first' => 'Letesenbet', 'last' => 'Gidey', 'country' => 'ET', 'birth' => '1998-03-20', 'height' => 166, 'weight' => 48, 'type' => DisciplineType::RUN->value]
        ],
        '10000m' => [
            'M' => ['perf' => '26:11.00', 'date' => '2020-10-07', 'first' => 'Joshua', 'last' => 'Cheptegei', 'country' => 'UG', 'birth' => '1996-09-12', 'height' => 168, 'weight' => 56, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '29:01.03', 'date' => '2021-06-08', 'first' => 'Letesenbet', 'last' => 'Gidey', 'country' => 'ET', 'birth' => '1998-03-20', 'height' => 166, 'weight' => 48, 'type' => DisciplineType::RUN->value]
        ],
        'Semi-marathon' => [
            'M' => ['perf' => '57:31', 'date' => '2021-11-21', 'first' => 'Jacob', 'last' => 'Kiplimo', 'country' => 'UG', 'birth' => '2000-11-14', 'height' => 175, 'weight' => 60, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '1:02:52', 'date' => '2021-10-24', 'first' => 'Letesenbet', 'last' => 'Gidey', 'country' => 'ET', 'birth' => '1998-03-20', 'height' => 166, 'weight' => 48, 'type' => DisciplineType::RUN->value]
        ],
        'Marathon' => [
            'M' => ['perf' => '2:00:35', 'date' => '2023-10-08', 'first' => 'Kelvin', 'last' => 'Kiptum', 'country' => 'KE', 'birth' => '1999-12-02', 'height' => 171, 'weight' => 59, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '2:14:04', 'date' => '2019-10-13', 'first' => 'Brigid', 'last' => 'Kosgei', 'country' => 'KE', 'birth' => '1994-02-20', 'height' => 165, 'weight' => 45, 'type' => DisciplineType::RUN->value]
        ],
        '110m haies' => [
            'M' => ['perf' => '12.80', 'date' => '2012-09-07', 'first' => 'Aries', 'last' => 'Merritt', 'country' => 'US', 'birth' => '1985-07-24', 'height' => 188, 'weight' => 73, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '12.12', 'date' => '2022-07-24', 'first' => 'Tobi', 'last' => 'Amusan', 'country' => 'NG', 'birth' => '1997-04-23', 'height' => 163, 'weight' => 53, 'type' => DisciplineType::RUN->value]
        ],
        '400m haies' => [
            'M' => ['perf' => '45.94', 'date' => '2021-08-03', 'first' => 'Karsten', 'last' => 'Warholm', 'country' => 'NO', 'birth' => '1996-02-28', 'height' => 187, 'weight' => 80, 'type' => DisciplineType::RUN->value],
            'W' => ['perf' => '50.68', 'date' => '2022-07-22', 'first' => 'Sydney', 'last' => 'McLaughlin', 'country' => 'US', 'birth' => '1999-08-07', 'height' => 175, 'weight' => 60, 'type' => DisciplineType::RUN->value]
        ],
        'Saut en hauteur' => [
            'M' => ['perf' => '2.45', 'date' => '1993-07-27', 'first' => 'Javier', 'last' => 'Sotomayor', 'country' => 'CU', 'birth' => '1967-10-13', 'height' => 195, 'weight' => 80, 'type' => DisciplineType::JUMP->value],
            'W' => ['perf' => '2.09', 'date' => '1987-08-30', 'first' => 'Stefka', 'last' => 'Kostadinova', 'country' => 'BG', 'birth' => '1965-03-25', 'height' => 180, 'weight' => 60, 'type' => DisciplineType::JUMP->value]
        ],
        'Saut en longueur' => [
            'M' => ['perf' => '8.95', 'date' => '1991-08-30', 'first' => 'Mike', 'last' => 'Powell', 'country' => 'US', 'birth' => '1963-11-10', 'height' => 188, 'weight' => 79, 'type' => DisciplineType::JUMP->value],
            'W' => ['perf' => '7.52', 'date' => '1988-06-11', 'first' => 'Galina', 'last' => 'Chistyakova', 'country' => 'RU', 'birth' => '1962-07-26', 'height' => 174, 'weight' => 60, 'type' => DisciplineType::JUMP->value]
        ],
        'Triple saut' => [
            'M' => ['perf' => '18.29', 'date' => '1995-08-07', 'first' => 'Jonathan', 'last' => 'Edwards', 'country' => 'GB', 'birth' => '1966-05-10', 'height' => 183, 'weight' => 70, 'type' => DisciplineType::JUMP->value],
            'W' => ['perf' => '15.74', 'date' => '2022-03-20', 'first' => 'Yulimar', 'last' => 'Rojas', 'country' => 'VE', 'birth' => '1995-10-21', 'height' => 192, 'weight' => 72, 'type' => DisciplineType::JUMP->value]
        ],
        'Saut à la perche' => [
            'M' => ['perf' => '6.25', 'date' => '2024-02-11', 'first' => 'Armand', 'last' => 'Duplantis', 'country' => 'SE', 'birth' => '1999-11-10', 'height' => 183, 'weight' => 79, 'type' => DisciplineType::JUMP->value],
            'W' => ['perf' => '5.06', 'date' => '2009-08-28', 'first' => 'Yelena', 'last' => 'Isinbayeva', 'country' => 'RU', 'birth' => '1982-06-03', 'height' => 176, 'weight' => 65, 'type' => DisciplineType::JUMP->value]
        ],
        'Lancer du poids' => [
            'M' => ['perf' => '23.56', 'date' => '2021-05-22', 'first' => 'Ryan', 'last' => 'Crouser', 'country' => 'US', 'birth' => '1992-12-18', 'height' => 201, 'weight' => 145, 'type' => DisciplineType::THROW->value],
            'W' => ['perf' => '22.63', 'date' => '1987-05-22', 'first' => 'Natalya', 'last' => 'Lisovskaya', 'country' => 'RU', 'birth' => '1962-07-16', 'height' => 180, 'weight' => 110, 'type' => DisciplineType::THROW->value]
        ],
        'Lancer du disque' => [
            'M' => ['perf' => '74.08', 'date' => '1986-06-06', 'first' => 'Jürgen', 'last' => 'Schult', 'country' => 'DE', 'birth' => '1960-05-11', 'height' => 189, 'weight' => 110, 'type' => DisciplineType::THROW->value],
            'W' => ['perf' => '76.80', 'date' => '1988-07-09', 'first' => 'Gabriele', 'last' => 'Reinsch', 'country' => 'DE', 'birth' => '1963-10-23', 'height' => 182, 'weight' => 95, 'type' => DisciplineType::THROW->value]
        ],
        'Lancer du javelot' => [
            'M' => ['perf' => '98.48', 'date' => '1996-05-25', 'first' => 'Jan', 'last' => 'Železný', 'country' => 'CZ', 'birth' => '1966-06-16', 'height' => 186, 'weight' => 90, 'type' => DisciplineType::THROW->value],
            'W' => ['perf' => '72.28', 'date' => '2008-09-13', 'first' => 'Barbora', 'last' => 'Špotáková', 'country' => 'CZ', 'birth' => '1981-06-30', 'height' => 182, 'weight' => 80, 'type' => DisciplineType::THROW->value]
        ],
        'Lancer du marteau' => [
            'M' => ['perf' => '86.74', 'date' => '1986-08-30', 'first' => 'Yuriy', 'last' => 'Sedykh', 'country' => 'RU', 'birth' => '1955-06-11', 'height' => 185, 'weight' => 110, 'type' => DisciplineType::THROW->value],
            'W' => ['perf' => '82.98', 'date' => '2016-08-28', 'first' => 'Anita', 'last' => 'Włodarczyk', 'country' => 'PL', 'birth' => '1985-08-08', 'height' => 178, 'weight' => 75, 'type' => DisciplineType::THROW->value]
        ]
    ];

    /**
     * Facteurs d'ajustement par catégorie d'âge
     * Utilisés pour calculer les performances adaptées à chaque catégorie
     * Structure: pourcentage de la performance SENIOR pour chaque catégorie
     */
    private const AGE_ADJUSTMENT_FACTORS = [
        // Courses (temps plus lent = facteur > 1)
        DisciplineType::RUN->value => [
            CategorieType::U18->value => ['M' => 1.08, 'W' => 1.09],    // U18: 8-9% plus lent que SENIOR 
            CategorieType::U20->value => ['M' => 1.04, 'W' => 1.05],    // U20: 4-5% plus lent
            CategorieType::U23->value => ['M' => 1.01, 'W' => 1.02],    // U23: 1-2% plus lent
            CategorieType::SENIOR->value => ['M' => 1.00, 'W' => 1.00], // SENIOR: référence (100%)
            CategorieType::MASTER->value => ['M' => 1.15, 'W' => 1.18], // MASTER: 15-18% plus lent
        ],
        // Sauts & lancers (distance plus courte = facteur < 1)
        DisciplineType::JUMP->value => [
            CategorieType::U18->value => ['M' => 0.85, 'W' => 0.82],    // U18: 15-18% moins loin que SENIOR
            CategorieType::U20->value => ['M' => 0.92, 'W' => 0.90],    // U20: 8-10% moins loin
            CategorieType::U23->value => ['M' => 0.97, 'W' => 0.96],    // U23: 3-4% moins loin
            CategorieType::SENIOR->value => ['M' => 1.00, 'W' => 1.00], // SENIOR: référence (100%)
            CategorieType::MASTER->value => ['M' => 0.82, 'W' => 0.78], // MASTER: 18-22% moins loin
        ],
        DisciplineType::THROW->value => [
            CategorieType::U18->value => ['M' => 0.75, 'W' => 0.70],    // U18: 25-30% moins loin que SENIOR
            CategorieType::U20->value => ['M' => 0.85, 'W' => 0.80],    // U20: 15-20% moins loin
            CategorieType::U23->value => ['M' => 0.95, 'W' => 0.92],    // U23: 5-8% moins loin
            CategorieType::SENIOR->value => ['M' => 1.00, 'W' => 1.00], // SENIOR: référence (100%)
            CategorieType::MASTER->value => ['M' => 0.78, 'W' => 0.72], // MASTER: 22-28% moins loin
        ]
    ];

    public function load(ObjectManager $manager): void
    {
        $now = new DateTimeImmutable();
        $locations = $this->getLocations($manager);

        // Générer des records pour chaque discipline dans RECORDS_DATA
        foreach (self::RECORDS_DATA as $disciplineName => $genderData) {
            // On traite les records masculins (M)
            if (isset($genderData['M'])) {
                $this->generateRecordsForAllCategories(
                    $manager, 
                    $disciplineName, 
                    GenderType::MEN, 
                    $genderData['M'],
                    $locations,
                    $now
                );
            }
            
            // On traite les records féminins (W)
            if (isset($genderData['W'])) {
                $this->generateRecordsForAllCategories(
                    $manager, 
                    $disciplineName, 
                    GenderType::WOMAN, 
                    $genderData['W'],
                    $locations,
                    $now
                );
            }
        }

        $manager->flush();
    }

    /**
     * Génère des records pour toutes les catégories d'âge pour une discipline et un genre
     */
    private function generateRecordsForAllCategories(
        ObjectManager $manager,
        string $disciplineName,
        GenderType $gender,
        array $recordData,
        array $locations,
        DateTimeImmutable $now
    ): void {
        // Créer l'athlète senior qui servira de référence
        $seniorAthlete = $this->createAthlete(
            $manager,
            $recordData['first'],
            $recordData['last'],
            $gender,
            $recordData['country'],
            new DateTime($recordData['birth']),
            $recordData['height'] ?? null,
            $recordData['weight'] ?? null
        );
        
        // Créer un record pour chaque catégorie d'âge
        foreach (CategorieType::cases() as $category) {
            // Calculer la performance ajustée selon la catégorie
            $adjustedPerformance = $this->calculateAdjustedPerformance(
                $recordData['perf'],
                $recordData['type'],
                $category->value,
                $gender === GenderType::MEN ? 'M' : 'W'
            );
            
            // Si ce n'est pas la catégorie SENIOR, créer des athlètes différents
            $athlete = $seniorAthlete;
            if ($category !== CategorieType::SENIOR) {
                // Générer un nouvel athlète avec un nom modifié pour chaque catégorie
                $athlete = $this->createAthlete(
                    $manager,
                    $this->modifyName($recordData['first']),
                    $this->modifyName($recordData['last']),
                    $gender,
                    $recordData['country'],
                    $this->adjustBirthDateForCategory($category, $recordData['birth']),
                    $recordData['height'] ?? null,
                    $recordData['weight'] ?? null
                );
            }
            
            // Date du record (légèrement ajustée pour éviter que tous les records aient la même date)
            $recordDate = new DateTime($recordData['date']);
            $recordDate->modify(sprintf('-%d days', rand(0, 365)));
            
            // Créer le record
            $this->createRecord(
                $manager,
                $disciplineName,
                $athlete,
                $this->parsePerformance($adjustedPerformance, $recordData['type']),
                $recordDate,
                $this->getRandomLocation($locations),
                $gender,
                $category,
                $now
            );
        }
    }

    /**
     * Calcule la performance ajustée selon la catégorie d'âge
     */
    private function calculateAdjustedPerformance(
        string $basePerfString,
        string $disciplineType,
        string $category,
        string $gender
    ): string {
        // Obtenir le facteur d'ajustement
        $adjustmentFactor = self::AGE_ADJUSTMENT_FACTORS[$disciplineType][$category][$gender];
        
        // Convertir la performance en nombre
        $basePerf = $this->parsePerformance($basePerfString, $disciplineType);
        
        // Appliquer le facteur d'ajustement
        $adjustedPerf = $basePerf * $adjustmentFactor;
        
        // Pour les courses, on ajoute une légère variation aléatoire et on retourne un temps
        if ($disciplineType === DisciplineType::RUN->value) {
            // Variation de 0.5 à 1.5%
            $randomFactor = 1 + (mt_rand(5, 15) / 1000);
            $adjustedPerf *= $randomFactor;
            
            // Formater selon le format original
            if (strpos($basePerfString, ':') !== false) {
                return $this->formatTime($adjustedPerf);
            }
            
            // Format simple (secondes.centièmes)
            return number_format($adjustedPerf, 2, '.', '');
        }
        
        // Pour les sauts et lancers, on retourne la valeur avec 2 décimales
        return number_format($adjustedPerf, 2, '.', '');
    }

    /**
     * Parse une performance selon le type de discipline
     */
    private function parsePerformance(string $perfString, string $disciplineType): float
    {
        if ($disciplineType === DisciplineType::RUN->value) {
            return $this->parseTime($perfString);
        }
        
        // Pour les sauts et lancers, on traite comme des distances
        return $this->parseDistance($perfString);
    }

    /**
     * Formate un temps en secondes dans le format d'origine (mm:ss.ms ou hh:mm:ss.ms)
     */
    private function formatTime(float $seconds): string
    {
        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds - ($hours * 3600)) / 60);
        $secs = $seconds - ($hours * 3600) - ($minutes * 60);
        
        if ($hours > 0) {
            return sprintf('%d:%02d:%05.2f', $hours, $minutes, $secs);
        }
        
        if ($minutes > 0) {
            return sprintf('%d:%05.2f', $minutes, $secs);
        }
        
        return number_format($secs, 2, '.', '');
    }

    /**
     * Modifie légèrement un nom pour créer des variantes
     */
    private function modifyName(string $name): string
    {
        $prefixes = ['', 'J', 'K', 'D', 'M', 'L', 'R', 'T', 'S'];
        $suffixes = ['', 'son', 'ez', 'ov', 'ski', 'man'];
        
        // 50% de chance de conserver le nom original
        if (rand(0, 1) === 0) {
            return $name;
        }
        
        // Sinon, on génère une variante
        if (rand(0, 1) === 0) {
            // Ajouter un préfixe (25% de chances)
            return $prefixes[array_rand($prefixes)] . $name;
        } else {
            // Ajouter un suffixe (25% de chances)
            return $name . $suffixes[array_rand($suffixes)];
        }
    }

    /**
     * Ajuste la date de naissance pour correspondre à la catégorie d'âge
     */
    private function adjustBirthDateForCategory(CategorieType $category, string $originalBirthDate): DateTime
    {
        $birthDate = new DateTime($originalBirthDate);
        $currentYear = (int) (new DateTime())->format('Y');
        
        switch ($category) {
            case CategorieType::U18:
                $age = rand(15, 17);
                $birthYear = $currentYear - $age;
                break;
            case CategorieType::U20:
                $age = rand(18, 19);
                $birthYear = $currentYear - $age;
                break;
            case CategorieType::U23:
                $age = rand(20, 22);
                $birthYear = $currentYear - $age;
                break;
            case CategorieType::SENIOR:
                // Conserver l'âge original
                return $birthDate;
            case CategorieType::MASTER:
                $age = rand(35, 50);
                $birthYear = $currentYear - $age;
                break;
            default:
                // Par défaut, on ne change rien
                return $birthDate;
        }
        
        // Conserver le mois et le jour, changer l'année
        $birthDate->setDate($birthYear, (int) $birthDate->format('m'), (int) $birthDate->format('d'));
        return $birthDate;
    }

    /**
     * Récupère les emplacements depuis la base de données
     */
    private function getLocations(ObjectManager $manager): array
    {
        $locations = $manager->getRepository(Location::class)->findAll();
        if (empty($locations)) {
            throw new \RuntimeException('No locations found. Please load LocationFixtures first.');
        }
        return $locations;
    }

    /**
     * Récupère un emplacement aléatoire
     */
    private function getRandomLocation(array $locations): Location
    {
        return $locations[array_rand($locations)];
    }

    /**
     * Crée un nouvel athlète
     */
    private function createAthlete(ObjectManager $manager, string $firstName, string $lastName, GenderType $gender, string $country, \DateTimeInterface $birthdate, ?int $height = null, ?int $weight = null): Athlete
    {
        $athlete = new Athlete();
        $athlete->setFirstname($firstName);
        $athlete->setLastname($lastName);
        $athlete->setGender($gender);
        $athlete->setCountry($country);
        $athlete->setBirthdate($birthdate);
        
        if ($height) {
            $athlete->setHeigth($height);
        }
        
        if ($weight) {
            $athlete->setWeigth($weight);
        }
        
        $athlete->setCreatedAt(new DateTimeImmutable());
        $athlete->setUpdatedAt(new DateTimeImmutable());
        
        $manager->persist($athlete);
        
        // Créer une référence unique pour cet athlète
        $this->addReference(self::ATHLETE_PREFIX . $this->athleteCounter, $athlete);
        $this->athleteCounter++;
        
        return $athlete;
    }

    /**
     * Crée un nouveau record
     */
    private function createRecord(
        ObjectManager $manager,
        string $disciplineName,
        Athlete $athlete,
        $performance,
        \DateTimeInterface $recordDate,
        Location $location,
        GenderType $gender,
        CategorieType $category,
        DateTimeImmutable $now
    ): void {
        try {
            // Normaliser le nom de la discipline pour correspondre aux références
            $normalizedName = $this->normalizeDisciplineName($disciplineName);
            $referenceKey = DisciplineFixtures::DISCIPLINE_PREFIX . $normalizedName;
            
            try {
                $this->getReference($referenceKey, Discipline::class);
            } catch (\Exception $e) {
                echo "Référence manquante pour la discipline: $disciplineName ($normalizedName)\n";
                return;
            }
            
            $discipline = $this->getReference($referenceKey, Discipline::class);
            
            // Vérifier et convertir la performance si nécessaire
            if (is_string($performance)) {
                // Si c'est une course (type RUN), on laisse la performance en format de temps
                if ($discipline->getType() === DisciplineType::RUN) {
                    $performance = (float)$performance;
                } else {
                    // Pour les sauts et lancers, on s'assure qu'on a un nombre flottant
                    $performance = (float)str_replace(['m', ','], ['', '.'], $performance);
                }
            }
            
            $record = new Record();
            $record->setDiscipline($discipline);
            $record->setAthlete($athlete);
            $record->setPerformance($performance);
            $record->setLastRecord($recordDate);
            $record->setLocation($location);
            $record->setGenre($gender);
            $record->setCategorie($category);
            $record->setIsCurrentRecord(true);
            $record->setCreatedAt($now);
            $record->setUpdatedAt($now);
            
            $manager->persist($record);
        } catch (\Exception $e) {
            echo "Erreur lors de la création du record pour $disciplineName (" . $category->value . "): " . $e->getMessage() . "\n";
        }
    }
    
    /**
     * Normalise le nom d'une discipline pour correspondre aux références
     * Cette méthode doit être cohérente avec DisciplineFixtures::normalizeName()
     */
    private function normalizeDisciplineName(string $name): string
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
     * Parse un temps au format mm:ss.ms ou hh:mm:ss.ms en secondes
     */
    private function parseTime(string $timeString): float
    {
        // Pour les formats hh:mm:ss.ms ou mm:ss.ms
        if (strpos($timeString, ':') !== false) {
            $parts = explode(':', $timeString);
            $seconds = 0;
            
            if (count($parts) === 3) { // hh:mm:ss.ms
                $seconds = ($parts[0] * 3600) + ($parts[1] * 60);
                $secondPart = $parts[2];
            } else { // mm:ss.ms
                $seconds = $parts[0] * 60;
                $secondPart = $parts[1];
            }
            
            // Gérer les secondes avec millisecondes
            if (strpos($secondPart, '.') !== false) {
                $secondParts = explode('.', $secondPart);
                $seconds += floatval($secondParts[0] . '.' . $secondParts[1]);
            } else {
                $seconds += floatval($secondPart);
            }
            
            return $seconds;
        } 
        // Pour les formats simple: ss.ms
        else {
            return floatval($timeString);
        }
    }

    /**
     * Parse une distance en mètres
     */
    private function parseDistance(string $distanceString): float
    {
        // Nettoyer la chaîne en supprimant 'm' et en remplaçant les virgules par des points
        $distanceString = str_replace(['m', ','], ['', '.'], $distanceString);
        return floatval($distanceString);
    }

    /**
     * Détermine les dépendances de cette fixture
     */
    public function getDependencies(): array
    {
        return [
            DisciplineFixtures::class,
            LocationFixtures::class,
        ];
    }
}
