import { toStream, readWord, readFloat } from '@agnoc/toolkit';
import { ChargePoseInfo } from '../interfaces/map.interface';

export function decodeChargePosition(payload: Buffer): ChargePoseInfo {
  const stream = toStream(payload);

  return {
    poseId: readWord(stream),
    poseX: readFloat(stream),
    poseY: readFloat(stream),
    posePhi: readFloat(stream),
  };
}
