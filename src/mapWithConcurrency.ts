import toSlices from './toSlices';

export default async <T>(
  promiseFns: (() => Promise<T>)[],
  concurrencyLimit: number = Number.MAX_SAFE_INTEGER
): Promise<T[]> => {
  const partitioned = promiseFns.reduce(
    ...toSlices<() => Promise<T>>(concurrencyLimit)
  );
  const values = [];
  for (const partition of partitioned) {
    values.push(await Promise.all(partition.map((fn) => fn())));
  }
  return values.flat();
};
