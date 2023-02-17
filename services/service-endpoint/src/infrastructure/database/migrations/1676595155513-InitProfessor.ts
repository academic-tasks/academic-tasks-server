import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitProfessor1676595155513 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'professor',
        columns: [
          {
            name: 'id_professor',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'name_professor',
            type: 'varchar(255)',
          },

          {
            name: 'cod_suap_professor',
            type: 'varchar(255)',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('professor', true);
  }
}
