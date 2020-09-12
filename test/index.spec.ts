import { expect } from 'chai';
import toSlices from '../src/toSlices';

describe('toSlices', () => {
  it('should create m partitions of n specified size', () => {
    // arrange
    const expected = [
      [null, null],
      [null, null],
    ];
    const arr = new Array(4).fill(null);
    // act

    const actual = arr.reduce(...toSlices(2));
    // assert

    expect(actual).to.deep.eq(expected);
  });
});
