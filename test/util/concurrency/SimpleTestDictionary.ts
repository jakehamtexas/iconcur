import SimpleTest from './SimpleTest';

export default interface SimpleTestDictionary<T> {
  [key: string]: Promise<SimpleTest<T>>;
}
