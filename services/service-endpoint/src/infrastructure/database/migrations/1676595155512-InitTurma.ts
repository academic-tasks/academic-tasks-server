import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitTurma1676595155512 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'turma',
        columns: [
          {
            name: 'id_turma',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'name_turma',
            type: 'varchar(255)',
          },

          {
            name: 'year_turma',
            type: 'int',
          },

          {
            name: 'serie_turma',
            type: 'varchar(3)',
          },

          {
            name: 'turno_turma',
            type: 'varchar(20)',
          },

          {
            name: 'id_curso_fk',
            type: 'char(36)',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_curso_fk'],
            referencedColumnNames: ['id_curso'],
            referencedTableName: 'curso',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('turma', true);
  }
}
