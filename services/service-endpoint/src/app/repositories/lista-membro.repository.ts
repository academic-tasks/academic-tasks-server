import { DataSource, EntityManager } from 'typeorm';
import { ListaMembroDbEntity } from '../entities/lista-membro.db.entity';

export type IListaMembroRepository = ReturnType<
  typeof getListaMembroRepository
>;

export const getListaMembroRepository = (
  dataSource: DataSource | EntityManager,
) => dataSource.getRepository(ListaMembroDbEntity).extend({});
