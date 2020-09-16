import { PromiseFnWithIndex, PromiseFn } from '../type';

export default <T>(fn: PromiseFn<T>, i: number): PromiseFnWithIndex<T> => ({
  fn,
  i,
});
