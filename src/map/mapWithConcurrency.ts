import { PromiseFn } from '../type/PromiseFn';
import { ConcurrencyLimitedBuilder } from '../impl';

export default async <T>(
  promiseFns: PromiseFn<T>[],
  concurrencyLimit: number = Number.MAX_SAFE_INTEGER
): Promise<T[]> =>
  new ConcurrencyLimitedBuilder<T>().pool(promiseFns, concurrencyLimit).all();
