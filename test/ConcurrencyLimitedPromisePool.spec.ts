import { assert } from 'chai';
import ConcurrencyLimitedBuilder from '../src/ConcurrencyLimitedBuilder';
import { getNow, toSleepPromiseFn } from './util';
import { PromiseFn } from '../src/PromiseFn';

describe('ConcurrencyLimitedStream', () => {
  it('should continuously replenish concurrency pool while handling a single long running promise with concurrency limit of two', async function () {
    const longWaitInMs = 3000;
    this.timeout(longWaitInMs + 1000);
    // arrange
    const toMinMaxPromiseFn = (sleep: PromiseFn<void>) => async () => {
      const start = getNow();
      await sleep();
      return { start, end: getNow() };
    };
    const promiseFns = [
      longWaitInMs,
      longWaitInMs / 3,
      longWaitInMs / 3,
      longWaitInMs / 3,
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

  it('should cancel (promises may continue resolving)', async function () {
    const longWaitInMs = 10;
    // arrange
    const promiseFns = [
      longWaitInMs,
      longWaitInMs / 3,
      longWaitInMs / 3,
      longWaitInMs / 3,
    ].map(toSleepPromiseFn);

    // act
    const pool = new ConcurrencyLimitedBuilder<void>().pool(promiseFns, 2);

    const promises = pool.all();
    pool.cancel();
    const actual = await promises;

    assert(actual.length <= 1);
  });
});
