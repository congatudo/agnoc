import { toStream, readWord, readByte, readFloat } from '@agnoc/toolkit';
import type { RobotPoseInfo } from './map.interface';

export function decodeRobotPosition(payload: Buffer): RobotPoseInfo {
  const stream = toStream(payload);

  return {
    mapHeadId: readWord(stream),
    poseId: readWord(stream),
    update: readByte(stream),
    poseX: readFloat(stream),
    poseY: readFloat(stream),
    posePhi: readFloat(stream),
  };
}
