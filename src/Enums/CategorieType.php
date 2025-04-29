<?php

namespace App\Enums;

enum CategorieType: string
{
    case U18     = 'U18';
    case U20     = 'U20';
    case U23     = 'U23';
    case SENIOR  = 'SENIOR';
    case MASTER  = 'MASTER';

    public const CHOICES = [
        self::U18->value,
        self::U20->value,
        self::U23->value,
        self::SENIOR->value,
        self::MASTER->value,
    ];
}