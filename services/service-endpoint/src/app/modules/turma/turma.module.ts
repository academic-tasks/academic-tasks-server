import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { TurmaResolver } from './turma.resolver';
import { TurmaService } from './turma.service';

@Module({
  imports: [DatabaseModule],
  exports: [TurmaService],
  providers: [TurmaService, TurmaResolver],
})
export class TurmaModule {}
