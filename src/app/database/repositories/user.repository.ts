import { DataSource, EntityManager } from 'typeorm';
import { UserDbEntity } from '../entities/user.db.entity';

export type IUserRepository = ReturnType<typeof getUserRepository>;

export const getUserRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(UserDbEntity).extend({});
