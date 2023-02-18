import {
  AppAction,
  AppSubject,
  IAddProfessorToDisciplinaInput,
  IRemoveProfessorFromDisciplinaInput,
} from '@academic-tasks/schemas';
import { Inject, Injectable } from '@nestjs/common';
import { DisciplinaProfessorDbEntity } from 'src/app/entities/disciplina-professor.db.entity';
import { DisciplinaDbEntity } from 'src/app/entities/disciplina.db.entity';
import { ProfessorDbEntity } from 'src/app/entities/professor.db.entity';
import { IDisciplinaProfessorRepository } from 'src/app/repositories/disciplina-professor.repository';
import { ResourceActionRequest } from 'src/infrastructure/auth/ResourceActionRequest';
import { REPOSITORY_DISCIPLINA_PROFESSOR } from '../../../infrastructure/database/constants/REPOSITORIES.const';
import { DisciplinaService } from '../disciplina/disciplina.service';
import { ProfessorService } from '../professor/professor.service';

@Injectable()
export class DisciplinaProfessorService {
  constructor(
    private professorService: ProfessorService,

    private disciplinaService: DisciplinaService,

    @Inject(REPOSITORY_DISCIPLINA_PROFESSOR)
    private disciplinaProfessorRepository: IDisciplinaProfessorRepository,
  ) {}

  async findDisciplinaProfessor(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
    professorId: string,
  ) {
    const disciplinaProfessor =
      await this.disciplinaProfessorRepository.findOne({
        where: {
          disciplina: { id: disciplinaId },
          professor: { id: professorId },
        },
      });

    return disciplinaProfessor;
  }

  async checkProfessorInDisciplina(
    resourceActionRequest: ResourceActionRequest,
    disciplinaId: string,
    professorId: string,
  ) {
    const disciplinaProfessor = await this.findDisciplinaProfessor(
      resourceActionRequest,
      disciplinaId,
      professorId,
    );
    return disciplinaProfessor !== null;
  }

  async addProfessorToDisciplina(
    resourceActionRequest: ResourceActionRequest,
    dto: IAddProfessorToDisciplinaInput,
  ) {
    const professor = await this.professorService.findProfessorByIdSimple(
      resourceActionRequest,
      dto.professorId,
    );

    const disciplina = await this.disciplinaService.findDisciplinaByIdSimple(
      resourceActionRequest,
      dto.disciplinaId,
    );

    const isProfessorInDisciplina = await this.checkProfessorInDisciplina(
      resourceActionRequest,
      disciplina.id,
      professor.id,
    );

    if (!isProfessorInDisciplina) {
      const disciplinaProfessor = this.disciplinaProfessorRepository.create();

      DisciplinaProfessorDbEntity.setupInitialIds(disciplinaProfessor);

      disciplinaProfessor.professor = <ProfessorDbEntity>{ id: professor.id };
      disciplinaProfessor.disciplina = <DisciplinaDbEntity>{
        id: disciplina.id,
      };

      resourceActionRequest.ensurePermission(
        AppAction.UPDATE,
        AppSubject.DISCIPLINA,
        'professores',
      );

      await this.disciplinaProfessorRepository.save(disciplinaProfessor);
    }

    return true;
  }

  async removeProfessorFromDisciplina(
    resourceActionRequest: ResourceActionRequest,
    dto: IRemoveProfessorFromDisciplinaInput,
  ) {
    const professor = await this.professorService.findProfessorByIdSimple(
      resourceActionRequest,
      dto.professorId,
    );

    const disciplina = await this.disciplinaService.findDisciplinaByIdSimple(
      resourceActionRequest,
      dto.disciplinaId,
    );

    const disciplinaProfessor = await this.findDisciplinaProfessor(
      resourceActionRequest,
      disciplina.id,
      professor.id,
    );

    if (disciplinaProfessor) {
      resourceActionRequest.ensurePermission(
        AppAction.UPDATE,
        AppSubject.DISCIPLINA,
        'professores',
      );

      await this.disciplinaProfessorRepository.remove(disciplinaProfessor);
    }

    return true;
  }
}
