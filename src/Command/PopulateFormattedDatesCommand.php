<?php

declare(strict_types=1);

namespace App\Command;

use App\Entity\Record;
use App\Service\FrenchDateFormatter;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:populate-formatted-dates',
    description: 'Populate the formatted_record_date field for existing records with French formatted dates'
)]
class PopulateFormattedDatesCommand extends Command
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private FrenchDateFormatter $dateFormatter
    ) {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Population des dates formatées en français');

        // Récupérer tous les records qui n'ont pas encore de date formatée
        $records = $this->entityManager->getRepository(Record::class)
            ->findBy(['formattedRecordDate' => null]);

        if (empty($records)) {
            $io->success('Aucun record à traiter. Toutes les dates formatées sont déjà présentes.');
            return Command::SUCCESS;
        }

        $io->progressStart(count($records));

        $processed = 0;
        foreach ($records as $record) {
            $lastRecord = $record->getLastRecord();
            if ($lastRecord) {
                $formattedDate = $this->dateFormatter->formatDate($lastRecord);
                $record->setFormattedRecordDate($formattedDate);
                $processed++;
            }
            $io->progressAdvance();
        }

        $this->entityManager->flush();
        $io->progressFinish();

        $io->success(sprintf(
            'Traitement terminé ! %d records ont été mis à jour avec des dates formatées en français.',
            $processed
        ));

        // Afficher quelques exemples
        $io->section('Exemples de dates formatées');
        $exampleRecords = array_slice($records, 0, 5);
        foreach ($exampleRecords as $record) {
            if ($record->getFormattedRecordDate()) {
                $io->text(sprintf(
                    '- %s %s: %s (était: %s)',
                    $record->getAthlete()?->getFirstname() ?? 'N/A',
                    $record->getAthlete()?->getLastname() ?? 'N/A',
                    $record->getFormattedRecordDate(),
                    $record->getLastRecord()?->format('Y-m-d') ?? 'N/A'
                ));
            }
        }

        return Command::SUCCESS;
    }
}
