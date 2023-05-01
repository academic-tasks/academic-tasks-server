import { Provider } from '@nestjs/common';
import { KC_CLIENT } from '../constants/KC_CLIENT.const';
import { buildKcClient } from '../helpers/buildKcClient';

export const KcClientFactory: Provider = {
  provide: KC_CLIENT,

  useFactory: async () => {
    const client = await buildKcClient();
    return client;
  },

  inject: [],
};

export const kcClientProviders = [
  // ...
  KcClientFactory,
];
