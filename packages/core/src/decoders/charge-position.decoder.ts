import { ChargePoseInfo } from "../interfaces/map.interface";
import { toStream } from "../utils/to-stream.util";
import { readFloat, readWord } from "../utils/stream.util";

export function decodeChargePosition(payload: Buffer): ChargePoseInfo {
  const stream = toStream(payload);

  return {
    poseId: readWord(stream),
    poseX: readFloat(stream),
    poseY: readFloat(stream),
    posePhi: readFloat(stream),
  };
}
