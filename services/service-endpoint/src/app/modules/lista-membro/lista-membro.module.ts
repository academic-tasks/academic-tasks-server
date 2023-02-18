import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { ListaModule } from '../lista/lista.module';
import { UsuarioModule } from '../usuario/usuario.module';
import { ListaMembroResolver } from './lista-membro.resolver';
import { ListaMembroService } from './lista-membro.service';

@Module({
  imports: [DatabaseModule, ListaModule, UsuarioModule],
  exports: [ListaMembroService],
  providers: [ListaMembroService, ListaMembroResolver],
})
export class ListaMembroModule {}
