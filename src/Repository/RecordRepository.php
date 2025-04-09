<?php

namespace App\Repository;

use App\Entity\Record;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Record>
 */
class RecordRepository extends ServiceEntityRepository
{
	public function __construct(ManagerRegistry $registry)
	{
		parent::__construct($registry, Record::class);
	}

	/**
	 * @param string $value
	 * @return Record[] Returns an array of Record objects
	 */
	public function findByDiscipline(string $value): array
	{
		return $this->createQueryBuilder('r')
			->innerJoin('r.discipline', 'd')
			->andWhere('d.name = :val')
			->setParameter('val', $value)
			->orderBy('r.id', 'ASC')
			->setMaxResults(10)
			->getQuery()
			->getResult();
	}
}
