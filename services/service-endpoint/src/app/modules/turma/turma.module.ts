import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CursoModule } from '../curso/curso.module';
import { TurmaResolver } from './turma.resolver';
import { TurmaService } from './turma.service';

@Module({
  imports: [DatabaseModule, CursoModule],
  exports: [TurmaService],
  providers: [TurmaService, TurmaResolver],
})
export class TurmaModule {}
