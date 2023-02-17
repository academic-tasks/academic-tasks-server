import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitCurso1676595155511 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'curso',
        columns: [
          {
            name: 'id_curso',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'name_curso',
            type: 'varchar(255)',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('curso', true);
  }
}
