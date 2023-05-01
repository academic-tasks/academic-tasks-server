import { Module } from '@nestjs/common';
import { KCClientModule } from 'src/app/kc-client/kc-client.module';
import { MeiliSearchModule } from 'src/app/meilisearch/meilisearch.module';
import { DatabaseModule } from '../../database/database.module';
import { RoleModule } from '../role/role.module';
import { UserResolver } from './user.resolver';
import { UserService } from './user.service';
import { AppContextModule } from '../../app-context/app-context.module';

@Module({
  imports: [
    DatabaseModule,
    MeiliSearchModule,
    // ...
    RoleModule,
    KCClientModule,
    AppContextModule,
  ],
  exports: [
    // ...
    UserService,
  ],
  providers: [
    // ...
    UserService,
    UserResolver,
  ],
})
export class UserModule {}
