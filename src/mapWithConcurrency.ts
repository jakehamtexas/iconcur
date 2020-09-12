export default <T>(
  promiseFns: (() => Promise<T>)[],
  concurrencyLimit: number = Number.MAX_SAFE_INTEGER
): Promise<T[]> => Promise.all(promiseFns.map((fn) => fn()));
