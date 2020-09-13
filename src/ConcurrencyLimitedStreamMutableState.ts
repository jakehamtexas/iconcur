export default interface ConcurrencyLimitedStreamMutableState<T> {
  current: Promise<IteratorResult<T[]>>;
  activeCount: number;
  pendingCount: number;
  isCanceled: boolean;
}
