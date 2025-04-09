<?php

namespace App\Enums;

enum RunningType: string
{
	case SHORT = "sprint";
	case MIDDLE = "middle distance";
	case LONG = "long distance";

	public const CHOICES = [
		self::SHORT->value,
		self::MIDDLE->value,
		self::LONG->value,
	];
}
