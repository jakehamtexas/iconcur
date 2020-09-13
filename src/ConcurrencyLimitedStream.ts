import streamWithConcurrency from './streamWithConcurrency';
import { PromiseFn } from './PromiseFn';
import ConcurrencyLimitedStreamMutableState from './ConcurrencyLimitedStreamMutableState';

export class ConcurrencyLimitedStream<T> {
  private readonly _stream: AsyncGenerator<T[]>;
  private readonly _mutableState: ConcurrencyLimitedStreamMutableState<T>;

  constructor(
    promiseFns: PromiseFn<T>[],
    concurrencyLimit: number = Number.MAX_SAFE_INTEGER
  ) {
    this._stream = streamWithConcurrency(promiseFns, concurrencyLimit);
    this._mutableState = {
      current: this._stream.next(),
      activeCount: 0,
      pendingCount: promiseFns.length,
      isCanceled: false,
    };
  }

  async all(): Promise<T[]> {
    const values = [];
    let partition = await this._mutableState.current;
    while (!partition.done && !this._isCanceled()) {
      const activePromises = partition.value;

      this._updateCounts(activePromises);

      values.push(activePromises);

      this._mutableState.current = this._stream.next();
      partition = await this._mutableState.current;
    }
    this._finish();
    return values.flat();
  }

  cancel(): void {
    this._mutableState.isCanceled = true;
  }

  async next(): Promise<T[]> {
    this._mutableState.current = this._stream.next();
    const iteratorResult = await this._mutableState.current;
    if (!iteratorResult.done) {
      const activePromises = iteratorResult.value;
      this._updateCounts(activePromises);
      return activePromises;
    } else {
      this._finish();
      return [];
    }
  }

  async isFinished(): Promise<boolean> {
    const result = await this._mutableState.current;
    return !!result.done;
  }

  private _isCanceled() {
    return this._mutableState.isCanceled;
  }

  private _updateCounts(activePromises: T[]) {
    this._mutableState.activeCount = activePromises.length;
    this._mutableState.pendingCount -= activePromises.length;
  }
  private _finish() {
    this._mutableState.activeCount = 0;
    this._mutableState.pendingCount = 0;
  }
}
