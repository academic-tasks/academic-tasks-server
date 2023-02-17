import { DataSource, EntityManager } from 'typeorm';
import { DisciplinaProfessorDbEntity } from '../entities/disciplina-professor.db.entity';

export type IDisciplinaProfessorRepository = ReturnType<
  typeof getDisciplinaProfessorRepository
>;

export const getDisciplinaProfessorRepository = (
  dataSource: DataSource | EntityManager,
) => dataSource.getRepository(DisciplinaProfessorDbEntity).extend({});
