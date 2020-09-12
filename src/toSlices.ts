const isNotZero = (n: number) => n !== 0;
const isNotNegative = (n: number) => n > 0;
const isANumber = (n: number) => typeof n === 'number';
const hasValidPartition = (n: number) =>
  n % 1 === 0 && isNotZero(n) && isNotNegative(n) && isANumber(n);
export default <T>(
  partitionSize: number
): [(partitioned: T[][], current: T, index: number) => T[][], T[][]] => {
  if (!hasValidPartition(partitionSize))
    throw new Error('Invalid partition: partition must be a positive integer.');
  return [
    (partitioned, current, index) => [
      // eslint-disable-line
      [current, current],
      [current, current],
    ],
    [],
  ];
};