import { DataSource, EntityManager } from 'typeorm';
import { ProfessorDbEntity } from '../entities/professor.db.entity';

export type IProfessorRepository = ReturnType<typeof getProfessorRepository>;

export const getProfessorRepository = (
  dataSource: DataSource | EntityManager,
) => dataSource.getRepository(ProfessorDbEntity).extend({});
