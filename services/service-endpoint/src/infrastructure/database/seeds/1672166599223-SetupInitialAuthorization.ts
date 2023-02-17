import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupInitialAuthorization1672166599223
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "permissao" (id_permissao, description_permissao, recipe_permissao)
       VALUES ('5496033f-d806-4def-9252-bde1554f1ac5', 'admin', '[ { "action": "manage", "subject": "all" } ]');`,
    );

    await queryRunner.query(`INSERT INTO "cargo" (id_cargo, name_cargo)
                             VALUES ('4364bdb5-130a-4b84-a504-6c302b9933fc', 'admin');`);

    await queryRunner.query(`INSERT INTO "cargo_has_permissao" (id_cargo_has_permissao, id_cargo_fk, id_permissao_fk)
                             VALUES (1, '4364bdb5-130a-4b84-a504-6c302b9933fc', '5496033f-d806-4def-9252-bde1554f1ac5');`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE
                             FROM cargo_has_permissao
                             WHERE id = 1;`);

    await queryRunner.query(`DELETE
                             FROM cargo
                             WHERE id_cargo = '4364bdb5-130a-4b84-a504-6c302b9933fc';`);

    await queryRunner.query(`DELETE
                             FROM permissao
                             WHERE id_permissao = '5496033f-d806-4def-9252-bde1554f1ac5';`);
  }
}
