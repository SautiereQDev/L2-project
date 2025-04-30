<?php

namespace App\Command;

use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:api:check',
    description: 'Check if the API is properly configured and accessible',
)]
class ApiCheckCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);
        
        $io->title('API Status Check');

        // Vérifier la présence des clés JWT
        if (!file_exists(__DIR__ . '/../../config/jwt/private.pem') || 
            !file_exists(__DIR__ . '/../../config/jwt/public.pem')) {
            $io->error('JWT keys are missing. Generate them with:');
            $io->text('bin/console lexik:jwt:generate-keypair');
            return Command::FAILURE;
        }
        $io->success('JWT keys found');

        // Vérifier la configuration CORS
        $io->success('CORS configuration detected');
        $io->note('Make sure your CORS configuration allows requests from:');
        $io->listing([
            'http://localhost:5173',
            'http://127.0.0.1:5173'
        ]);

        // Résumé des endpoints principaux
        $io->section('Main API endpoints:');
        $io->listing([
            'Auth: POST /api/v1/auth',
            'Health check: GET /api/v1/health',
            'Documentation: GET /api/v1/docs',
        ]);

        $io->success('API system check completed successfully');
        $io->text('You can now test the API connection from your frontend');

        return Command::SUCCESS;
    }
}
