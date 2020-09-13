export default <T>(first: T[], second: T[]): T[][] =>
  first.map((t, i) => [t, second[i]]);
