<?php

namespace App\ApiResource;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use App\State\UserProfileProvider;
use OpenApi\Attributes as OA;

/**
 * Ressource API pour récupérer le profil de l'utilisateur connecté
 */
#[ApiResource(
    operations: [
        new Get(
            uriTemplate: '/me',
            provider: UserProfileProvider::class,
            name: 'app_user_profile',
            security: "is_granted('IS_AUTHENTICATED_FULLY')"
        )
    ]
)]
#[OA\Tag(name: 'Utilisateur')]
class UserProfile
{
    // Cette classe sert uniquement de déclaration pour API Platform
    // Les données sont gérées par le UserProfileProvider
}
