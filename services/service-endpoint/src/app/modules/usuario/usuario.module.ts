import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioResolver } from './usuario.resolver';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [DatabaseModule, CargoModule],
  exports: [UsuarioService],
  providers: [UsuarioService, UsuarioResolver],
})
export class UsuarioModule {}
