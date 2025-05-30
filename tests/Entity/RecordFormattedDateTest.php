<?php

declare(strict_types=1);

namespace App\Tests\Entity;

use App\Entity\Record;
use App\Entity\Athlete;
use App\Entity\Discipline;
use App\Entity\Location;
use App\Enums\GenderType;
use App\Enums\CategorieType;
use App\Enums\DisciplineType;
use App\Enums\LocationType;
use PHPUnit\Framework\TestCase;

class RecordFormattedDateTest extends TestCase
{
    public function testFormattedRecordDateIsGeneratedAutomatically(): void
    {
        // Créer les entités nécessaires
        $athlete = new Athlete();
        $athlete->setFirstname('Usain')
            ->setLastname('Bolt')
            ->setCountry('JM')
            ->setBirthdate(new \DateTime('1986-08-21'))
            ->setGender(GenderType::MEN);

        $discipline = new Discipline();
        $discipline->setName('100m')
            ->setType(DisciplineType::RUN);

        $location = new Location();
        $location->setName('Stade de Berlin')
            ->setCity('Berlin')
            ->setCountry('DE')
            ->setType(LocationType::STADIUM);

        // Créer le record avec une date française typique
        $record = new Record();
        $recordDate = new \DateTime('2024-01-22'); // 22 janvier 2024
        
        $record->setDiscipline($discipline)
            ->setAthlete($athlete)
            ->setLastRecord($recordDate)
            ->setPerformance(9.58)
            ->setLocation($location)
            ->setGenre(GenderType::MEN)
            ->setCategorie(CategorieType::SENIOR)
            ->setIsCurrentRecord(true);

        // Simuler l'appel du lifecycle callback
        $record->updateFormattedRecordDate();

        // Vérifier que la date formatée en français est correcte
        $this->assertEquals('22 Janvier 2024', $record->getFormattedRecordDate());
    }

    public function testDifferentFrenchMonths(): void
    {
        $record = new Record();
        
        // Tester différents mois
        $testDates = [
            '2024-02-15' => '15 Février 2024',
            '2024-03-08' => '8 Mars 2024',
            '2024-05-01' => '1 Mai 2024',
            '2024-08-25' => '25 Août 2024',
            '2024-12-31' => '31 Décembre 2024'
        ];

        foreach ($testDates as $inputDate => $expectedOutput) {
            $record->setLastRecord(new \DateTime($inputDate));
            $record->updateFormattedRecordDate();
            
            $this->assertEquals(
                $expectedOutput,
                $record->getFormattedRecordDate(),
                "La date $inputDate devrait être formatée comme $expectedOutput"
            );
        }
    }

    public function testManualFormattedDateSetting(): void
    {
        $record = new Record();
        
        // Test du setter manuel
        $customFormattedDate = '5 Juin 2023';
        $record->setFormattedRecordDate($customFormattedDate);
        
        $this->assertEquals($customFormattedDate, $record->getFormattedRecordDate());
    }
}
