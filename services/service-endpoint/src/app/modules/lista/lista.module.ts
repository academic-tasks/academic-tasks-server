import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { ListaResolver } from './lista.resolver';
import { ListaService } from './lista.service';

@Module({
  imports: [DatabaseModule],
  exports: [ListaService],
  providers: [ListaService, ListaResolver],
})
export class ListaModule {}
