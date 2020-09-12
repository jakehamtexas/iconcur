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
    it('should not be an integer', () => {
      // arrange
      const arr = new Array(4).fill(null);
      // act
      const thrower = () => arr.reduce(...toSlices(1.5));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });

    it('should not be zero', () => {
      // arrange
      const arr = new Array(4).fill(null);
      // act
      const thrower = () => arr.reduce(...toSlices(0));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });

    it('should not be negative', () => {
      // arrange
      const arr = new Array(4).fill(null);
      // act
      const thrower = () => arr.reduce(...toSlices(-1));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });

    it('should be a number', () => {
      // arrange
      const arr = new Array(4).fill(null);
      // act
      //@ts-expect-error improper input type
      const thrower = () => arr.reduce(...toSlices('1'));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });
  });

  it('should keep items in the same order after flattening', () => {
    // arrange
    const expected = [1, 2, 3, 4];
    const arr = new Array(4).fill(null).map((_, i) => i + 1);
    // act

    const actual = arr.reduce(...toSlices(2)).flat();
    // assert

    expect(actual).to.deep.eq(expected);
  });

  it('should return a partition of all items if a larger partition size than the length of the array is selected.', () => {
    // arrange
    const expected = [[null, null, null, null]];
    const arr = new Array(4).fill(null);
    // act

    const actual = arr.reduce(...toSlices(100));
    // assert

    expect(actual).to.deep.eq(expected);
  });
});
