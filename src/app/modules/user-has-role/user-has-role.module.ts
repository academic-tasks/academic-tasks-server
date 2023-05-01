import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/app/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../database/database.module';
import { RoleModule } from '../role/role.module';
import { UserHasRoleResolver } from './user-has-role.resolver';
import { UserHasRoleService } from './user-has-role.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    RoleModule,
  ],
  exports: [UserHasRoleService],
  providers: [UserHasRoleService, UserHasRoleResolver],
})
export class UserHasRoleModule {}
