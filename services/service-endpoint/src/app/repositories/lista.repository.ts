import { DataSource, EntityManager } from 'typeorm';
import { ListaDbEntity } from '../entities/lista.db.entity';

export type IListaRepository = ReturnType<typeof getListaRepository>;

export const getListaRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(ListaDbEntity).extend({});
