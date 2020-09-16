import { PromiseFn, PromisePoolResult } from '../type';

export default async function* <T>(
  promiseFns: PromiseFn<T>[]
): AsyncGenerator<PromisePoolResult<T>> {
  for (let pos = 0; pos < promiseFns.length; pos++) {
    const fn = promiseFns[pos];
    yield { result: fn(), pos };
  }
}
