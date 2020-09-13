import { PromiseFn } from './PromiseFn';
import streamWithConcurrency from './streamWithConcurrency';

export default async <T>(
  promiseFns: PromiseFn<T>[],
  concurrencyLimit: number = Number.MAX_SAFE_INTEGER
): Promise<T[]> => {
  const stream = streamWithConcurrency<T>(promiseFns, concurrencyLimit);
  let values = <T[][]>[];
  let partition = await stream.next();
  while (!partition.done) {
    values = [...values, [...partition.value]];
    partition = await stream.next();
  }
  return values.flat();
};
