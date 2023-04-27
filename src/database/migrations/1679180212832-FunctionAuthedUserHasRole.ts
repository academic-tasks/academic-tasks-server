import { MigrationInterface, QueryRunner } from 'typeorm';

export class FunctionAuthedUserHasRole1679180212832
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `
      CREATE OR REPLACE FUNCTION authed_user_has_role(role_slug text)
      RETURNS BOOLEAN
      AS $$
      BEGIN
          RETURN EXISTS (
            SELECT uhc.id
            FROM user_has_role uhc
            INNER JOIN role role ON uhc.id_role = role.id
            INNER JOIN "user" "user" ON uhc.id_user = "user".id
            WHERE (
              ("user".id = public.actor_id()) 
              AND 
              (role.slug = role_slug)
            )
          );
      END;
      $$ LANGUAGE plpgsql SECURITY DEFINER;
      `,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP FUNCTION authed_user_has_role;`);
  }
}
