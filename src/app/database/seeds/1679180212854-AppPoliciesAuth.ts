import { MigrationInterface, QueryRunner } from 'typeorm';

export class AppPoliciesAuth1679180212854 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE POLICY "Everyone can read role" 
      ON "role" 
      FOR SELECT
      USING (
        true
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with role 'admin' can manage role"
      ON "role" 
      FOR ALL 
      TO actor_authenticated 
      USING (
        authed_user_has_role('admin')
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user can read itself"
      ON "user" 
      FOR SELECT
      USING (
        id = public.actor_id()
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with role 'admin' can manage user"
      ON "user"
      FOR ALL
      TO actor_authenticated
      USING (
        authed_user_has_role('admin')
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user can read own user_has_role"
      ON "user_has_role"
      FOR SELECT
      USING (
        id_user = public.actor_id()
      );`,
    );

    await queryRunner.query(
      `CREATE POLICY "Authed user with role 'admin' can manage user_has_role"
      ON "user_has_role"
      FOR ALL
      TO actor_authenticated
      USING (
        authed_user_has_role('admin')
      );
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP POLICY "Everyone can read role" ON "role";`);

    await queryRunner.query(
      `DROP POLICY "Authed user with role 'admin' can manage role" ON "role";`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user can read itself" ON "user";`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with role 'admin' can manage user" ON "user";`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user can read own user_has_role" ON "user_has_role";`,
    );

    await queryRunner.query(
      `DROP POLICY "Authed user with role 'admin' can manage user_has_role" ON "user_has_role"`,
    );
  }
}
