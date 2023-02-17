import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitLista1676595155516 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lista',
        columns: [
          {
            name: 'id_lista',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'title_lista',
            type: 'varchar(255)',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lista', true);
  }
}
