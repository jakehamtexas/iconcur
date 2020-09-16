import { PromiseFnWithIndex } from '../../../src/PromiseFnWithIndex';

export default interface SimpleTest<T> {
  promiseFns: PromiseFnWithIndex<T>[];
  assertion: <U>(actual: U) => void;
}
