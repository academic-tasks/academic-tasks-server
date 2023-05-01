import { Module } from '@nestjs/common';
import { appContextSystemProviders } from './providers/app-context-system.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],

  providers: [
    // ...
    ...appContextSystemProviders,
  ],
  exports: [
    // ...
    ...appContextSystemProviders,
  ],
})
export class AppContextModule {}
