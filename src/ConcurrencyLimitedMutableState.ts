export default interface ConcurrencyLimitedMutableState<TGenerated> {
  current: Promise<IteratorResult<TGenerated>>;
  activeCount: number;
  pendingCount: number;
  isCanceled: boolean;
}
