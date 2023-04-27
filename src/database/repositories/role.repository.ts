import { DataSource, EntityManager } from 'typeorm';
import { RoleDbEntity } from '../entities/role.db.entity';

export type IRoleRepository = ReturnType<typeof getRoleRepository>;

export const getRoleRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(RoleDbEntity).extend({});
