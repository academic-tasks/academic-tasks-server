import { Provider } from '@nestjs/common';
import { APP_CONTEXT_SYSTEM } from '../consts/APP_CONTEXT_SYSTEM.const';
import { DATA_SOURCE } from '../../database/constants/DATA_SOURCE';
import { DataSource } from 'typeorm';
import { AppContext } from '../services/AppContext';
import { ResourceActionRequest } from '../../auth/interfaces/ResourceActionRequest';

export const appContextSystemProviders: Provider[] = [
  {
    provide: APP_CONTEXT_SYSTEM,
    inject: [
      // ...
      {
        token: DATA_SOURCE,
        optional: false,
      },
    ],
    useFactory: async (dataSource: DataSource) => {
      const appContext = new AppContext(
        dataSource,
        ResourceActionRequest.forSystemInternalActions(),
      );

      return appContext;
    },
  },
];
