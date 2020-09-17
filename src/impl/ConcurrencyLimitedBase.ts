import { PromiseFnWithIndex, ConcurrencyLimitedMutableState } from '../type';

export default abstract class ConcurrencyLimitedBase<T, TGenerated> {
  protected readonly _mutableState: ConcurrencyLimitedMutableState<TGenerated>;

  constructor(
    generator: AsyncGenerator<TGenerated>,
    promiseFns: PromiseFnWithIndex<T>[]
  ) {
    this._mutableState = new ConcurrencyLimitedMutableState(
      generator,
      promiseFns.length
    );
  }

  cancel(): void {
    this._mutableState.isCanceled = true;
  }

  activeCount(): number {
    return this._mutableState.activeCount;
  }

  pendingCount(): number {
    return this._mutableState.pendingCount;
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
