import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableRole1679180212828 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'role',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'slug',
            type: 'text',
            isUnique: true,
          },

          //

          {
            name: 'last_update',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'last_search_sync',
            type: 'timestamptz',
            isNullable: true,
          },

          //
        ],
      }),
    );

    await queryRunner.query(`ALTER TABLE "role" ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "role" DISABLE ROW LEVEL SECURITY;`);

    await queryRunner.dropTable('role', true);
  }
}
