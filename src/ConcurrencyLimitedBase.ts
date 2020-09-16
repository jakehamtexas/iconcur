import ConcurrencyLimitedMutableState from './ConcurrencyLimitedMutableState';
import { PromiseFnWithIndex } from './PromiseFnWithIndex';

export default abstract class ConcurrencyLimitedBase<T, TGenerated> {
  protected readonly _mutableState: ConcurrencyLimitedMutableState<TGenerated>;
  protected readonly _generator: AsyncGenerator<TGenerated>;

  constructor(
    generator: AsyncGenerator<TGenerated>,
    promiseFns: PromiseFnWithIndex<T>[]
  ) {
    this._generator = generator;
    this._mutableState = {
      current: generator.next(),
      activeCount: 0,
      pendingCount: promiseFns.length,
      isCanceled: false,
    };
  }

  cancel(): void {
    this._mutableState.isCanceled = true;
  }
  protected _isCanceled(): boolean {
    return this._mutableState.isCanceled;
  }

  protected async _updateCounts<U>(activePromises: U[]): Promise<void> {
    await Promise.resolve();
    this._mutableState.activeCount = activePromises.length;
    this._mutableState.pendingCount -= activePromises.length;
  }
  protected _finish(): void {
    this._mutableState.activeCount = 0;
    this._mutableState.pendingCount = 0;
  }
}
