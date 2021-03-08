export interface StatusInfo {
  mapHeadId: number;
  hasHistoryMap: number;
  workingMode: number;
  batteryPercent: number;
  chargeState: number;
  faultType: number;
  faultCode: number;
  cleanPreference: number;
  repeatClean: number;
  cleanTime: number;
  cleanSize: number;
}

export interface MapHeadInfo {
  mapHeadId: number;
  mapValid: number;
  mapType: number;
  sizeX: number;
  sizeY: number;
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  resolution: number;
}

export interface HistoryHeadInfo {
  mapHeadId: number;
  pointNumber: number;
  poseId: number;
}

export interface RobotChargeInfo {
  mapHeadId: number;
  poseX: number;
  poseY: number;
  posePhi: number;
}

export interface WallListInfo {
  mapHeadId: number;
  cleanPlanId: number;
  areaCount: number;
}

export interface AreaListInfo {
  mapHeadId: number;
  cleanPlanId: number;
  areaCount: number;
}

export interface SpotInfo {
  mapHeadId: number;
  ctrlValue: number;
  poseX: number;
  poseY: number;
  posePhi: number;
}

export interface RobotPoseInfo {
  mapHeadId: number;
  poseId: number;
  update: number;
  poseX: number;
  poseY: number;
  posePhi: number;
}

export interface ChargePoseInfo {
  poseId: number;
  poseX: number;
  poseY: number;
  posePhi: number;
}

export interface CleanPlanInfo {
  mapHeadId: number;
  mask: number;
  firstCleanFlag: number;
}

export interface MapPlanInfo {
  mapHeadId: number;
  mapName: string;
  currentPlanId: number;
}

export interface CleanRoom {
  roomId: number;
  roomName: string;
  roomState: number;
  roomX: number;
  roomY: number;
}

export interface CleanRoomInfo {
  infoId: number;
  infoType: number;
}

export interface CleanPlan {
  planId: number;
  planName: string;
  mapHeadId: number;
  unk1: number;
  areaInfoList: AreaInfo[];
  cleanRoomInfoList: CleanRoomInfo[];
}

export interface AreaInfo {
  areaId: number;
  areaType: number;
  points: number;
  x?: number[];
  y?: number[];
  unk1?: number[];
  unk2?: number[];
  unk3?: number[];
}

export interface RoomEnableInfo {
  mapHeadId: number;
  size: number;
}

export interface MapInfo {
  mask: number;
  statusInfo?: StatusInfo;
  mapHeadInfo?: MapHeadInfo;
  mapGrid?: Buffer;
  historyHeadInfo?: HistoryHeadInfo;
  pointUnk?: Buffer;
  robotChargeInfo?: RobotChargeInfo;
  wallListInfo?: WallListInfo;
  areaListInfo?: AreaListInfo;
  spotInfo?: SpotInfo;
  robotPoseInfo?: RobotPoseInfo;
  cleanPlanInfo?: CleanPlanInfo;
  mapInfoList?: MapPlanInfo[];
  cleanRoomList?: CleanRoom[];
  cleanPlanList?: CleanPlan[];
  totalRooms?: number;
  unkRooms?: Buffer;
  roomEnableInfo?: RoomEnableInfo;
}
