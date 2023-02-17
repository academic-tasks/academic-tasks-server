import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitDisciplinaProfessor1676595155515
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'disciplina_professor',
        columns: [
          {
            name: 'id_disciplina_professor',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'id_disciplina_fk',
            type: 'char(36)',
          },

          {
            name: 'id_professor_fk',
            type: 'char(36)',
          },
        ],

        foreignKeys: [
          {
            columnNames: ['id_disciplina_fk'],
            referencedColumnNames: ['id_disciplina'],
            referencedTableName: 'disciplina',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['id_professor_fk'],
            referencedColumnNames: ['id_professor'],
            referencedTableName: 'professor',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('disciplina_professor', true);
  }
}
