<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250408135336 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            CREATE TABLE athlete (id INT AUTO_INCREMENT NOT NULL, firstname VARCHAR(255) NOT NULL, lastname VARCHAR(255) NOT NULL, country VARCHAR(255) NOT NULL, birthdate DATE NOT NULL, heigth INT DEFAULT NULL, weigth INT DEFAULT NULL, coach VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE discipline (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) NOT NULL, type INT NOT NULL, categories VARCHAR(255) DEFAULT NULL, PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            CREATE TABLE record (id INT AUTO_INCREMENT NOT NULL, athlete_id INT DEFAULT NULL, discipline VARCHAR(255) NOT NULL, last_record DATE NOT NULL, genre VARCHAR(1) NOT NULL, is_active TINYINT(1) NOT NULL, INDEX IDX_9B349F91FE6BCB8B (athlete_id), PRIMARY KEY(id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE record ADD CONSTRAINT FK_9B349F91FE6BCB8B FOREIGN KEY (athlete_id) REFERENCES athlete (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE location CHANGE type type VARCHAR(255) NOT NULL
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE record DROP FOREIGN KEY FK_9B349F91FE6BCB8B
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE athlete
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE discipline
        SQL);
        $this->addSql(<<<'SQL'
            DROP TABLE record
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE location CHANGE type type INT NOT NULL
        SQL);
    }
}
