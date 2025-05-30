<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use OpenApi\Attributes as OA;

/**
 * Contrôleur minimal pour la déconnexion (côté serveur)
 * L'authentification et l'inscription sont gérées par API Platform
 */
#[Route('/api/v1', name: 'api_')]
class AuthController extends AbstractController
{
    /**
     * Endpoint de déconnexion - avec JWT, la déconnexion est principalement côté client
     */
    #[Route('/logout', name: 'logout', methods: ['POST'])]
    #[OA\Tag(name: 'Authentification')]
    #[OA\Response(
        response: 200,
        description: 'Déconnexion réussie'
    )]
    public function logout(): JsonResponse
    {
        // Avec JWT, la déconnexion est gérée côté client en supprimant le token
        // Ce endpoint peut être utilisé pour des logs ou des actions spécifiques côté serveur
        return $this->json([
            'success' => true,
            'message' => 'Déconnexion réussie'
        ]);
    }
}
