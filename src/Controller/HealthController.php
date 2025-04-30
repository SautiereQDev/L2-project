<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\HttpFoundation\Response;
use Doctrine\DBAL\Connection;
use Doctrine\ORM\EntityManagerInterface;

#[Route('/api', name: 'api_')]
class HealthController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/v1/health', name: 'health', methods: ['GET'])]
    public function health(): JsonResponse
    {
        // Check database connection
        try {
            $connection = $this->entityManager->getConnection();
            $connection->connect();
            $dbStatus = $connection->isConnected();
        } catch (\Exception $e) {
            $dbStatus = false;
        }

        // Get PHP version
        $phpVersion = phpversion();

        // Get Symfony version
        $symfonyVersion = \Symfony\Component\HttpKernel\Kernel::VERSION;

        // Get server info
        $serverInfo = [
            'software' => $_SERVER['SERVER_SOFTWARE'] ?? 'Unknown',
            'protocol' => $_SERVER['SERVER_PROTOCOL'] ?? 'Unknown',
        ];

        $data = [
            'status' => 'ok',
            'timestamp' => new \DateTime(),
            'database' => [
                'connected' => $dbStatus,
            ],
            'environment' => [
                'php_version' => $phpVersion,
                'symfony_version' => $symfonyVersion,
                'server' => $serverInfo,
            ],
            'message' => 'API is running correctly'
        ];

        return $this->json($data);
    }
}
