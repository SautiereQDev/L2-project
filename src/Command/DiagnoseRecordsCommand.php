<?php

namespace App\Command;

use App\Entity\Record;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:diagnose-records',
    description: 'Diagnose la source du problème avec les records',
)]
class DiagnoseRecordsCommand extends Command
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        $io->title('Diagnostic des Records');

        // Récupère tous les records directement via SQL pour éviter les erreurs de mapping
        $conn = $this->entityManager->getConnection();
        $records = $conn->fetchAllAssociative('SELECT * FROM record');
        $recordCount = count($records);

        $io->info(sprintf('Nombre total de records dans la base de données: %d', $recordCount));

        if ($recordCount === 0) {
            $io->error('Aucun record dans la base de données!');
            return Command::FAILURE;
        }

        // Examine chaque record individuellement pour identifier les problèmes
        $recordsWithNullCategories = 0;
        $recordsWithEmptyCategories = 0;
        $recordsWithNullDiscipline = 0;
        $recordsWithNullAthlete = 0;
        $recordsWithNullLocation = 0;
        $recordsWithNullLastRecord = 0;
        
        foreach ($records as $record) {
            if ($record['categorie'] === null) {
                $recordsWithNullCategories++;
            } elseif ($record['categorie'] === '') {
                $recordsWithEmptyCategories++;
            }
            
            if ($record['discipline_id'] === null) {
                $recordsWithNullDiscipline++;
            }
            
            if ($record['athlete_id'] === null) {
                $recordsWithNullAthlete++;
            }
            
            if ($record['location_id'] === null) {
                $recordsWithNullLocation++;
            }
            
            if ($record['last_record'] === null) {
                $recordsWithNullLastRecord++;
            }
        }

        $io->section('Problèmes détectés:');
        $io->table(['Problème', 'Nombre de records affectés'], [
            ['Catégorie NULL', $recordsWithNullCategories],
            ['Catégorie vide', $recordsWithEmptyCategories],
            ['Discipline NULL', $recordsWithNullDiscipline],
            ['Athlete NULL', $recordsWithNullAthlete],
            ['Location NULL', $recordsWithNullLocation],
            ['LastRecord NULL', $recordsWithNullLastRecord],
        ]);

        // Tente de charger les records via l'ORM pour voir s'ils sont correctement mappés
        try {
            $recordRepo = $this->entityManager->getRepository(Record::class);
            $records = $recordRepo->findAll();
            $io->success(sprintf('%d records chargés via l\'ORM', count($records)));

            if (count($records) > 0) {
                $io->section('Premier record:');
                $firstRecord = $records[0];
                $io->table(['Propriété', 'Valeur'], [
                    ['ID', $firstRecord->getId()],
                    ['Discipline', $firstRecord->getDiscipline() ? $firstRecord->getDiscipline()->getId() : 'NULL'],
                    ['Athlete', $firstRecord->getAthlete() ? $firstRecord->getAthlete()->getId() : 'NULL'],
                    ['Genre', $firstRecord->getGenre() ? $firstRecord->getGenre()->value : 'NULL'],
                    ['Categorie', $firstRecord->getCategorie() ? $firstRecord->getCategorie()->value : 'NULL'],
                    ['Location', $firstRecord->getLocation() ? $firstRecord->getLocation()->getId() : 'NULL'],
                    ['LastRecord', $firstRecord->getLastRecord() ? $firstRecord->getLastRecord()->format('Y-m-d') : 'NULL'],
                    ['Performance', $firstRecord->getPerformance() ? (is_float($firstRecord->getPerformance()) ? $firstRecord->getPerformance() : 'Non Float') : 'NULL'],
                    ['isCurrentRecord', $firstRecord->isCurrentRecord() ? 'true' : 'false'],
                ]);
            }
        } catch (\Exception $e) {
            $io->error('Erreur lors du chargement des records via l\'ORM:');
            $io->text($e->getMessage());
            $io->text($e->getTraceAsString());
        }

        return Command::SUCCESS;
    }
}
