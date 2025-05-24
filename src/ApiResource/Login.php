<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Post;
use App\State\LoginProcessor;
use OpenApi\Attributes as OA;

/**
 * Ressource API pour l'authentification des utilisateurs
 */
#[ApiResource(
    operations: [
        new Post(
            uriTemplate: '/login',
            processor: LoginProcessor::class,
            name: 'app_login'
        )
    ]
)]
#[OA\Tag(name: 'Authentification')]
class Login
{
    #[OA\Property(description: 'Adresse email de l\'utilisateur', example: 'user@example.com')]
    public string $email;

    #[OA\Property(description: 'Mot de passe de l\'utilisateur', example: 'password123')]
    public string $password;
}
