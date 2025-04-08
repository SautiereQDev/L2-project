<?php

namespace App\Repository;

use App\Entity\Athlete;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Athlete>
 */
class AthleteRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Athlete::class);
	}

	/**
	 * @param string $country
	 * @descriptions: This method finds athletes by country.
	 * @return Athlete[] Returns an array of Athlete objects
	 */
	public function findByCountry(string $country): array
	{
		return $this->createQueryBuilder('a')
			->andWhere('a.country = :country')
			->setParameter('country', $country)
			->orderBy('a.id', 'ASC')
			->setMaxResults(10)
			->getQuery()
			->getResult();
	}

	/**
	 * @param string $firstName
	 * @param string $lastName
	 * @descriptions: This method finds an athlete by their full name.
	 * @return Athlete|null Returns an Athlete object or null if not found
	 */
	public function findOneByFullName(string $firstName, string $lastName): ?Athlete
	{
		return $this->createQueryBuilder('a')
			->andWhere('a.firstname = :firstname')
			->andWhere('a.lastname = :lastname')
			->setParameter('firstname', $firstName)
			->setParameter('lastname', $lastName)
			->getQuery()
			->getOneOrNullResult();
	}
}
