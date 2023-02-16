import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupInitialusuario1672166656371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "usuario" (id_usuario, keycloak_id_usuario)
       VALUES ('e948a62a-4e7b-4a58-94bf-17a76313c7c7', 'e948a62a-4e7b-4a58-94bf-17a76313c7c7');`,
    );

    await queryRunner.query(
      `INSERT INTO "usuario_has_cargo" (id, id_usuario_fk, id_cargo_fk)
       VALUES (1, 'e948a62a-4e7b-4a58-94bf-17a76313c7c7', 1);`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE
                             FROM usuario_has_cargo
                             WHERE id = 1;`);

    await queryRunner.query(`DELETE
                             FROM usuario
                             WHERE id = 1;`);
  }
}
