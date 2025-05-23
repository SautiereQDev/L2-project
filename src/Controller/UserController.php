<?php

namespace App\Controller;

use App\Dto\ApiResponse;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\Normalizer\NormalizerInterface;
use OpenApi\Attributes as OA;

class UserController extends AbstractController
{
    /**
     * Récupère les informations de l'utilisateur actuellement connecté
     */
    #[Route('/api/v1/me', name: 'app_user_me', methods: ['GET'])]
    #[OA\Tag(name: 'Utilisateur')]
    #[OA\Response(
        response: 200,
        description: 'Retourne les informations de l\'utilisateur connecté',
        content: new OA\JsonContent(
            properties: [
                new OA\Property(property: 'success', type: 'boolean'),
                new OA\Property(property: 'data', type: 'object'),
                new OA\Property(property: 'message', type: 'string')
            ]
        )
    )]
    #[OA\Response(
        response: 401,
        description: 'Utilisateur non authentifié'
    )]
    public function me(NormalizerInterface $normalizer): JsonResponse
    {
        // Récupère l'utilisateur connecté
        $user = $this->getUser();
        
        if (!$user) {
            $response = ApiResponse::error('Utilisateur non authentifié');
            return $this->json($response->toArray(), 401);
        }
        
        // Normalise l'utilisateur pour la réponse JSON
        $userData = $normalizer->normalize($user, null, ['groups' => 'user:read']);
        
        // Ajoute des informations supplémentaires si nécessaire
        $response = ApiResponse::success(
            $userData,
            'Informations de l\'utilisateur récupérées avec succès'
        );
        
        // Retourne les données de l'utilisateur
        return $this->json($response->toArray());
    }
}
