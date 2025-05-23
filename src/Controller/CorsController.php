<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class CorsController extends AbstractController
{
    #[Route(
        '/{_route}',
        name: 'cors_preflight',
        methods: ['OPTIONS'],
        requirements: ['_route' => '.+']
    )]
    public function corsPreflightAction(): Response
    {
        $response = new Response();
        $response->headers->set('Content-Type', 'text/plain');
        $response->headers->set('Access-Control-Allow-Origin', '*');
        $response->headers->set('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
        $response->headers->set('Access-Control-Allow-Headers', 'Content-Type,Authorization');
        $response->headers->set('Access-Control-Max-Age', '3600');

        return $response;
    }
}
