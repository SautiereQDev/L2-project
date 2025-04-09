<?php

namespace App\Tests\Controller;

use Symfony\Bundle\FrameworkBundle\Test\WebTestCase;
use App\Kernel;

final class AppControllerTest extends WebTestCase
{
	protected static function getKernelClass(): string
	{
		return Kernel::class;
	}

	public function testIndex(): void
	{
		$client = static::createClient();
		$client->request('GET', '/app');
		self::assertResponseIsSuccessful();
	}
}