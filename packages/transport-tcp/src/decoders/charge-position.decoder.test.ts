import { expect } from 'chai';
import { decodeChargePosition } from './charge-position.decoder';

describe('decodeChargePosition', function () {
  it('should decode a charge position', function () {
    const buffer = Buffer.from('01000000000000400000404000000000', 'hex');
    const chargePosition = decodeChargePosition(buffer);

    expect(chargePosition).to.be.deep.equal({ poseId: 1, poseX: 2, poseY: 3, posePhi: 0 });
  });
});
