export interface StatusInfo {
  mapHeadId: number;
  hasHistoryMap: boolean;
  workingMode: number;
  batteryPercent: number;
  chargeState: boolean;
  faultType: number;
  faultCode: number;
  cleanPreference: number;
  repeatClean: boolean;
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
  poseId: number;
  pointNumber: number;
  pointList: Point[];
}

export interface RobotChargeInfo {
  mapHeadId: number;
  poseX: number;
  poseY: number;
  posePhi: number;
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
}

export interface CleanRoom {
  roomId: number;
  roomName: string;
  roomState: number;
  roomX: number;
  roomY: number;
}

export interface CleanRoomInfo {
  roomId: number;
  enable: number;
}

export interface CleanPlan {
  planId: number;
  planName: string;
  mapHeadId: number;
  currentPlanId: number;
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

export interface CleanCoordinate {
  x: number;
  y: number;
}

export interface CleanArea {
  cleanAreaId: number;
  cleanPlanId: number;
  coordinateList: CleanCoordinate[];
}

export interface CleanAreaInfo {
  mapHeadId: number;
  cleanPlanId: number;
  cleanAreaList: CleanArea[];
}

export interface RoomPixel {
  x: number;
  y: number;
  mask: number;
}

export interface RoomSegment {
  roomId: number;
  roomPixelList: RoomPixel[];
}

export interface RoomConnection {
  roomId: number;
  connectionList: number[];
}

export interface Point {
  flag: number;
  x: number;
  y: number;
}

export interface MapInfo {
  mask: number;
  statusInfo?: StatusInfo;
  mapHeadInfo?: MapHeadInfo;
  mapGrid?: Buffer;
  historyHeadInfo?: HistoryHeadInfo;
  robotChargeInfo?: RobotChargeInfo;
  wallListInfo?: CleanAreaInfo;
  areaListInfo?: CleanAreaInfo;
  spotInfo?: SpotInfo;
  robotPoseInfo?: RobotPoseInfo;
  cleanPlanInfo?: CleanPlanInfo;
  mapInfoList?: MapPlanInfo[];
  currentPlanId?: number;
  cleanRoomList?: CleanRoom[];
  cleanPlanList?: CleanPlan[];
  roomConnectionList?: RoomConnection[];
  roomEnableInfo?: RoomEnableInfo;
  unk1?: Buffer;
  roomSegmentList?: RoomSegment[];
}
