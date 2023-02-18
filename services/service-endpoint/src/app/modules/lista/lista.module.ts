import { forwardRef, Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { ListaMembroModule } from '../lista-membro/lista-membro.module';
import { ListaResolver } from './lista.resolver';
import { ListaService } from './lista.service';

@Module({
  imports: [DatabaseModule, forwardRef(() => ListaMembroModule)],
  exports: [ListaService],
  providers: [ListaService, ListaResolver],
})
export class ListaModule {}
