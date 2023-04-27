import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialRoles1679180212914 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    INSERT INTO public.role
      (id, slug)
      VALUES(1, 'admin');
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    DELETE FROM public.role
      WHERE id=1;
    `);
  }
}
