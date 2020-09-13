import mapWithConcurrency from '../src/mapWithConcurrency';
import { expect, assert } from 'chai';
import { getNow, sleep, zip } from './util';
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

  it('should limit concurrency to specified concurrency limit', async function () {
    // arrange
    const seconds = (ms: number) => ms * 1000;
    const numPromisesUnderTest = 5;
    const taskDurationInMs = seconds(1);

    this.timeout(taskDurationInMs * numPromisesUnderTest + seconds(1));

    const delta = taskDurationInMs / 10;
    const timePromiseClosure = async () => {
      const now = getNow();
      await sleep(taskDurationInMs);
      return now;
    };
    const promiseFns = new Array(numPromisesUnderTest)
      .fill(null)
      .map(() => timePromiseClosure);
    const expectedStartMs = getNow();
    const expected = new Array(numPromisesUnderTest)
      .fill(null)
      .map((_, i) => expectedStartMs + taskDurationInMs * i);

    // act
    const actual = await mapWithConcurrency(promiseFns, 1);

    const expectedAndActual = zip(expected, actual);

    // assert
    expectedAndActual.forEach(([expected, actual]) =>
      assert.closeTo(
        actual,
        expected,
        delta,
        `Differs by: ${expected - actual} ms
        `
      )
    );
  });
});
