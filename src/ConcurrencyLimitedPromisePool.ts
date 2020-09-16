import ConcurrencyLimitedBase from './ConcurrencyLimitedBase';
import { PromiseFnWithIndex } from './PromiseFnWithIndex';
import { PromisePoolResult } from './PromisePoolResult';

export default class ConcurrencyLimitedPromisePool<
  T
> extends ConcurrencyLimitedBase<T, PromisePoolResult<T>> {
  private readonly _concurrencyLimit: number;
  private readonly _numPromises: number;

  constructor(
    generator: AsyncGenerator<PromisePoolResult<T>>,
    promiseFns: PromiseFnWithIndex<T>[],
    concurrencyLimit: number = Number.MAX_SAFE_INTEGER
  ) {
    super(generator, promiseFns);
    this._concurrencyLimit = concurrencyLimit;
    this._numPromises = promiseFns.length;
  }

  async all(): Promise<T[]> {
    const pendings = [];
    const resolveds = [];
    while (!this._isCanceled() && resolveds.length < this._numPromises) {
      let generatorResult = this._mutableState.current;
      while (!this._isCanceled() && pendings.length < this._concurrencyLimit) {
        const iteratorResult = await generatorResult;
        if (!iteratorResult.done) {
          pendings.push(iteratorResult.value);
        } else {
          break;
        }
        generatorResult = this._mutableState.current = this._generator.next();
      }
      const { resolved, pendingsPos } = await Promise.race(
        pendings.map(async ({ result, pos }, pendingsPos) => ({
          resolved: {
            result: await result,
            pos,
          },
          pendingsPos,
        }))
      );
      await Promise.resolve();
      pendings.splice(pendingsPos, 1);
      resolveds.push(resolved);
    }
    const sortByPosition = (
      { pos: a }: { pos: number },
      { pos: b }: { pos: number }
    ) => {
      if (a > b) {
        return 1;
      }
      if (a < b) {
        return -1;
      }
      return 0;
    };
    return resolveds.sort(sortByPosition).map(({ result }) => result);
  }
}
