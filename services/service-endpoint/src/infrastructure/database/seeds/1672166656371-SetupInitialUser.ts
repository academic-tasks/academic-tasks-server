import { MigrationInterface, QueryRunner } from 'typeorm';

export class SetupInitialusuario1672166656371 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `INSERT INTO "usuario" (id_usuario, keycloak_id_usuario, username_usuario)
       VALUES ('0d8ff33d-612a-4638-bee9-cc228a0f614f', '0d8ff33d-612a-4638-bee9-cc228a0f614f', 'admin');`,
    );

    await queryRunner.query(
      `INSERT INTO "usuario_has_cargo" (id_usuario_has_cargo, id_usuario_fk, id_cargo_fk)
       VALUES (1, '0d8ff33d-612a-4638-bee9-cc228a0f614f', '4364bdb5-130a-4b84-a504-6c302b9933fc');`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DELETE
                             FROM usuario_has_cargo
                             WHERE id_usuario_has_cargo = 1;`);

    await queryRunner.query(`DELETE
                             FROM usuario
                             WHERE id_usuario = '0d8ff33d-612a-4638-bee9-cc228a0f614f';`);
  }
}
