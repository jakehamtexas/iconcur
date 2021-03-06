import { assert } from 'chai';
import { getNow, toSleepPromiseFn, seconds, range } from './util';
import { ConcurrencyLimitedBuilder } from '../src/impl';
import { PromiseFn } from '../src/type/PromiseFn';

describe('ConcurrencyLimitedStream', () => {
  it('should continuously replenish concurrency pool while handling a single long running promise with concurrency limit of two', async function () {
    // arrange
    const longWaitInMs = seconds(0.2);
    const additionalTests = 2;
    const toMinMaxPromiseFn = (sleep: PromiseFn<void>) => async () => {
      const start = getNow();
      await sleep();
      return { start, end: getNow() };
    };
    const promiseFns = [
      longWaitInMs,
      ...range(additionalTests).map(() => longWaitInMs / additionalTests),
    ]
      .map(toSleepPromiseFn)
      .map(toMinMaxPromiseFn);

    // act
    const actual = await new ConcurrencyLimitedBuilder<{
      start: number;
      end: number;
    }>()
      .pool(promiseFns, 2)
      .all();

    const timeTakenInMs =
      Math.max(...actual.map(({ end }) => end)) -
      Math.min(...actual.map(({ start }) => start));

    // assert
    assert.closeTo(timeTakenInMs, longWaitInMs, longWaitInMs / 10);
  });

  it('should cancel (pending promises will resolve)', async function () {
    const longWaitInMs = 10;
    // arrange
    const promiseFns = [longWaitInMs, longWaitInMs].map(toSleepPromiseFn);

    // act
    const pool = new ConcurrencyLimitedBuilder<void>().pool(promiseFns, 2);

    const promises = pool.all();
    pool.cancel();
    const actual = await promises;

    assert(actual.length <= 1);
  });
});
