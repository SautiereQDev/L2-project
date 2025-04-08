<?php

namespace App\Repository;

use App\Entity\Location;
use App\Enums\LocationType;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Location>
 */
class LocationRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Location::class);
	}

	/**
	 * @param string $value
	 * @param int $nbMaxValues
	 * @return Location[] Returns an array of Location objects
	 * @descriptions: This method finds locations by city.
	 */
	public function finByCountry(string $value, int $nbMaxValues): array
	{
		return $this->createQueryBuilder('l')
			->andWhere('l.country = :val')
			->setParameter('val', $value)
			->orderBy('l.id', 'ASC')
			->setMaxResults($nbMaxValues)
			->getQuery()
			->getResult();
	}

	/**
	 * @param LocationType $type
	 * @param int $nbMaxValues
	 * @return Location[] Returns an array of Location objects
	 * @descriptions: This method finds locations by type.
	 */
	public function findByType(LocationType $type, int $nbMaxValues): array
	{
		return $this->createQueryBuilder('l')
			->andWhere('l.type = :val')
			->setParameter('val', $type)
			->orderBy('l.id', 'ASC')
			->setMaxResults($nbMaxValues)
			->getQuery()
			->getResult();
	}

}
