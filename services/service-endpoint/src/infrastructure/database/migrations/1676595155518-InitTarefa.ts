import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitTarefa1676595155518 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'tarefa',
        columns: [
          {
            name: 'id_tarefa',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'title_tarefa',
            type: 'varchar(255)',
          },

          {
            name: 'description_tarefa',
            type: 'varchar(255)',
          },

          {
            name: 'date_open_tarefa',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'date_close_tarefa',
            type: 'timestamptz',
            isNullable: true,
          },

          {
            name: 'submission_format_tarefa',
            type: 'varchar(255)',
          },

          {
            name: 'id_lista_fk',
            type: 'char(36)',
          },

          {
            name: 'id_disciplina_fk',
            type: 'char(36)',
          },
        ],

        foreignKeys: [
          {
            columnNames: ['id_lista_fk'],
            referencedColumnNames: ['id_lista'],
            referencedTableName: 'lista',
            onDelete: 'CASCADE',
          },
          {
            columnNames: ['id_disciplina_fk'],
            referencedColumnNames: ['id_disciplina'],
            referencedTableName: 'disciplina',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('tarefa', true);
  }
}
