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
});
