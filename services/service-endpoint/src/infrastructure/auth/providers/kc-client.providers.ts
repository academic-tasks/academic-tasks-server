import { Provider } from '@nestjs/common';
import { KC_CLIENT } from 'src/infrastructure/consts/KC_CLIENT.const';
import { buildKcClient } from './kc-client';

export const KCClientFactory: Provider = {
  provide: KC_CLIENT,

  useFactory: async () => {
    const kcClient = await buildKcClient();
    return kcClient;
  },

  inject: [],
};

export const kcClientProviders = [KCClientFactory];
