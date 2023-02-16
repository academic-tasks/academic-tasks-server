import { CreatePermissaoInputZod } from '@academic-tasks/schemas';
import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class InitAuthorization1672076888076 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'permissao',
        columns: [
          {
            name: 'id_permissao',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'description_permissao',
            type: 'varchar(255)',
            default: "''",
          },

          {
            name: 'recipe_permissao',
            type: 'varchar',
            default: "'[]'",
            length: String(CreatePermissaoInputZod.shape.recipe.maxLength),
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'cargo',
        columns: [
          {
            name: 'id_cargo',
            type: 'char(36)',
            isPrimary: true,
          },

          {
            name: 'name_cargo',
            type: 'varchar(255)',
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'cargo_has_permissao',
        columns: [
          {
            name: 'id_cargo_has_permissao',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'id_cargo_fk',
            type: 'int',
          },
          {
            name: 'id_permissao_fk',
            type: 'int',
          },
        ],
        foreignKeys: [
          {
            columnNames: ['id_cargo_fk'],
            referencedTableName: 'cargo',
            referencedColumnNames: ['id_cargo'],
          },
          {
            columnNames: ['id_permissao_fk'],
            referencedTableName: 'permissao',
            referencedColumnNames: ['id_permissao'],
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('cargo_has_permissao', true);
    await queryRunner.dropTable('cargo', true);
    await queryRunner.dropTable('permissao', true);
  }
}
