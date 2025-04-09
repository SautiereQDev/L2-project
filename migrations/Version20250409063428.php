<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20250409063428 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE record ADD discipline_id INT DEFAULT NULL, ADD previous_record_id INT DEFAULT NULL, ADD performance VARCHAR(255) DEFAULT NULL, ADD is_current_record TINYINT(1) NOT NULL
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE record ADD CONSTRAINT FK_9B349F91A5522701 FOREIGN KEY (discipline_id) REFERENCES discipline (id)
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE record ADD CONSTRAINT FK_9B349F914A8F5A0D FOREIGN KEY (previous_record_id) REFERENCES record (id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_9B349F91A5522701 ON record (discipline_id)
        SQL);
        $this->addSql(<<<'SQL'
            CREATE INDEX IDX_9B349F914A8F5A0D ON record (previous_record_id)
        SQL);
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql(<<<'SQL'
            ALTER TABLE record DROP FOREIGN KEY FK_9B349F91A5522701
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE record DROP FOREIGN KEY FK_9B349F914A8F5A0D
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_9B349F91A5522701 ON record
        SQL);
        $this->addSql(<<<'SQL'
            DROP INDEX IDX_9B349F914A8F5A0D ON record
        SQL);
        $this->addSql(<<<'SQL'
            ALTER TABLE record DROP discipline_id, DROP previous_record_id, DROP performance, DROP is_current_record
        SQL);
    }
}
