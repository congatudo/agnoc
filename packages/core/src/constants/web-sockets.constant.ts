import { PACK_TYPE_MAP_DATA } from "../../schemas/websocket";
import { RobotPoseInfo } from "../interfaces/map.interface";

type ClientRequestMethod = "POST" | "Put";

interface BaseClientRequest {
  traceId: number;
  method: ClientRequestMethod;
}

interface PackageVersion {
  packageType: string;
  version: number;
  versionName: string;
  ctrlVersion: string;
}

interface BaseServerResponse {
  code: number;
  traceId: string;
}

export interface AuthLoginClientRequest extends BaseClientRequest {
  service: "sweeper-robot-center/auth/login";
  content: {
    factoryId: number;
    mac: string;
    keyt: string;
    packageVersions: PackageVersion[];
    projectType: string;
    sn: string;
  };
}

export interface AuthLoginServerResponse extends BaseServerResponse {
  service: "sweeper-robot-center/auth/login";
  result: {
    data: {
      AUTH: string;
      FACTORY_ID: string;
      USERNAME: string;
      CONNECTION_TYPE: string;
      PROJECT_TYPE: string;
      ROBOT_TYPE: string;
      SN: string;
      MAC: string;
      BIND_LIST: string;
      COUNTRY_CITY: string;
    };
    clientType: string;
    id: string;
    resetCode: number;
  };
}

export interface HeartbeatClientRequest extends BaseClientRequest {
  service: "heart-beat";
  content?: number;
}

export interface HeartbeatServerResponse extends BaseServerResponse {
  service: "heart-beat";
  result: string;
}

export interface InfoReportStatusClientRequest extends BaseClientRequest {
  service: `sweeper-robot-center/info_report/status/${number}`;
  content: {
    did: number;
  };
}

interface StatusClientData {
  map_head_id: number;
  areaCleanFlag: number;
  workMode: number;
  battary: number;
  chargeStatus: number;
  type: number;
  faultCode: number;
  cleanPerference: number;
  repeatClean: number;
  cleanTime: number;
  cleanSize: number;
  waterlevel: number;
  dustBox_type: number;
  mop_type: number;
  house_name: string;
  map_count: number;
  current_map_name: string;
  cleaning_roomId: number;
  did: number;
}

export interface StatusToBindClientRequestContentData extends StatusClientData {
  control: "status";
}

export interface GetStatusToBindClientRequestContentData
  extends StatusClientData {
  control: "get_status";
}

export interface DeviceReportDataClientRequest extends BaseClientRequest {
  service: "sweeper-robot-center/device/report_data";
  content: {
    data: StatusToBindClientRequestContentData;
    clientType: string;
  };
}

export interface InfoReportStatusServerResponse extends BaseServerResponse {
  service: `sweeper-robot-center/info_report/status/${number}`;
  result: boolean;
}

export interface DeviceReportDataServerResponse extends BaseServerResponse {
  service: "sweeper-robot-center/device/report_data";
  result: boolean;
}

export interface GetStatusToBindServerRequestContent {
  begin_time: number;
  control: "get_status";
  ctrltype: number;
  end_time: number;
  isSave: number;
  is_open: number;
  mapid: number;
  operation: number;
  result: number;
  type: number;
  value: number;
  voiceMode: number;
  volume: number;
}

export interface SetModeToBindServerRequestContent {
  begin_time: number;
  control: "set_mode";
  ctrltype: number;
  end_time: number;
  isSave: number;
  is_open: number;
  mapid: number;
  operation: number;
  result: number;
  type: number;
  value: number;
  voiceMode: number;
  volume: number;
}

export interface GetVoiceToBindServerRequestContent {
  begin_time: number;
  control: "get_voice";
  ctrltype: number;
  end_time: number;
  isSave: number;
  is_open: number;
  mapid: number;
  operation: number;
  result: number;
  type: number;
  value: number;
  voiceMode: number;
  volume: number;
}

export interface GetQuietTimeToBindServerRequestContent {
  begin_time: number;
  control: "get_quiet_time";
  ctrltype: number;
  end_time: number;
  isSave: number;
  is_open: number;
  mapid: number;
  operation: number;
  result: number;
  type: number;
  value: number;
  voiceMode: number;
  volume: number;
}

export interface DeviceCtrlToBindServerRequestContent {
  begin_time: number;
  control: "device_ctrl";
  ctrltype: number;
  end_time: number;
  isSave: number;
  is_open: number;
  mapid: number;
  operation: number;
  result: number;
  type: number;
  value: number;
  voiceMode: number;
  volume: number;
}

export interface GetSystemConfigToBindServerRequestContent {
  control: "get_systemConfig";
  type: number;
  value: number;
}

export interface LockDeviceToBindServerRequestContent {
  control: "lock_device";
  userid: number;
}

export interface UpgradePacketInfoToBindServerRequestContent {
  control: "upgrade_packet_info";
  userid: number;
}

export interface SetTimeToBindServerRequestContent {
  control: "set_time";
  timezone: number;
  time: number;
}

export interface GetMapToBindServerRequestContent {
  control: "get_map";
  start_index: number;
  end_index: number;
  taskid: number;
  mask: number;
  mapid: number;
  type: number;
}

export interface GetPreferenceToBindServerRequestContent {
  begin_time: number;
  control: "get_preference";
  ctrltype: number;
  end_time: number;
  isSave: number;
  is_open: number;
  mapid: number;
  operation: number;
  result: number;
  type: number;
  value: number;
  voiceMode: number;
  volume: number;
}

export interface SetPreferenceToBindServerRequestContent {
  begin_time: number;
  control: "set_preference";
  ctrltype: number;
  end_time: number;
  isSave: number;
  is_open: number;
  mapid: number;
  operation: number;
  result: number;
  type: number;
  value: number;
  voiceMode: number;
  volume: number;
}

export interface ToBindServerRequest<
  Content extends ToBindServerRequestContent
> {
  tag: "sweeper-transmit/to_bind";
  content: Content;
}

export interface ToBindClientRequest<
  Data extends ToBindClientRequestContentData
> extends BaseClientRequest {
  service: "sweeper-transmit/transmit/to_bind";
  content: {
    data: Data;
    targets: number[];
    clientType: string;
  };
}

export interface GetSystemConfigToBindClientRequestContentData {
  type: number;
  value: number;
  control: "get_systemConfig";
  did: number;
}

export interface LockDeviceToBindClientRequestContentData {
  result: number;
  control: "lock_device";
  did: number;
}

export interface SetTimeToBindClientRequestContentData {
  result: number;
  control: "set_time";
  did: number;
}

export interface GetQuietTimeToBindClientRequestContentData {
  is_open: number;
  begin_time: number;
  end_time: number;
  control: "get_quiet_time";
  did: number;
}

export interface GetVoiceToBindClientRequestContentData {
  voiceMode: number;
  volume: number;
  control: "get_voice";
  did: number;
}

export interface UpgradePacketInfoToBindClientRequestContentData {
  newVersion: number;
  packageSize: string;
  systemVersion: string;
  otaPackageVersion: string;
  remoteUrl: string;
  forceUpgrade: number;
  ctrlVersion: string;
  control: "upgrade_packet_info";
  did: number;
}

export interface DeviceCtrlToBindClientRequestContentData {
  ctrltype: number;
  result: number;
  control: "device_ctrl";
  did: number;
}

export interface GetMapToBindClientRequestContentData {
  type: number;
  result: number;
  control: "get_map";
  did: number;
}

export interface GetPreferenceToBindClientRequestContentData {
  carpet_turbo: number;
  memory_map: number;
  control: "get_preference";
  did: number;
}

export interface SetPreferenceToBindClientRequestContentData {
  result: 0;
  control: "set_preference";
  did: 123418;
}

export interface SetModeToBindClientRequestContentData {
  value: number;
  ctrltype: number;
  result: number;
  control: "set_mode";
  did: number;
}

export interface GetTimeToBindServerRequestContent {
  control: "get_time";
  userid: number;
}

export interface GetTimeToBindClientRequestContentData {
  deviceTime: number;
  deviceTimezone: number;
  control: "get_time";
  did: number;
}

export interface SetVoiceTypeToBindServerRequestContent {
  Voice: number;
  control: "setVoiceType";
}

export interface SetVoiceTypeToBindClientRequestContentData {
  result: number;
  control: "setVoiceType";
  did: number;
}

export type ToBindClientRequestContentData =
  | DeviceCtrlToBindClientRequestContentData
  | GetMapToBindClientRequestContentData
  | GetPreferenceToBindClientRequestContentData
  | GetQuietTimeToBindClientRequestContentData
  | GetStatusToBindClientRequestContentData
  | GetSystemConfigToBindClientRequestContentData
  | GetTimeToBindClientRequestContentData
  | GetVoiceToBindClientRequestContentData
  | LockDeviceToBindClientRequestContentData
  | SetModeToBindClientRequestContentData
  | SetPreferenceToBindClientRequestContentData
  | SetTimeToBindClientRequestContentData
  | SetVoiceTypeToBindClientRequestContentData
  | StatusToBindClientRequestContentData
  | UpgradePacketInfoToBindClientRequestContentData;

export type ToBindServerRequestContent =
  | DeviceCtrlToBindServerRequestContent
  | GetMapToBindServerRequestContent
  | GetPreferenceToBindServerRequestContent
  | GetQuietTimeToBindServerRequestContent
  | GetStatusToBindServerRequestContent
  | GetSystemConfigToBindServerRequestContent
  | GetTimeToBindServerRequestContent
  | GetVoiceToBindServerRequestContent
  | LockDeviceToBindServerRequestContent
  | SetModeToBindServerRequestContent
  | SetPreferenceToBindServerRequestContent
  | SetTimeToBindServerRequestContent
  | SetVoiceTypeToBindServerRequestContent
  | UpgradePacketInfoToBindServerRequestContent;

export interface ToBindServerResponse extends BaseServerResponse {
  service: "sweeper-transmit/transmit/to_bind";
  result: boolean;
}

export interface RobotSynNoCacheClientRequest<
  Data extends RobotSynNoCacheClientRequestContentData
> extends BaseClientRequest {
  service: "sweeper-map/robot/syn_no_cache";
  content: {
    data: Data;
    targets: number[];
  };
}

export type RobotSynNoCacheClientRequestContentData =
  | RobotPoseInfo
  | PACK_TYPE_MAP_DATA
  | PACK_TYPE_MAP_DATA[];

export interface RobotSynNoCacheServerResponse extends BaseServerResponse {
  service: "sweeper-map/robot/syn_no_cache";
  result: boolean;
}

export type ClientRequest =
  | AuthLoginClientRequest
  | HeartbeatClientRequest
  | InfoReportStatusClientRequest
  | DeviceReportDataClientRequest
  | ToBindClientRequest<ToBindClientRequestContentData>
  | RobotSynNoCacheClientRequest<RobotSynNoCacheClientRequestContentData>;

export type ServerResponse =
  | AuthLoginServerResponse
  | HeartbeatServerResponse
  | InfoReportStatusServerResponse
  | DeviceReportDataServerResponse
  | ToBindServerResponse
  | RobotSynNoCacheServerResponse;

export type ServerRequest = ToBindServerRequest<ToBindServerRequestContent>;

export type WebSocketPayload = ClientRequest | ServerResponse | ServerRequest;
export type ClientRequestCommand = ClientRequest["service"];
export type ServerResponseCommand = ServerResponse["service"];
export type ServerRequestCommand = ServerRequest["tag"];

export type PickClientRequest<T extends ClientRequestCommand> = Extract<
  ClientRequest,
  { service: T }
>;

export type PickToBindClientRequestContentData<
  T extends ToBindClientRequestContentData["control"]
> = Extract<ToBindClientRequestContentData, { control: T }>;

export type PickServerResponse<T extends ServerResponseCommand> = Extract<
  ServerResponse,
  { service: T }
>;

export type PickWebSocketCommand<T extends WebSocketPayload> =
  T extends ServerRequest
    ? Extract<ServerRequestCommand, T["tag"]>
    : T extends ClientRequest
    ? Extract<ClientRequestCommand, T["service"]>
    : T extends ServerResponse
    ? Extract<ServerResponseCommand, T["service"]>
    : never;
