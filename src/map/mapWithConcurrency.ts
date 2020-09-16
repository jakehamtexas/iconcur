import { PromiseFn } from '../type/PromiseFn';
import streamWithConcurrency from '../generator/generateBatchesWithConcurrency';
import toPromiseFnWithIndex from '../util/toPromiseFnWithIndex';

export default async <T>(
  promiseFns: PromiseFn<T>[],
  concurrencyLimit: number = Number.MAX_SAFE_INTEGER
): Promise<T[]> => {
  const stream = streamWithConcurrency<T>(
    promiseFns.map(toPromiseFnWithIndex),
    concurrencyLimit
  );
  let values = <T[][]>[];
  let partition = await stream.next();
  while (!partition.done) {
    values = [...values, [...partition.value.map(({ result }) => result)]];
    partition = await stream.next();
  }
  return values.flat();
};
