import mapWithConcurrency from '../src/map/mapWithConcurrency';
import { expect, assert } from 'chai';
import { getNow, sleep, zip, range, toSleepPromiseFn, seconds } from './util';
import { PromiseFn } from '../src/type/PromiseFn';
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
    const promiseFns = range(2)
      .map(toSleepPromiseFn)
      .map((sleep: PromiseFn<void>, i) => () => sleep().then(() => i));
    const expected = await Promise.all(promiseFns.map((fn) => fn()));
    // act
    const actual = await mapWithConcurrency(promiseFns);

    // assert
    expect(actual).to.deep.eq(expected);
  });

  it('should limit concurrency to specified concurrency limit', async function () {
    // arrange
    const numPromisesUnderTest = 2;
    const taskDurationInMs = seconds(0.1);

    this.timeout(taskDurationInMs * numPromisesUnderTest + seconds(1));

    const delta = taskDurationInMs / 10;
    const timePromiseClosure = async () => {
      const now = getNow();
      await sleep(taskDurationInMs);
      return now;
    };
    const promiseFns = range(numPromisesUnderTest).map(
      () => timePromiseClosure
    );
    const expected = numPromisesUnderTest * taskDurationInMs;

    // act
    const [actual] = [await mapWithConcurrency(promiseFns, 1)].map(
      (act) => Math.max(...act) - Math.min(...act) + taskDurationInMs
    );

    // assert
    assert.closeTo(
      actual,
      expected,
      delta,
      `Differs by: ${expected - actual} ms
      `
    );
  });
});
