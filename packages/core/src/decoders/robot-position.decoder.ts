import { toStream } from "../utils/to-stream.util";
import { readByte, readFloat, readWord } from "../utils/stream.util";
import { RobotPoseInfo } from "../interfaces/map.interface";

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
