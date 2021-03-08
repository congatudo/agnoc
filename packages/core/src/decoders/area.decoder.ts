import { inflateSync } from "zlib";
import { toStream } from "../utils/to-stream.util";
import { readWord } from "../utils/read.util";
import {
  CleanPlan,
  CleanPlanInfo,
  CleanRoom,
  MapHeadInfo,
  MapPlanInfo,
} from "../interfaces/map.interface";
import {
  readMapHeadInfo,
  readCleanPlanInfo,
  readMapInfoList,
  readCleanRoomList,
  readCleanPlanList,
} from "./map.decoder";

interface AreaListInfo {
  unk1: {
    unk1: number;
    mapHeadId: number;
    unk2: number;
    unk3: number;
  };
  mapHeadInfo: MapHeadInfo;
  mapGrid: Buffer;
  cleanPlanInfo: CleanPlanInfo;
  mapInfoList: MapPlanInfo[];
  cleanRoomList: CleanRoom[];
  cleanPlanList: CleanPlan[];
}

export function decodeArea(payload: Buffer): AreaListInfo {
  const buffer = inflateSync(payload);
  const stream = toStream(buffer);
  const data: Partial<AreaListInfo> = {};

  data.unk1 = {
    unk1: readWord(stream),
    mapHeadId: readWord(stream),
    unk2: readWord(stream),
    unk3: readWord(stream),
  };

  data.mapHeadInfo = readMapHeadInfo(stream);
  data.mapGrid = stream.read(
    data.mapHeadInfo.sizeX * data.mapHeadInfo.sizeY
  ) as Buffer;
  data.cleanPlanInfo = readCleanPlanInfo(stream);
  data.mapInfoList = readMapInfoList(stream);
  data.cleanRoomList = readCleanRoomList(stream);
  data.cleanPlanList = readCleanPlanList(stream);

  return data as AreaListInfo;
}
