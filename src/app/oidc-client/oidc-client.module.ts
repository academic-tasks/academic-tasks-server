import { Module } from '@nestjs/common';
import { oidcClientProviders } from './providers/oidc-client.providers';

@Module({
  imports: [],

  providers: [
    // ...
    ...oidcClientProviders,
  ],
  exports: [
    // ...
    ...oidcClientProviders,
  ],
})
export class OIDCClientModule {}
