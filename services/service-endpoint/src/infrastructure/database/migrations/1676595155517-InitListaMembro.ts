import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitListaMembro1676595155517 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'lista_membro',
        columns: [
          {
            name: 'id_lista_membro',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'id_lista_fk',
            type: 'char(36)',
          },

          {
            name: 'id_usuario_fk',
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
            columnNames: ['id_usuario_fk'],
            referencedColumnNames: ['id_usuario'],
            referencedTableName: 'usuario',
            onDelete: 'CASCADE',
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('lista_membro', true);
  }
}
