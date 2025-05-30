<?php

declare(strict_types=1);

namespace App\Service;

class FrenchDateFormatter
{
    private const FRENCH_MONTHS = [
        1 => 'Janvier',
        2 => 'Février', 
        3 => 'Mars',
        4 => 'Avril',
        5 => 'Mai',
        6 => 'Juin',
        7 => 'Juillet',
        8 => 'Août',
        9 => 'Septembre',
        10 => 'Octobre',
        11 => 'Novembre',
        12 => 'Décembre'
    ];

    /**
     * Formate une date en français (format: "22 Janvier 2024")
     */
    public function formatDate(\DateTimeInterface $date): string
    {
        $day = (int) $date->format('j');
        $month = (int) $date->format('n');
        $year = $date->format('Y');

        return sprintf('%d %s %s', $day, self::FRENCH_MONTHS[$month], $year);
    }

    /**
     * Génère une date française formatée à partir d'une chaîne de date
     */
    public function formatDateString(string $dateString): string
    {
        $date = new \DateTime($dateString);
        return $this->formatDate($date);
    }
}
