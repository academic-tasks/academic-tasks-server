import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../../infrastructure/database/database.module';
import { PermissaoModule } from '../permissao/permissao.module';
import { CargoResolver } from './cargo.resolver';
import { CargoService } from './cargo.service';

@Module({
  imports: [DatabaseModule, PermissaoModule],
  exports: [CargoService],
  providers: [CargoService, CargoResolver],
})
export class CargoModule {}
