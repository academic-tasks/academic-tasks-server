import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { TarefaResolver } from './tarefa.resolver';
import { TarefaService } from './tarefa.service';

@Module({
  imports: [DatabaseModule],
  exports: [TarefaService],
  providers: [TarefaService, TarefaResolver],
})
export class TarefaModule {}
