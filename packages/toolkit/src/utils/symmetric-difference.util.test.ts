import { expect } from 'chai';
import { symmetricDifference } from './symmetric-difference.util';

describe('symmetricDifference', function () {
  it('should return the symmetric difference', function () {
    const firstArray = [1, 2, 3, 4, 5];
    const secondArray = [4, 5, 6];

    const ret = symmetricDifference(firstArray, secondArray);

    expect(ret).to.be.deep.equal([1, 2, 3, 6]);
  });
});
