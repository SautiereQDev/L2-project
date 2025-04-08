<?php

namespace App\Enums;

enum GenderType: string
{
	case HOMME = 'M';
	case FEMME = 'F';

	public const CHOICES = [
		self::HOMME->value,
		self::FEMME->value,
	];
}
