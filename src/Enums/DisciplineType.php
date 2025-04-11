<?php

namespace App\Enums;

enum DisciplineType: int
{
	case RUN = 1;
	case THROW = 2;
	case JUMP = 3;

	public const CHOICES = [
		self::RUN->value => 'Course',
		self::THROW->value => 'Lancer',
		self::JUMP->value => 'Saut',
	];

	public const VALID_VALUES = [1, 2, 3]; // Les valeurs possibles de l'enum
}
