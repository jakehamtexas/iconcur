import { PromiseFnWithIndex, PromiseFnResult } from '../type';
import { toSlices } from '../util';

export default async function* <T>(
  promiseFns: PromiseFnWithIndex<T>[],
  concurrencyLimit: number = Number.MAX_SAFE_INTEGER
): AsyncGenerator<PromiseFnResult<T>[]> {
  const partitioned = promiseFns.reduce(
    ...toSlices<PromiseFnWithIndex<T>>(concurrencyLimit)
  );
  for (const partition of partitioned) {
    yield await Promise.all(
      partition.map(async ({ fn, i }) => ({ result: await fn(), pos: i }))
    );
  }
}
