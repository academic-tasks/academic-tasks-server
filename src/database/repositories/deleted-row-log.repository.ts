import { DataSource, EntityManager } from 'typeorm';
import { DeletedRowLogDbEntity } from '../entities/deleted-row-log.db.entity';

export type IDeletedRowLoRepository = ReturnType<
  typeof getDeletedRowLogRepository
>;

export const getDeletedRowLogRepository = (
  dataSource: DataSource | EntityManager,
) => dataSource.getRepository(DeletedRowLogDbEntity).extend({});
