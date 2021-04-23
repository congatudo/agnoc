import { inflateSync } from "zlib";
import { toStream } from "../utils/to-stream.util";
import {
  readByte,
  readFloat,
  readShort,
  readString,
  readWord,
} from "../utils/stream.util";
import { Readable } from "stream";
import {
  AreaInfo,
  CleanArea,
  CleanAreaInfo,
  CleanCoordinate,
  CleanPlan,
  CleanPlanInfo,
  CleanRoom,
  CleanRoomInfo,
  MapHeadInfo,
  MapInfo,
  MapPlanInfo,
  Point,
  RoomConnection,
  RoomSegment,
} from "../interfaces/map.interface";
import { DomainException } from "../exceptions/domain.exception";

export function readMapHeadInfo(stream: Readable): MapHeadInfo {
  return {
    mapHeadId: readWord(stream),
    mapValid: readWord(stream),
    mapType: readWord(stream),
    sizeX: readWord(stream),
    sizeY: readWord(stream),
    minX: readFloat(stream),
    minY: readFloat(stream),
    maxX: readFloat(stream),
    maxY: readFloat(stream),
    resolution: readFloat(stream),
  };
}

export function readCleanPlanInfo(stream: Readable): CleanPlanInfo {
  return {
    mapHeadId: readWord(stream),
    mask: readShort(stream),
    firstCleanFlag: readByte(stream),
  };
}

export function readMapInfoList(stream: Readable): MapPlanInfo[] {
  const size = readByte(stream);
  const list = [];

  for (let i = 0; i < size; i++) {
    list.push({
      mapHeadId: readWord(stream),
      mapName: readString(stream),
    });
  }

  return list;
}

export function readCleanRoomList(stream: Readable): CleanRoom[] {
  const size = readWord(stream);
  const list = [];

  for (let i = 0; i < size; i++) {
    list.push({
      roomId: readByte(stream),
      roomName: readString(stream),
      roomState: readByte(stream),
      roomX: readFloat(stream),
      roomY: readFloat(stream),
    });
  }

  return list;
}

export function readAreaInfoList(stream: Readable): AreaInfo[] {
  const size = readWord(stream);
  const list = [];

  for (let i = 0; i < size; i++) {
    const areaInfo: AreaInfo = {
      areaId: readWord(stream),
      areaType: readWord(stream),
      points: readWord(stream),
    };

    if (areaInfo.points) {
      areaInfo.x = new Array(areaInfo.points)
        .fill(0)
        .map(() => readFloat(stream));
      areaInfo.y = new Array(areaInfo.points)
        .fill(0)
        .map(() => readFloat(stream));
      areaInfo.unk1 = new Array(areaInfo.points)
        .fill(0)
        .map(() => readFloat(stream));
      areaInfo.unk2 = new Array(areaInfo.points)
        .fill(0)
        .map(() => readFloat(stream));
      areaInfo.unk3 = new Array(areaInfo.points)
        .fill(0)
        .map(() => readFloat(stream));
    }

    list.push(areaInfo);
  }

  return list;
}

export function readCleanRoomInfoList(stream: Readable): CleanRoomInfo[] {
  const size = readWord(stream);
  const list = [];

  for (let i = 0; i < size; i++) {
    list.push({
      roomId: readByte(stream),
      enable: readByte(stream),
    });
  }

  return list;
}

export function readCleanPlanList(stream: Readable): CleanPlan[] {
  const size = readByte(stream);
  const list = [];

  for (let i = 0; i < size; i++) {
    list.push({
      planId: readWord(stream),
      planName: readString(stream),
      mapHeadId: readWord(stream),
      currentPlanId: readWord(stream),
      areaInfoList: readAreaInfoList(stream),
      cleanRoomInfoList: readCleanRoomInfoList(stream),
    });
  }

  return list;
}

function readCleanCoordinateList(stream: Readable): CleanCoordinate[] {
  const count = readWord(stream);
  const list = [];

  for (let i = 0; i < count; i++) {
    list.push({
      x: readFloat(stream),
      y: readFloat(stream),
    });
  }

  // dump unknown bytes.
  stream.read(3 * count * 4);

  return list;
}

function readCleanAreaList(stream: Readable): CleanArea[] {
  const count = readWord(stream);
  const list = [];

  for (let i = 0; i < count; i++) {
    list.push({
      cleanAreaId: readWord(stream),
      cleanPlanId: readWord(stream),
      coordinateList: readCleanCoordinateList(stream),
    });
  }

  return list;
}

function readCleanAreaInfo(stream: Readable): CleanAreaInfo {
  return {
    mapHeadId: readWord(stream),
    cleanPlanId: readWord(stream),
    cleanAreaList: readCleanAreaList(stream),
  };
}

function readRoomSegment(stream: Readable): RoomSegment {
  const list = [];
  const roomId = readWord(stream);
  const count = readWord(stream);

  for (let i = 0; i < count; i++) {
    list.push({
      x: readShort(stream),
      y: readShort(stream),
      mask: readByte(stream),
    });
  }

  return {
    roomId,
    roomPixelList: list,
  };
}

function readRoomSegmentList(stream: Readable): RoomSegment[] {
  const count = readWord(stream);
  const list = [];

  for (let i = 0; i < count; i++) {
    list.push(readRoomSegment(stream));
  }

  return list;
}

function readRoomConnectionList(
  stream: Readable,
  roomList: CleanRoom[]
): RoomConnection[] {
  const list = [];

  for (let i = 0; i < roomList.length; i++) {
    const connectionList = [];

    for (let j = 0; j < roomList.length; j++) {
      const flag = readByte(stream);

      if (flag) {
        connectionList.push(roomList[j].roomId);
      }
    }

    list.push({
      roomId: roomList[i].roomId,
      connectionList,
    });
  }

  return list;
}

function readPointList(stream: Readable, pointNumber: number): Point[] {
  const list = [];

  for (let i = 0; i < pointNumber; i++) {
    list.push({
      flag: readByte(stream),
      x: readFloat(stream),
      y: readFloat(stream),
    });
  }

  return list;
}

export const MASK = {
  STATUS: 0x1,
  MAP: 0x2,
  HISTORY: 0x4,
  CHARGER: 0x8,
  WALL_LIST: 0x10,
  AREA_LIST: 0x20,
  SPOT: 0x40,
  ROBOT: 0x80,
  AREA_MODE: 0x100,
  SPOT_MODE: 0x200,
  PLAN_LIST: 0x800,
  UNK: 0x1000,
  UNK_2: 0x2000,
  ROOM_LIST: 0x4000,
};

function readMap(stream: Readable, mask: number): MapInfo {
  const data: MapInfo = { mask };

  if (data.mask > 0x7fff) {
    throw new DomainException(`Invalid mask ${data.mask}`);
  }

  if (data.mask & 0x1) {
    data.statusInfo = {
      mapHeadId: readWord(stream),
      hasHistoryMap: Boolean(readWord(stream)),
      workingMode: readWord(stream),
      batteryPercent: readWord(stream),
      chargeState: Boolean(readWord(stream)),
      faultType: readWord(stream),
      faultCode: readWord(stream),
      cleanPreference: readWord(stream),
      repeatClean: Boolean(readWord(stream)),
      cleanTime: readWord(stream),
      cleanSize: readWord(stream),
    };
  }

  if (data.mask & 0x2) {
    data.mapHeadInfo = readMapHeadInfo(stream);
    data.mapGrid = stream.read(
      data.mapHeadInfo.sizeX * data.mapHeadInfo.sizeY
    ) as Buffer;
  }

  if (data.mask & 0x4) {
    data.historyHeadInfo = {
      mapHeadId: readWord(stream),
      poseId: readWord(stream),
      pointNumber: readWord(stream),
      pointList: [],
    };

    data.historyHeadInfo.pointList = readPointList(
      stream,
      data.historyHeadInfo.pointNumber
    );
  }

  if (data.mask & 0x8) {
    data.robotChargeInfo = {
      mapHeadId: readWord(stream),
      poseX: readFloat(stream),
      poseY: readFloat(stream),
      posePhi: readFloat(stream),
    };
  }

  if (data.mask & 0x10) {
    data.wallListInfo = readCleanAreaInfo(stream);
  }

  if (data.mask & 0x20) {
    data.areaListInfo = readCleanAreaInfo(stream);
  }

  if (data.mask & 0x40) {
    data.spotInfo = {
      mapHeadId: readWord(stream),
      ctrlValue: readWord(stream),
      poseX: readFloat(stream),
      poseY: readFloat(stream),
      posePhi: readFloat(stream),
    };
  }

  if (data.mask & 0x80) {
    data.robotPoseInfo = {
      mapHeadId: readWord(stream),
      poseId: readWord(stream),
      update: readByte(stream),
      poseX: readFloat(stream),
      poseY: readFloat(stream),
      posePhi: readFloat(stream),
    };
  }

  // if (data.mask & 0x100) {
  //   throw new DomainException(
  //     `handleMap: unhandled mask 0x100 (${data.mask}) with payload ${
  //       (stream.read() as Buffer | null)?.length || 0
  //     }`
  //   );
  // }

  // if (data.mask & 0x200) {
  //   throw new DomainException(
  //     `handleMap: unhandled mask 0x200 (${data.mask}) with payload ${
  //       (stream.read() as Buffer | null)?.length || 0
  //     }`
  //   );
  // }

  // if (data.mask & 0x400) {
  //   throw new DomainException(
  //     `handleMap: unhandled mask 0x400 (${data.mask}) with payload ${
  //       (stream.read() as Buffer | null)?.length || 0
  //     }`
  //   );
  // }

  if (data.mask & 0x800) {
    data.cleanPlanInfo = readCleanPlanInfo(stream);
    data.mapInfoList = readMapInfoList(stream);
    data.currentPlanId = readWord(stream);
    data.cleanRoomList = readCleanRoomList(stream);
    data.cleanPlanList = readCleanPlanList(stream);
  }

  if (data.mask & 0x1000 && data.cleanRoomList) {
    // dump rooms
    data.roomConnectionList = readRoomConnectionList(
      stream,
      data.cleanRoomList
    );
  }

  if (data.mask & 0x2000) {
    data.roomEnableInfo = {
      mapHeadId: readWord(stream),
      size: readByte(stream),
    };

    if (data.roomEnableInfo.size) {
      // throw new DomainException("handleMap: unhandled room enable info");
    }

    // dump unknown bytes
    data.unk1 = stream.read(50) as Buffer;
  }

  if (data.mask & 0x4000) {
    data.roomSegmentList = readRoomSegmentList(stream);
  }

  if (stream.readableLength) {
    throw new DomainException("handleMap: unread bytes on stream");
  }

  return data;
}

export function decodeMap(payload: Buffer): MapInfo {
  const buffer = inflateSync(payload);

  try {
    // try 3490 approach.
    const stream = toStream(buffer);
    const mask = readWord(stream);

    return readMap(stream, mask);
  } catch (e) {
    // on error, try 3090 approach.
    const stream = toStream(buffer);
    const mask = readShort(stream);

    return readMap(stream, mask);
  }
}
