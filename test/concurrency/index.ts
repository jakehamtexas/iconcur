import { expect } from 'chai';
import SimpleTest from './SimpleTest';
import SimpleTestDictionary from './SimpleTestDictionary';
import toPromiseFnWithIndex from '../../src/toPromiseFnWithIndex';

const assertion = <U>(expected: U) => ({
  assertion: (actual: U) => expect(actual).to.deep.eq(expected),
});
const shouldNotMutate = async <T>() => {
  const promise = Promise.resolve<T>({} as T);
  const expected = [await promise];

  const promiseFns = [() => promise].map(toPromiseFnWithIndex);
  return {
    promiseFns,
    ...assertion(expected),
  } as SimpleTest<T>;
};

const shouldPreserveOrder = async <T>() => {
  const promise1 = Promise.resolve((0 as unknown) as T);
  const promise2 = Promise.resolve((1 as unknown) as T);
  const expected = [await promise1, await promise2];

  const promiseFns = [() => promise1, () => promise2].map(toPromiseFnWithIndex);
  return {
    promiseFns,
    ...assertion(expected),
  };
};
const simpleConcurrencyTests: <T>() => SimpleTestDictionary<T> = <T>() =>
  ({
    ["should not mutate a promise's resolved value"]: shouldNotMutate<T>(),
    ['should preserve order of promises']: shouldPreserveOrder<T>(),
  } as SimpleTestDictionary<T>);

export const getSimpleConcurrencyTests = <T>(
  key: string
): Promise<SimpleTest<T>> =>
  simpleConcurrencyTests<T>()[key] as Promise<SimpleTest<T>>;
