import { DataSource, EntityManager } from 'typeorm';
import { DisciplinaDbEntity } from '../entities/disciplina.db.entity';

export type IDisciplinaRepository = ReturnType<typeof getDisciplinaRepository>;

export const getDisciplinaRepository = (
  dataSource: DataSource | EntityManager,
) => dataSource.getRepository(DisciplinaDbEntity).extend({});
