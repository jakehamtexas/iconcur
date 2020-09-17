import { PromiseFn } from './type/PromiseFn';
import mapWithConcurrency from './map/mapWithConcurrency';
import {
  ConcurrencyLimitedBuilder,
  ConcurrencyLimitedBatchGenerator,
  ConcurrencyLimitedPromisePool,
} from './impl';

const builder = <T>() => new ConcurrencyLimitedBuilder<T>();
export default {
  generator: (
    concurrencyLimit: number
  ): (<T>(
    promiseFns: PromiseFn<T>[]
  ) => ConcurrencyLimitedBatchGenerator<T>) => <T>(
    promiseFns: PromiseFn<T>[]
  ) => builder<T>().generator(promiseFns, concurrencyLimit),
  pool: (
    concurrencyLimit: number
  ): (<T>(promiseFns: PromiseFn<T>[]) => ConcurrencyLimitedPromisePool<T>) => <
    T
  >(
    promiseFns: PromiseFn<T>[]
  ) => builder<T>().pool(promiseFns, concurrencyLimit),
  mapWithConcurrency,
};
