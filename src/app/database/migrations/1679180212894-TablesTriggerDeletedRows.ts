import { MigrationInterface, QueryRunner } from 'typeorm';

const tables = [
  // ...
  'role',
  'user',
];

export class TablesTriggerDeletedRow1679180212894
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    for (const table of tables) {
      await queryRunner.query(`
        CREATE TRIGGER ${table}_deleted_row_trigger
        AFTER DELETE ON "${table}"
        FOR EACH ROW
        EXECUTE FUNCTION log_deleted_row();
      `);
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    for (const table of tables) {
      await queryRunner.query(`
      DROP TRIGGER ${table}_deleted_row_trigger ON "${table}";
    `);
    }
  }
}
