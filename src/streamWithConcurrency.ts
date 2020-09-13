import toSlices from './toSlices';
import { PromiseFn } from './PromiseFn';

export default async function* <T>(
  promiseFns: PromiseFn<T>[],
  concurrencyLimit: number = Number.MAX_SAFE_INTEGER
): AsyncGenerator<T[]> {
  const partitioned = promiseFns.reduce(
    ...toSlices<PromiseFn<T>>(concurrencyLimit)
  );
  for (const partition of partitioned) {
    yield await Promise.all(partition.map((fn) => fn()));
  }
}
