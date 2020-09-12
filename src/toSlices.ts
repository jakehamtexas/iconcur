export default <T>(
  _partitionSize: number // eslint-disable-line
): [(partitioned: T[][], current: T, index: number) => T[][], T[][]] => [
  (partitioned, current, index) => [
    // eslint-disable-line
    [current, current],
    [current, current],
  ],
  [],
];
