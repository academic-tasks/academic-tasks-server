import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class TableUserHasRole1679180212831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'user_has_role',

        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },

          //

          {
            name: 'id_user',
            type: 'int',
            isNullable: false,
          },

          {
            name: 'id_role',
            type: 'int',
            isNullable: false,
          },

          //
        ],

        foreignKeys: [
          {
            name: 'FK_UserHasRole_User',
            referencedTableName: 'user',
            referencedColumnNames: ['id'],
            columnNames: ['id_user'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },

          {
            name: 'FK_UserHasRole_Role',
            referencedTableName: 'role',
            referencedColumnNames: ['id'],
            columnNames: ['id_role'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          },
        ],
      }),
    );

    await queryRunner.query(
      `ALTER TABLE "user_has_role" ENABLE ROW LEVEL SECURITY;`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_has_role" DISABLE ROW LEVEL SECURITY;`,
    );

    await queryRunner.dropTable('user_has_role', true);
  }
}
