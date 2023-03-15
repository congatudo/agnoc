import { decodeArea } from '../decoders/area.decoder';
import { decodeChargePosition } from '../decoders/charge-position.decoder';
import { decodeMap } from '../decoders/map.decoder';
import { decodeRobotPosition } from '../decoders/robot-position.decoder';
import type { DecoderMap } from '../services/payload-object-parser.service';

const decoders: Partial<DecoderMap> = {
  DEVICE_MAPID_GET_GLOBAL_INFO_RSP: decodeMap,
  DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO: decodeArea,
  DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO: decodeChargePosition,
  DEVICE_MAPID_PUSH_MAP_INFO: decodeMap,
  DEVICE_MAPID_PUSH_POSITION_INFO: decodeRobotPosition,
};

export function getCustomDecoders(): Partial<DecoderMap> {
  return decoders;
}
