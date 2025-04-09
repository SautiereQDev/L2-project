<?php

namespace App\Enums;

enum GenderType: string
{
	case MEN = 'M';
	case WOMAN = 'W';

	public const CHOICES = [self::MEN, self::WOMAN];
}
