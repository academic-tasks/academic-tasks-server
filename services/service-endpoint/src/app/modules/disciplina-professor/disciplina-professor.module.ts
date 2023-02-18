import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { DisciplinaModule } from '../disciplina/disciplina.module';
import { ProfessorModule } from '../professor/professor.module';
import { DisciplinaProfessorResolver } from './disciplina-professor.resolver';
import { DisciplinaProfessorService } from './disciplina-professor.service';

@Module({
  imports: [DatabaseModule, ProfessorModule, DisciplinaModule],
  exports: [DisciplinaProfessorService],
  providers: [DisciplinaProfessorService, DisciplinaProfessorResolver],
})
export class DisciplinaProfessorModule {}
