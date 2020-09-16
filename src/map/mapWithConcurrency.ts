import { PromiseFn } from '../type/PromiseFn';
import streamWithConcurrency from '../generator/generateBatches';
import toPromiseFnWithIndex from '../util/toPromiseFnWithIndex';
import { ConcurrencyLimitedBuilder } from '../impl';

export default async <T>(
  promiseFns: PromiseFn<T>[],
  concurrencyLimit: number = Number.MAX_SAFE_INTEGER
): Promise<T[]> =>
  new ConcurrencyLimitedBuilder<T>().pool(promiseFns, concurrencyLimit).all();
