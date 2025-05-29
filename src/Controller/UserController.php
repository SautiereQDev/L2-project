<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use App\Entity\User;

/**
 * Custom action to retrieve the currently authenticated user.
 */
final class UserController extends AbstractController
{
	public function __invoke(): User
	{
		return $this->getUser();
	}
}
