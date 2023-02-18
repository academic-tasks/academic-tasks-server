import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { TurmaModule } from '../turma/turma.module';
import { DisciplinaResolver } from './disciplina.resolver';
import { DisciplinaService } from './disciplina.service';

@Module({
  imports: [DatabaseModule, TurmaModule],
  exports: [DisciplinaService],
  providers: [DisciplinaService, DisciplinaResolver],
})
export class DisciplinaModule {}
