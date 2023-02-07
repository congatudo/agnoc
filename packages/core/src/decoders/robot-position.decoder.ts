import { toStream } from "../utils/to-stream.util";
import { RobotPoseInfo } from "../interfaces/map.interface";
import { readRobotPoseInfo } from "./map.decoder";

export function decodeRobotPosition(payload: Buffer): RobotPoseInfo {
  const stream = toStream(payload);

  return readRobotPoseInfo(stream);
}
