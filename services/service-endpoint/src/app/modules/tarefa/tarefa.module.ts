import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { DisciplinaModule } from '../disciplina/disciplina.module';
import { ListaMembroModule } from '../lista-membro/lista-membro.module';
import { ListaModule } from '../lista/lista.module';
import { TarefaResolver } from './tarefa.resolver';
import { TarefaService } from './tarefa.service';

@Module({
  imports: [DatabaseModule, ListaModule, ListaMembroModule, DisciplinaModule],
  exports: [TarefaService],
  providers: [TarefaService, TarefaResolver],
})
export class TarefaModule {}
