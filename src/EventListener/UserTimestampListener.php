<?php

namespace App\EventListener;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PrePersistEventArgs;
use Doctrine\ORM\Event\PreUpdateEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::prePersist)]
#[AsDoctrineListener(event: Events::preUpdate)]
class UserTimestampListener
{
    public function prePersist(PrePersistEventArgs $args): void
    {
        $entity = $args->getObject();
        
        if (!$entity instanceof User) {
            return;
        }
        
        // Pour les nouveaux enregistrements, createdAt et updatedAt sont déjà définis dans le constructeur
    }
    
    public function preUpdate(PreUpdateEventArgs $args): void
    {
        $entity = $args->getObject();
        
        if (!$entity instanceof User) {
            return;
        }
        
        // Met à jour le champ updatedAt lors de la modification
        $entity->setUpdatedAt(new \DateTimeImmutable());
    }
}
