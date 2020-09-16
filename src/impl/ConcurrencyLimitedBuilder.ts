import ConcurrencyLimitedBatchGenerator from './ConcurrencyLimitedBatchGenerator';
import ConcurrencyLimitedPromisePool from './ConcurrencyLimitedPromisePool';
import toPromiseFnWithIndex from '../util/toPromiseFnWithIndex';
import { PromiseFn } from '../type';
import { generateBatches, generateSinglePromises } from '../generator';

export default class ConcurrencyLimitedBuilder<T> {
  generator(
    promiseFns: PromiseFn<T>[],
    concurrencyLimit: number
  ): ConcurrencyLimitedBatchGenerator<T> {
    const fns = promiseFns.map(toPromiseFnWithIndex);
    const generator = generateBatches(fns, concurrencyLimit);
    return new ConcurrencyLimitedBatchGenerator<T>(generator, fns);
  }

  pool(
    promiseFns: PromiseFn<T>[],
    concurrencyLimit: number
  ): ConcurrencyLimitedPromisePool<T> {
    const fns = promiseFns.map(toPromiseFnWithIndex);
    const generator = generateSinglePromises(promiseFns);
    return new ConcurrencyLimitedPromisePool<T>(
      generator,
      fns,
      concurrencyLimit
    );
  }
}
