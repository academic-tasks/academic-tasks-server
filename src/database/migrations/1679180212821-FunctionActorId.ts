import { MigrationInterface, QueryRunner } from 'typeorm';

export class FunctionActorId1679180212821 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // await queryRunner.query(`
    // create or replace function public.actor_id()
    // returns INTEGER
    // language sql stable
    // as $$
    //   select
    //   nullif(
    //     coalesce(
    //       current_setting('request.jwt.claim.sub', true),
    //       (current_setting('request.jwt.claims', true)::jsonb ->> 'sub')
    //     ),
    //     ''
    //   )::INTEGER
    // $$;
    // `);

    await queryRunner.query(`
    create or replace function public.actor_id()
    returns INTEGER
    language sql stable
    as $$
      select
      nullif(
        current_setting('request.auth.user.id', true),
        ''
      )::INTEGER
    $$;
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      drop function public.actor_id();
    `);
  }
}
