import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatabaseRoles1679180212820 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE ROLE actor_admin BYPASSRLS;`);
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO actor_admin;`,
    );
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO actor_admin;`,
    );

    await queryRunner.query(`CREATE ROLE actor_authenticated;`);

    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO actor_authenticated;`,
    );
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO actor_authenticated;`,
    );

    await queryRunner.query(`CREATE ROLE actor_anon;`);
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO actor_anon;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM actor_anon;`,
    );

    await queryRunner.query(`DROP ROLE actor_anon;`);

    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM actor_authenticated;`,
    );
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM actor_authenticated;`,
    );
    await queryRunner.query(`DROP ROLE actor_authenticated;`);

    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE ALL ON SEQUENCES FROM actor_admin;`,
    );
    await queryRunner.query(
      `ALTER DEFAULT PRIVILEGES IN SCHEMA public REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM actor_admin;`,
    );
    await queryRunner.query(`DROP ROLE actor_admin;`);
  }
}
