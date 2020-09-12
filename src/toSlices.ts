const hasValidPartition = (partitionSize: number) => partitionSize % 1 === 0;
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
