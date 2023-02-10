import { ChargePoseInfo } from '../interfaces/map.interface';
import { readFloat, readWord } from '../utils/stream.util';
import { toStream } from '../utils/to-stream.util';

export function decodeChargePosition(payload: Buffer): ChargePoseInfo {
  const stream = toStream(payload);

  return {
    poseId: readWord(stream),
    poseX: readFloat(stream),
    poseY: readFloat(stream),
    posePhi: readFloat(stream),
  };
}
