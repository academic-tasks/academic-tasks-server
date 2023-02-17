import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class InitUsuario1672163948413 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'usuario',
        columns: [
          {
            name: 'id_usuario',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'keycloak_id_usuario',
            type: 'varchar(36)',
            isNullable: true,
          },

          {
            name: 'username_usuario',
            type: 'varchar(64)',
            isUnique: true,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'usuario_has_cargo',
        columns: [
          {
            name: 'id_usuario_has_cargo',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id_usuario_fk',
            type: 'char(36)',
          },
          {
            name: 'id_cargo_fk',
            type: 'char(36)',
          },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['id_usuario_fk'],
            referencedColumnNames: ['id_usuario'],
            referencedTableName: 'usuario',
          }),
          new TableForeignKey({
            columnNames: ['id_cargo_fk'],
            referencedColumnNames: ['id_cargo'],
            referencedTableName: 'cargo',
          }),
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('usuario_has_cargo', true);
    await queryRunner.dropTable('usuario', true);
  }
}
