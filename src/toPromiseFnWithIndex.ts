import { PromiseFnWithIndex } from './PromiseFnWithIndex';
import { PromiseFn } from './PromiseFn';

export default <T>(fn: PromiseFn<T>, i: number): PromiseFnWithIndex<T> => ({
  fn,
  i,
});
