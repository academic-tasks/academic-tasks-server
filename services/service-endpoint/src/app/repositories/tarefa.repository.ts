import { DataSource, EntityManager } from 'typeorm';
import { TarefaDbEntity } from '../entities/tarefa.db.entity';

export type ITarefaRepository = ReturnType<typeof getTarefaRepository>;

export const getTarefaRepository = (dataSource: DataSource | EntityManager) =>
  dataSource.getRepository(TarefaDbEntity).extend({});
