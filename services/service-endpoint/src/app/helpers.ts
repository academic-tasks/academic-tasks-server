import { getPMap } from './fixture-external-dependencies';

export const parralel = async <T, R>(
  input: T[],
  process: (item: T) => Promise<R>,
  concurrency = 2,
): Promise<R[]> => {
  const pMap = await getPMap();

  const output = await pMap(input, (item: T) => process(item), {
    concurrency,
  });

  return output;
};

export const getNowDate = () => new Date();
