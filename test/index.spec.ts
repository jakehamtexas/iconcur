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

  describe('should throw an exception for an invalid partition size', () => {
    it('not an integer', () => {
      // arrange
      const arr = new Array(4).fill(null);
      // act
      const thrower = () => arr.reduce(...toSlices(1.5));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });
  });
});
