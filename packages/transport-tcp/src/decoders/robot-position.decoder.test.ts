import { expect } from 'chai';
import { decodeRobotPosition } from './robot-position.decoder';

describe('decodeRobotPosition', function () {
  it('should decode a robot position', function () {
    const buffer = Buffer.from('010000000200000001000040400000804000000000', 'hex');
    const robotPosition = decodeRobotPosition(buffer);

    expect(robotPosition).to.be.deep.equal({ mapHeadId: 1, poseId: 2, update: 1, poseX: 3, poseY: 4, posePhi: 0 });
  });
});
