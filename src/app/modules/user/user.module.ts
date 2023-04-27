import { Module } from '@nestjs/common';
import { MeiliSearchModule } from 'src/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../../database/database.module';
import { RoleModule } from '../role/role.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    RoleModule,
  ],
  exports: [UserService],
  providers: [UserService, UserResolver],
})
export class UserModule {}
