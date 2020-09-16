import { expect } from 'chai';
import toSlices from '../src/toSlices';
import { range } from './util';

describe('toSlices', () => {
  it('should create m partitions of n specified size', () => {
    // arrange
    const expected = [
      [0, 1],
      [2, 3],
    ];
    const arr = range(4);
    // act

    const actual = arr.reduce(...toSlices(2));
    // assert

    expect(actual).to.deep.eq(expected);
  });

  describe('should throw an exception for an invalid partition size', () => {
    it('should not be an integer', () => {
      // act
      const thrower = () => range(4).reduce(...toSlices(1.5));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });

    it('should not be zero', () => {
      // act
      const thrower = () => range(4).reduce(...toSlices(0));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });

    it('should not be negative', () => {
      // act
      const thrower = () => range(4).reduce(...toSlices(-1));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });

    it('should be a number', () => {
      // act
      //@ts-expect-error improper input type
      const thrower = () => range(4).reduce(...toSlices('1'));
      // assert

      expect(thrower).to.throw(
        'Invalid partition: partition must be a positive integer.'
      );
    });
  });

  it('should keep items in the same order after flattening', () => {
    // arrange
    const expected = [1, 2, 3, 4];
    const arr = range(4).map((i) => i + 1);
    // act

    const actual = arr.reduce(...toSlices(2)).flat();
    // assert

    expect(actual).to.deep.eq(expected);
  });

  it('should return a partition of all items if a larger partition size than the length of the array is selected.', () => {
    // arrange
    const expected = [[null, null, null, null]];
    const arr = range(4).map(() => null);
    // act

    const actual = arr.reduce(...toSlices(100));
    // assert

    expect(actual).to.deep.eq(expected);
  });
});
