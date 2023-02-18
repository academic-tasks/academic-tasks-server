import { Inject, Injectable } from '@nestjs/common';
import { IDisciplinaProfessorRepository } from 'src/app/repositories/disciplina-professor.repository';
import { REPOSITORY_DISCIPLINA_PROFESSOR } from '../../../infrastructure/database/constants/REPOSITORIES.const';

@Injectable()
export class DisciplinaProfessorService {
  constructor(
    @Inject(REPOSITORY_DISCIPLINA_PROFESSOR)
    private disciplinaProfessorRepository: IDisciplinaProfessorRepository,
  ) {}
}
