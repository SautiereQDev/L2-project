<?php

namespace App\Utils;

use DateTime;

class DisplayPerformance
{

	/**
	 * Format "9.58s" pour le 100m
	 * @param DateTime $chrono
	 * @return string
	 */
	public static function sprintFormat(DateTime $chrono): string
	{
		$chrono = clone $chrono;
		$chrono->setTimezone(new \DateTimeZone('UTC'));
		$seconds = $chrono->format('s');
		$milliseconds = $chrono->format('u');

		return sprintf('%d.%02ds', (int)$seconds, (int)($milliseconds / 10000));
	}

	/**
	 * Format "3:26.00" pour le 1500m
	 * @param DateTime $chrono
	 * @return string
	 */
	public static function middleFormat(DateTime $chrono): string
	{
		$chrono = clone $chrono;
		$chrono->setTimezone(new \DateTimeZone('UTC'));
		$minutes = $chrono->format('i');
		$seconds = $chrono->format('s');
		$milliseconds = $chrono->format('u');

		return sprintf('%d:%02d.%02d', (int)$minutes, (int)$seconds, (int)($milliseconds / 10000));
	}

	/**
	 * Format "2h10min20s" pour le marathon
	 * @param DateTime $chrono
	 * @return string
	 */
	public static function longFormat(DateTime $chrono): string
	{
		$chrono = clone $chrono;
		$chrono->setTimezone(new \DateTimeZone('UTC'));
		$hours = $chrono->format('H');
		$minutes = $chrono->format('i');
		$seconds = $chrono->format('s');

		return sprintf('%dh%02dmin%02ds', (int)$hours, (int)$minutes, (int)$seconds);
	}

	/**
	 * Format "6.52m" pour le saut / lancer
	 * @param float $distance
	 * @return string
	 */
	public static function otherFormat(float $distance): string
	{
	    $meters = floor($distance);
	    $centimeters = round(($distance - $meters) * 100);
	    return sprintf('%d.%02dm', $meters, $centimeters);
	}
}
