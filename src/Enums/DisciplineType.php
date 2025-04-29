<?php

namespace App\Enums;

enum DisciplineType: string
{
	case RUN = "run";
	case THROW = "throw";
	case JUMP = "jump";

	public const CHOICES = [
		self::RUN->value => 'run',
		self::THROW->value => 'throw',
		self::JUMP->value => 'jump',
	];

	public const VALID_VALUES = ["run", "throw", "jump"]; // Les valeurs possibles de l'enum
}
