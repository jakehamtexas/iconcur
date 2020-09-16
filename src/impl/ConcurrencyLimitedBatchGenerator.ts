import ConcurrencyLimitedBase from './ConcurrencyLimitedBase';
import { PromiseFnResult, PromiseFnWithIndex } from '../type';

export default class ConcurrencyLimitedBatchGenerator<
  T
> extends ConcurrencyLimitedBase<T, PromiseFnResult<T>[]> {
  constructor(
    generator: AsyncGenerator<PromiseFnResult<T>[]>,
    promiseFns: PromiseFnWithIndex<T>[]
  ) {
    super(generator, promiseFns);
  }

  async all(): Promise<T[]> {
    const values = [];
    let partition = await this._mutableState.current;
    while (!partition.done && !this._isCanceled()) {
      const activePromises = partition.value;

      this._updateCounts(activePromises);

      values.push(activePromises);

      this._mutableState.current = this._generator.next();
      partition = await this._mutableState.current;
    }
    this._finish();
    return values.flat().map(({ result }) => result);
  }

  async next(): Promise<T[]> {
    this._mutableState.current = this._generator.next();
    const iteratorResult = await this._mutableState.current;
    if (!iteratorResult.done) {
      const activePromises = iteratorResult.value;
      await this._updateCounts(activePromises);
      return activePromises.map(({ result }) => result);
    } else {
      this._finish();
      return [];
    }
  }

  async isFinished(): Promise<boolean> {
    const result = await this._mutableState.current;
    return this._isCanceled() || !!result.done;
  }
}
