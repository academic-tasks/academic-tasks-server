import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { DisciplinaProfessorResolver } from './disciplina-professor.resolver';
import { DisciplinaProfessorService } from './disciplina-professor.service';

@Module({
  imports: [DatabaseModule],
  exports: [DisciplinaProfessorService],
  providers: [DisciplinaProfessorService, DisciplinaProfessorResolver],
})
export class DisciplinaProfessorModule {}
