import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableUser1679180212830 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          {
            name: 'name',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'email',
            type: 'text',
            isNullable: true,
          },

          {
            name: 'keycloak_id',
            type: 'char',
            length: '36',
            isNullable: true,
          },

          {
            name: 'matricula_siape',
            type: 'text',
            isNullable: true,
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

    await queryRunner.query(`ALTER TABLE "user" ENABLE ROW LEVEL SECURITY;`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "user" DISABLE ROW LEVEL SECURITY;`);
    await queryRunner.dropTable('user', true);
  }
}
