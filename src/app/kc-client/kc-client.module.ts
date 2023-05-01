import { Module } from '@nestjs/common';
import { OIDCClientModule } from '../oidc-client/oidc-client.module';
import { KCClientService } from './kc-client.service';
import { kcClientProviders } from './providers/kc-client.providers';

@Module({
  imports: [
    // ...
    OIDCClientModule,
  ],

  providers: [
    // ...
    ...kcClientProviders,
    KCClientService,
  ],
  exports: [
    // ...
    ...kcClientProviders,
    KCClientService,
  ],
})
export class KCClientModule {}
