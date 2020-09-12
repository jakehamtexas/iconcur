const isNotZero = (n: number) => n !== 0;
const isNotNegative = (n: number) => n > 0;
const isANumber = (n: number) => typeof n === 'number';
const isAnInteger = (n: number) => n % 1 === 0;
const hasValidPartition = (n: number) =>
  !![n]
    .filter(isANumber)
    .filter(isAnInteger)
    .filter(isNotZero)
    .filter(isNotNegative).length;

export default <T>(
  partitionSize: number
): [(partitioned: T[][], current: T, index: number) => T[][], T[][]] => {
  if (!hasValidPartition(partitionSize))
    throw new Error('Invalid partition: partition must be a positive integer.');
  return [
    (partitioned, current, index) => {
      const insertionIndex = Math.floor(index / partitionSize);
      const atIndex = partitioned[insertionIndex];
      partitioned[insertionIndex] = !!atIndex
        ? [...atIndex, current]
        : [current];
      return partitioned;
    },
    [],
  ];
};
