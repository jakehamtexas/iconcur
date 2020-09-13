import { ConcurrencyLimitedStream } from './ConcurrencyLimitedStream';
import { PromiseFn } from './PromiseFn';
import mapWithConcurrency from './mapWithConcurrency';

export default (
  concurrencyLimit: number
): (<T>(promiseFns: PromiseFn<T>[]) => ConcurrencyLimitedStream<T>) => <T>(
  promiseFns: PromiseFn<T>[]
) => new ConcurrencyLimitedStream(promiseFns, concurrencyLimit);

export { mapWithConcurrency };
