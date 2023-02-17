import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitDisciplina1676595155514 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'disciplina',
        columns: [
          {
            name: 'id_disciplina',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'name_disciplina',
            type: 'varchar(255)',
          },

          {
            name: 'cod_suap_disciplina',
            type: 'varchar(255)',
          },

          {
            name: 'id_turma_fk',
            type: 'char(36)',
          },
        ],

        foreignKeys: [
          {
            columnNames: ['id_turma_fk'],
            referencedColumnNames: ['id_turma'],
            referencedTableName: 'turma',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('disciplina', true);
  }
}
