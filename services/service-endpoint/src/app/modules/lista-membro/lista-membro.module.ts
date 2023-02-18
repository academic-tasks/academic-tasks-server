import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { ListaMembroResolver } from './lista-membro.resolver';
import { ListaMembroService } from './lista-membro.service';

@Module({
  imports: [DatabaseModule],
  exports: [ListaMembroService],
  providers: [ListaMembroService, ListaMembroResolver],
})
export class ListaMembroModule {}
