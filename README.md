# iconcur

`iconcur` is a concurrency limiting library for `Promises`. If you're ready to stop pegging your processor or client's browser with millions of concurrent promises, then look no further. You think this is a great idea. I concur!

# Usage

## mapWithConcurrency

The simplest way to use `iconcur` is with this mapping function.

```typescript
import { mapWithConcurrency } from 'iconcur';

const promiseFns = new Array(1000000)
  .fill(null)
  .map((_, i) => () => Promise.resolve(i));
const concurrencyLimitedResolvedPromises = await mapWithConcurrency(
  promiseFns,
  2
);
```

## Pool

Pools are good general-purposes concurrency controllers. You can specify a certain concurrency limit when you generate a pool, and when you pass a generated pool object a list of promises, it will continuously resolve promises at the concurrency limit until they are all completely settled.

This controller supports cancellation. Cacellation does not halt execution of pending promises.

More features are planned for this controller. However, for now, the only difference between using this and using `mapWithConcurrency` is cancellation support.

```typescript
import iconcur from 'iconcur';

const pool = iconcur.pool(2);

const promiseFns = new Array(1000000)
  .fill(null)
  .map((_, i) => () => Promise.resolve(i));

const promises = pool(promiseFns);

// By calling promises.all(), the promises begin execution.
const resolvedPromises = promises.all();
promises.cancel();
```

Note: Having multiple instances of `pool(fns)` will result in a seperate concurrency limitation context for **each one**.

```typescript
const pool = iconcur.pool(2);
const firstFns = [...];
const secondFns = [...];

const firstPromises = pool(firstFns);
const secondPromises = pool(secondFns);

// This results in a total concurrency limit of 4
// instead of 2.
firstPromises.all();
secondPromises.all();
```

## Generator

Generators are useful for when you want the execution of your concurrent promises to come up for air every once in a while and allow you to operate on the data in some grouping of settled promises before the entire array of promises is settled.

This controller supports cancellation. Cacellation does not halt execution of pending promises.

```typescript
import iconcur from 'iconcur';

const generator = iconcur.generator(2);

const promiseFns = new Array(1000000)
  .fill(null)
  .map((_, i) => () => Promise.resolve(i));

const promises = generator(promiseFns);

// By calling promises.all(), the promises begin execution.
// This will resolve promises in partitions by the given
// concurrency limit.
// This can be inconvenient if a grouping of promises includes
// one long-running promise, as execution of another batch
// will be deferred until the long-running promise of the current
// batch settles.
const resolvedPromises = promises.all();

// Generators are also cancellable.
promises.cancel();

// Another way to begin execution is with .next()

const promises2 = generator(promiseFns);
while (!promises2.isFinished()) {
  // The same caveat regarding long-running promises
  // still applies here.
  const someDateToOperateOn = await promises2.next();
  // Do something with someDateToOperateOn
}
```

As with `pool`, having multiple instances of `generator(fns)` will result in a different concurrency limitation context for each one. Be careful!
