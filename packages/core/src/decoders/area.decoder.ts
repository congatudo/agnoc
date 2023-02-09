import { inflateSync } from "zlib";
import {
  CleanPlan,
  CleanPlanInfo,
  CleanRoom,
  MapHeadInfo,
  MapPlanInfo,
} from "../interfaces/map.interface";
import { readWord } from "../utils/stream.util";
import { toStream } from "../utils/to-stream.util";
import {
  readMapHeadInfo,
  readCleanPlanInfo,
  readMapInfoList,
  readCleanRoomList,
  readCleanPlanList,
} from "./map.decoder";

interface Unk1 {
  unk1: number;
  unk2: number;
}

interface AreaListInfo {
  count: number;
  mapHeadId?: number;
  unk2?: Unk1[];
  mapHeadInfo?: MapHeadInfo;
  mapGrid?: Buffer;
  cleanPlanInfo?: CleanPlanInfo;
  mapInfoList?: MapPlanInfo[];
  currentPlanId?: number;
  cleanRoomList?: CleanRoom[];
  cleanPlanList?: CleanPlan[];
}

export function decodeArea(payload: Buffer): AreaListInfo {
  const buffer = inflateSync(payload);
  const stream = toStream(buffer);
  const data: Partial<AreaListInfo> = {};

  data.count = readWord(stream);

  if (!data.count) {
    return data as AreaListInfo;
  }

  data.mapHeadId = readWord(stream);
  data.unk2 = [];

  for (let i = 0; i < data.count; i++) {
    data.unk2.push({
      unk1: readWord(stream),
      unk2: readWord(stream),
    });
  }

  data.mapHeadInfo = readMapHeadInfo(stream);
  data.mapGrid = stream.read(
    data.mapHeadInfo.sizeX * data.mapHeadInfo.sizeY
  ) as Buffer;
  data.cleanPlanInfo = readCleanPlanInfo(stream);
  data.mapInfoList = readMapInfoList(stream);
  data.currentPlanId = readWord(stream);
  data.cleanRoomList = readCleanRoomList(stream);
  data.cleanPlanList = readCleanPlanList(stream);

  return data as AreaListInfo;
}
