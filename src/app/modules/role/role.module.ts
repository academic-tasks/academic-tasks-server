import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/app/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../database/database.module';
import { RoleResolver } from './role.resolver';
import { RoleService } from './role.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    //...
  ],
  exports: [RoleService],
  providers: [RoleService, RoleResolver],
})
export class RoleModule {}
