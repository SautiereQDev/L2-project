<?php

namespace App\Enums;

enum LocationType: string
{
	case STADIUM = 'stadium';
	case INDOOR = 'indoor';
	case ROAD = 'road';

	public const CHOICES = [
		self::STADIUM->value,
		self::INDOOR->value,
		self::ROAD->value,
	];
}
