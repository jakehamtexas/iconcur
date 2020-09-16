export type PromiseFnWithIndex<T> = {
  fn: () => Promise<T>;
  i: number;
};
