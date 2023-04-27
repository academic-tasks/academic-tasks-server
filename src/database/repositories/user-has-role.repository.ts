import { DataSource, EntityManager } from 'typeorm';
import { UserHasRoleDbEntity } from '../entities/user-has-role.db.entity';

export type IUserHasRoleRepository = ReturnType<
  typeof getUserHasRoleRepository
>;

export const getUserHasRoleRepository = (
  dataSource: DataSource | EntityManager,
) => dataSource.getRepository(UserHasRoleDbEntity).extend({});
