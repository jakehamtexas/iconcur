import ConcurrencyLimitedBatchGenerator from './ConcurrencyLimitedBatchGenerator';
import { PromiseFn } from './PromiseFn';
import mapWithConcurrency from './mapWithConcurrency';
import ConcurrencyLimitedPromisePool from './ConcurrencyLimitedPromisePool';
import ConcurrencyLimitedBuilder from './ConcurrencyLimitedBuilder';

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
};

export { mapWithConcurrency };
