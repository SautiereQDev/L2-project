<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;

/**
 * Contrôleur pour gérer les problèmes de CORS et vérifier l'état de l'API
 */
#[Route('/api/v1')]
class ApiHealthController extends AbstractController
{
    /**
     * Point d'entrée pour tester l'API sans authentification
     */
    #[Route('/health', name: 'api_health_check', methods: ['GET'])]
    public function healthCheck(): JsonResponse
    {
        return new JsonResponse([
            'status' => 'ok',
            'message' => 'API is accessible and working properly',
            'timestamp' => new \DateTime(),
            'server_time' => time(),
            'environment' => $_ENV['APP_ENV'] ?? 'unknown'
        ]);
    }

    /**
     * Point d'entrée pour tester l'API avec authentification
     */
    #[Route('/health/secure', name: 'api_secure_health_check', methods: ['GET'])]
    public function secureHealthCheck(): JsonResponse
    {
        // Cette route nécessite une authentification (configurée dans security.yaml)
        // Si vous arrivez ici, c'est que vous êtes bien authentifié
        $user = $this->getUser();
        
        return new JsonResponse([
            'status' => 'ok',
            'message' => 'Secure API endpoint is working properly',
            'authenticated' => true,
            'user' => $user ? $user->getUserIdentifier() : null,
            'timestamp' => new \DateTime(),
        ]);
    }
}
