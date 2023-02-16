import inclusion from 'inclusion';

export const getHelmet = (): Promise<typeof import('helmet')['default']> =>
  import('helmet').then((mod) => mod.default);

export const getPMap = () =>
  inclusion<typeof import('p-map')>('p-map').then((mod) => mod.default);
