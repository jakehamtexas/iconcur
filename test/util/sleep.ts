export default (durationInMs: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, durationInMs));
