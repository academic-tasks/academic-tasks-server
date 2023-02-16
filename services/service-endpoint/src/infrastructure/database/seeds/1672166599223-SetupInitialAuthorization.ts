import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupInitialAuthorization1672166599223
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "permissao" (id_permissao, description_permissao, recipe_permissao)
       VALUES (1, 'admin', '[ { "action": "manage", "subject": "all" } ]');`,
    );

    await queryRunner.query(`INSERT INTO "cargo" (id_cargo, name_cargo)
                             VALUES (1, 'admin');`);

    await queryRunner.query(`INSERT INTO "cargo_has_permissao" (id_cargo_has_permissao, id_cargo_fk, id_permissao_fk)
                             VALUES (1, 1, 1);`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE
                             FROM cargo_has_permissao
                             WHERE id = 1;`);

    await queryRunner.query(`DELETE
                             FROM cargo
                             WHERE id = 1;`);

    await queryRunner.query(`DELETE
                             FROM permissao
                             WHERE id = 1;`);
  }
}
