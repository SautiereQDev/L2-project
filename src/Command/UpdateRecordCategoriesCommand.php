<?php

namespace App\Command;

use App\Entity\Record;
use App\Enums\CategorieType;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:update-record-categories',
    description: 'Met à jour les catégories pour les enregistrements existants',
)]
class UpdateRecordCategoriesCommand extends Command
{
    private EntityManagerInterface $entityManager;
    private Connection $connection;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->connection = $entityManager->getConnection();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        // Utiliser DBAL pour mettre à jour directement la base de données
        // Cela évite les problèmes d'hydratation de l'enum avec des valeurs vides
        try {
            // Mettre à jour les enregistrements avec une valeur vide
            $emptyResult = $this->connection->executeStatement(
                'UPDATE record SET categorie = ? WHERE categorie = ?',
                [CategorieType::SENIOR->value, '']
            );
            
            // Mettre à jour les enregistrements avec une valeur NULL
            $nullResult = $this->connection->executeStatement(
                'UPDATE record SET categorie = ? WHERE categorie IS NULL',
                [CategorieType::SENIOR->value]
            );
            
            $totalUpdated = $emptyResult + $nullResult;
            
            if ($totalUpdated > 0) {
                $io->success(sprintf('%d enregistrements ont été mis à jour avec la catégorie SENIOR (%d vides, %d NULL)', 
                    $totalUpdated, $emptyResult, $nullResult));
            } else {
                $io->info('Aucun enregistrement n\'a besoin de mise à jour.');
            }
            
            return Command::SUCCESS;
        } catch (\Exception $e) {
            $io->error('Une erreur s\'est produite lors de la mise à jour des catégories: ' . $e->getMessage());
            return Command::FAILURE;
        }
    }
}
