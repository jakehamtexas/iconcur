export default (n: number): number[] =>
  new Array(n).fill(null).map((_, i) => i);
