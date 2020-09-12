import mapWithConcurrency from '../src/mapWithConcurrency';
import { expect } from 'chai';
describe('mapWithConcurrency', () => {
  it("should not mutate a promise's resolved value", async () => {
    // arrange
    const promise = Promise.resolve(null);
    const expected = [await promise];

    const promiseFns = [() => promise];

    // act
    const actual = await mapWithConcurrency(promiseFns);

    // assert
    expect(actual).to.deep.eq(expected);
  });

  it('should preserve order of promises', async () => {
    // arrange
    const promise1 = Promise.resolve(0);
    const promise2 = Promise.resolve(1);
    const expected = [await promise1, await promise2];

    const promiseFns = [() => promise1, () => promise2];

    // act
    const actual = await mapWithConcurrency(promiseFns);

    // assert
    expect(actual).to.deep.eq(expected);
  });
});
