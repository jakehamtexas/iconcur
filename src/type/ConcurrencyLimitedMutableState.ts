export default class ConcurrencyLimitedMutableState<TGenerated> {
  private readonly _generator: AsyncGenerator<TGenerated>;
  constructor(generator: AsyncGenerator<TGenerated>, pendingCount: number) {
    this._generator = generator;
    this.activeCount = 0;
    this.pendingCount = pendingCount;
    this.isCanceled = false;
    this.current = Promise.resolve({}) as Promise<IteratorResult<TGenerated>>;
  }
  activeCount: number;
  pendingCount: number;
  isCanceled: boolean;
  current: Promise<IteratorResult<TGenerated>>;

  next(): Promise<IteratorResult<TGenerated>> {
    this.current = this._generator.next();
    return this.current;
  }
}
