import { Module } from '@nestjs/common';
import { kcClientProviders } from 'src/infrastructure/auth/providers/kc-client.providers';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { CargoModule } from '../cargo/cargo.module';
import { UsuarioResolver } from './usuario.resolver';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [DatabaseModule, CargoModule],
  exports: [UsuarioService],
  providers: [UsuarioService, UsuarioResolver, ...kcClientProviders],
})
export class UsuarioModule {}
