import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { PermissaoResolver } from './permissao.resolver';
import { PermissoesService } from './permissao.service';

@Module({
  imports: [DatabaseModule],
  exports: [PermissoesService],
  providers: [PermissoesService, PermissaoResolver],
})
export class PermissaoModule {}
