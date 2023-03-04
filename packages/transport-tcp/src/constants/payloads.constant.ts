import type { OPNameLiteral } from './opcodes.constant';
import type { AreaListInfo } from '../decoders/area.decoder';
import type { MapInfo, ChargePoseInfo, RobotPoseInfo } from '../interfaces/map.interface';
import type {
  ICLIENT_HEARTBEAT_REQ,
  ICLIENT_HEARTBEAT_RSP,
  ICLIENT_IDLE_TIMEOUT,
  ICLIENT_ONLINE_REQ,
  ICLIENT_ONLINE_RSP,
  ICOMMON_ERROR_REPLY,
  IDEVICE_AREA_CLEAN_REQ,
  IDEVICE_AREA_CLEAN_RSP,
  IDEVICE_AUTO_CLEAN_REQ,
  IDEVICE_AUTO_CLEAN_RSP,
  IDEVICE_CHARGE_REQ,
  IDEVICE_CHARGE_RSP,
  IDEVICE_CLEANMAP_BINDATA_REPORT_REQ,
  IDEVICE_CLEANMAP_BINDATA_REPORT_RSP,
  IDEVICE_CONTROL_LOCK_REQ,
  IDEVICE_CONTROL_LOCK_RSP,
  IDEVICE_EVENT_REPORT_CLEANMAP,
  IDEVICE_EVENT_REPORT_CLEANTASK,
  IDEVICE_EVENT_REPORT_REQ,
  IDEVICE_EVENT_REPORT_RSP,
  IDEVICE_GETTIME_REQ,
  IDEVICE_GETTIME_RSP,
  IDEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ,
  IDEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP,
  IDEVICE_MANUAL_CTRL_REQ,
  IDEVICE_MANUAL_CTRL_RSP,
  IDEVICE_MAPID_GET_CONSUMABLES_PARAM_REQ,
  IDEVICE_MAPID_GET_CONSUMABLES_PARAM_RSP,
  IDEVICE_MAPID_GET_GLOBAL_INFO_REQ,
  IDEVICE_MAPID_INTO_MODEIDLE_INFO_REQ,
  IDEVICE_MAPID_INTO_MODEIDLE_INFO_RSP,
  IDEVICE_MAPID_PUSH_HAS_WAITING_BE_SAVED,
  IDEVICE_MAPID_SELECT_MAP_PLAN_REQ,
  IDEVICE_MAPID_SELECT_MAP_PLAN_RSP,
  IDEVICE_MAPID_SET_AREA_CLEAN_INFO_REQ,
  IDEVICE_MAPID_SET_AREA_CLEAN_INFO_RSP,
  IDEVICE_MAPID_SET_AREA_RESTRICTED_INFO_REQ,
  IDEVICE_MAPID_SET_AREA_RESTRICTED_INFO_RSP,
  IDEVICE_MAPID_SET_ARRANGEROOM_INFO_REQ,
  IDEVICE_MAPID_SET_ARRANGEROOM_INFO_RSP,
  IDEVICE_MAPID_SET_CONSUMABLES_PARAM_REQ,
  IDEVICE_MAPID_SET_CONSUMABLES_PARAM_RSP,
  IDEVICE_MAPID_SET_HISTORY_MAP_ENABLE_REQ,
  IDEVICE_MAPID_SET_HISTORY_MAP_ENABLE_RSP,
  IDEVICE_MAPID_SET_NAVIGATION_REQ,
  IDEVICE_MAPID_SET_NAVIGATION_RSP,
  IDEVICE_MAPID_SET_PLAN_PARAMS_REQ,
  IDEVICE_MAPID_SET_PLAN_PARAMS_RSP,
  IDEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_REQ,
  IDEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_RSP,
  IDEVICE_MAPID_WORK_STATUS_PUSH_REQ,
  IDEVICE_MOP_FLOOR_CLEAN_REQ,
  IDEVICE_MOP_FLOOR_CLEAN_RSP,
  IDEVICE_ORDERLIST_DELETE_REQ,
  IDEVICE_ORDERLIST_DELETE_RSP,
  IDEVICE_ORDERLIST_GETTING_REQ,
  IDEVICE_ORDERLIST_GETTING_RSP,
  IDEVICE_ORDERLIST_SETTING_REQ,
  IDEVICE_ORDERLIST_SETTING_RSP,
  IDEVICE_REGISTER_REQ,
  IDEVICE_REGISTER_RSP,
  IDEVICE_SEEK_LOCATION_REQ,
  IDEVICE_SEEK_LOCATION_RSP,
  IDEVICE_SETTIME_REQ,
  IDEVICE_SETTIME_RSP,
  IDEVICE_SET_CLEAN_PREFERENCE_REQ,
  IDEVICE_SET_CLEAN_PREFERENCE_RSP,
  IDEVICE_STATUS_GETTING_REQ,
  IDEVICE_TIME_SYNC_RSP,
  IDEVICE_VERSION_INFO_UPDATE_REQ,
  IDEVICE_VERSION_INFO_UPDATE_RSP,
  IDEVICE_WITHROOMS_CLEAN_REQ,
  IDEVICE_WITHROOMS_CLEAN_RSP,
  IDEVICE_WLAN_INFO_GETTING_REQ,
  IDEVICE_WLAN_INFO_GETTING_RSP,
  IDEVICE_WORKSTATUS_REPORT_REQ,
  IDEVICE_WORKSTATUS_REPORT_RSP,
  IPUSH_DEVICE_AGENT_SETTING_REQ,
  IPUSH_DEVICE_AGENT_SETTING_RSP,
  IPUSH_DEVICE_BATTERY_INFO_REQ,
  IPUSH_DEVICE_BATTERY_INFO_RSP,
  IPUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ,
  IPUSH_DEVICE_PACKAGE_UPGRADE_INFO_RSP,
  IUNK_0044,
  IUNK_11A4,
  IUNK_11A7,
  IUSER_GET_DEVICE_QUIETHOURS_REQ,
  IUSER_GET_DEVICE_QUIETHOURS_RSP,
  IUSER_SET_DEVICE_CLEANPREFERENCE_REQ,
  IUSER_SET_DEVICE_CLEANPREFERENCE_RSP,
  IUSER_SET_DEVICE_CTRL_SETTING_REQ,
  IUSER_SET_DEVICE_CTRL_SETTING_RSP,
  IUSER_SET_DEVICE_QUIETHOURS_REQ,
  IUSER_SET_DEVICE_QUIETHOURS_RSP,
} from '@agnoc/schemas-tcp';

interface PayloadObjectMap {
  CLIENT_HEARTBEAT_REQ: ICLIENT_HEARTBEAT_REQ;
  CLIENT_HEARTBEAT_RSP: ICLIENT_HEARTBEAT_RSP;
  CLIENT_IDLE_TIMEOUT: ICLIENT_IDLE_TIMEOUT;
  CLIENT_ONLINE_REQ: ICLIENT_ONLINE_REQ;
  CLIENT_ONLINE_RSP: ICLIENT_ONLINE_RSP;
  COMMON_ERROR_REPLY: ICOMMON_ERROR_REPLY;
  DEVICE_AREA_CLEAN_REQ: IDEVICE_AREA_CLEAN_REQ;
  DEVICE_AREA_CLEAN_RSP: IDEVICE_AREA_CLEAN_RSP;
  DEVICE_AUTO_CLEAN_REQ: IDEVICE_AUTO_CLEAN_REQ;
  DEVICE_AUTO_CLEAN_RSP: IDEVICE_AUTO_CLEAN_RSP;
  DEVICE_CHARGE_REQ: IDEVICE_CHARGE_REQ;
  DEVICE_CHARGE_RSP: IDEVICE_CHARGE_RSP;
  DEVICE_CLEANMAP_BINDATA_REPORT_REQ: IDEVICE_CLEANMAP_BINDATA_REPORT_REQ;
  DEVICE_CLEANMAP_BINDATA_REPORT_RSP: IDEVICE_CLEANMAP_BINDATA_REPORT_RSP;
  DEVICE_CONTROL_LOCK_REQ: IDEVICE_CONTROL_LOCK_REQ;
  DEVICE_CONTROL_LOCK_RSP: IDEVICE_CONTROL_LOCK_RSP;
  DEVICE_EVENT_REPORT_CLEANMAP: IDEVICE_EVENT_REPORT_CLEANMAP;
  DEVICE_EVENT_REPORT_CLEANTASK: IDEVICE_EVENT_REPORT_CLEANTASK;
  DEVICE_EVENT_REPORT_REQ: IDEVICE_EVENT_REPORT_REQ;
  DEVICE_EVENT_REPORT_RSP: IDEVICE_EVENT_REPORT_RSP;
  DEVICE_GETTIME_REQ: IDEVICE_GETTIME_REQ;
  DEVICE_GETTIME_RSP: IDEVICE_GETTIME_RSP;
  DEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ: IDEVICE_GET_ALL_GLOBAL_MAP_INFO_REQ;
  DEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP: IDEVICE_GET_ALL_GLOBAL_MAP_INFO_RSP;
  DEVICE_MANUAL_CTRL_REQ: IDEVICE_MANUAL_CTRL_REQ;
  DEVICE_MANUAL_CTRL_RSP: IDEVICE_MANUAL_CTRL_RSP;
  DEVICE_MAPID_GET_CONSUMABLES_PARAM_REQ: IDEVICE_MAPID_GET_CONSUMABLES_PARAM_REQ;
  DEVICE_MAPID_GET_CONSUMABLES_PARAM_RSP: IDEVICE_MAPID_GET_CONSUMABLES_PARAM_RSP;
  DEVICE_MAPID_GET_GLOBAL_INFO_REQ: IDEVICE_MAPID_GET_GLOBAL_INFO_REQ;
  DEVICE_MAPID_GET_GLOBAL_INFO_RSP: MapInfo;
  DEVICE_MAPID_INTO_MODEIDLE_INFO_REQ: IDEVICE_MAPID_INTO_MODEIDLE_INFO_REQ;
  DEVICE_MAPID_INTO_MODEIDLE_INFO_RSP: IDEVICE_MAPID_INTO_MODEIDLE_INFO_RSP;
  DEVICE_MAPID_PUSH_ALL_MEMORY_MAP_INFO: AreaListInfo;
  DEVICE_MAPID_PUSH_CHARGE_POSITION_INFO: ChargePoseInfo;
  DEVICE_MAPID_PUSH_HAS_WAITING_BE_SAVED: IDEVICE_MAPID_PUSH_HAS_WAITING_BE_SAVED;
  DEVICE_MAPID_PUSH_MAP_INFO: MapInfo;
  DEVICE_MAPID_PUSH_POSITION_INFO: RobotPoseInfo;
  DEVICE_MAPID_SELECT_MAP_PLAN_REQ: IDEVICE_MAPID_SELECT_MAP_PLAN_REQ;
  DEVICE_MAPID_SELECT_MAP_PLAN_RSP: IDEVICE_MAPID_SELECT_MAP_PLAN_RSP;
  DEVICE_MAPID_SET_AREA_CLEAN_INFO_REQ: IDEVICE_MAPID_SET_AREA_CLEAN_INFO_REQ;
  DEVICE_MAPID_SET_AREA_CLEAN_INFO_RSP: IDEVICE_MAPID_SET_AREA_CLEAN_INFO_RSP;
  DEVICE_MAPID_SET_AREA_RESTRICTED_INFO_REQ: IDEVICE_MAPID_SET_AREA_RESTRICTED_INFO_REQ;
  DEVICE_MAPID_SET_AREA_RESTRICTED_INFO_RSP: IDEVICE_MAPID_SET_AREA_RESTRICTED_INFO_RSP;
  DEVICE_MAPID_SET_ARRANGEROOM_INFO_REQ: IDEVICE_MAPID_SET_ARRANGEROOM_INFO_REQ;
  DEVICE_MAPID_SET_ARRANGEROOM_INFO_RSP: IDEVICE_MAPID_SET_ARRANGEROOM_INFO_RSP;
  DEVICE_MAPID_SET_CONSUMABLES_PARAM_REQ: IDEVICE_MAPID_SET_CONSUMABLES_PARAM_REQ;
  DEVICE_MAPID_SET_CONSUMABLES_PARAM_RSP: IDEVICE_MAPID_SET_CONSUMABLES_PARAM_RSP;
  DEVICE_MAPID_SET_HISTORY_MAP_ENABLE_REQ: IDEVICE_MAPID_SET_HISTORY_MAP_ENABLE_REQ;
  DEVICE_MAPID_SET_HISTORY_MAP_ENABLE_RSP: IDEVICE_MAPID_SET_HISTORY_MAP_ENABLE_RSP;
  DEVICE_MAPID_SET_NAVIGATION_REQ: IDEVICE_MAPID_SET_NAVIGATION_REQ;
  DEVICE_MAPID_SET_NAVIGATION_RSP: IDEVICE_MAPID_SET_NAVIGATION_RSP;
  DEVICE_MAPID_SET_PLAN_PARAMS_REQ: IDEVICE_MAPID_SET_PLAN_PARAMS_REQ;
  DEVICE_MAPID_SET_PLAN_PARAMS_RSP: IDEVICE_MAPID_SET_PLAN_PARAMS_RSP;
  DEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_REQ: IDEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_REQ;
  DEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_RSP: IDEVICE_MAPID_SET_SAVEWAITINGMAP_INFO_RSP;
  DEVICE_MAPID_WORK_STATUS_PUSH_REQ: IDEVICE_MAPID_WORK_STATUS_PUSH_REQ;
  DEVICE_MOP_FLOOR_CLEAN_REQ: IDEVICE_MOP_FLOOR_CLEAN_REQ;
  DEVICE_MOP_FLOOR_CLEAN_RSP: IDEVICE_MOP_FLOOR_CLEAN_RSP;
  DEVICE_ORDERLIST_DELETE_REQ: IDEVICE_ORDERLIST_DELETE_REQ;
  DEVICE_ORDERLIST_DELETE_RSP: IDEVICE_ORDERLIST_DELETE_RSP;
  DEVICE_ORDERLIST_GETTING_REQ: IDEVICE_ORDERLIST_GETTING_REQ;
  DEVICE_ORDERLIST_GETTING_RSP: IDEVICE_ORDERLIST_GETTING_RSP;
  DEVICE_ORDERLIST_SETTING_REQ: IDEVICE_ORDERLIST_SETTING_REQ;
  DEVICE_ORDERLIST_SETTING_RSP: IDEVICE_ORDERLIST_SETTING_RSP;
  DEVICE_REGISTER_REQ: IDEVICE_REGISTER_REQ;
  DEVICE_REGISTER_RSP: IDEVICE_REGISTER_RSP;
  DEVICE_SEEK_LOCATION_REQ: IDEVICE_SEEK_LOCATION_REQ;
  DEVICE_SEEK_LOCATION_RSP: IDEVICE_SEEK_LOCATION_RSP;
  DEVICE_SETTIME_REQ: IDEVICE_SETTIME_REQ;
  DEVICE_SETTIME_RSP: IDEVICE_SETTIME_RSP;
  DEVICE_SET_CLEAN_PREFERENCE_REQ: IDEVICE_SET_CLEAN_PREFERENCE_REQ;
  DEVICE_SET_CLEAN_PREFERENCE_RSP: IDEVICE_SET_CLEAN_PREFERENCE_RSP;
  DEVICE_STATUS_GETTING_REQ: IDEVICE_STATUS_GETTING_REQ;
  DEVICE_TIME_SYNC_RSP: IDEVICE_TIME_SYNC_RSP;
  DEVICE_VERSION_INFO_UPDATE_REQ: IDEVICE_VERSION_INFO_UPDATE_REQ;
  DEVICE_VERSION_INFO_UPDATE_RSP: IDEVICE_VERSION_INFO_UPDATE_RSP;
  DEVICE_WITHROOMS_CLEAN_REQ: IDEVICE_WITHROOMS_CLEAN_REQ;
  DEVICE_WITHROOMS_CLEAN_RSP: IDEVICE_WITHROOMS_CLEAN_RSP;
  DEVICE_WLAN_INFO_GETTING_REQ: IDEVICE_WLAN_INFO_GETTING_REQ;
  DEVICE_WLAN_INFO_GETTING_RSP: IDEVICE_WLAN_INFO_GETTING_RSP;
  DEVICE_WORKSTATUS_REPORT_REQ: IDEVICE_WORKSTATUS_REPORT_REQ;
  DEVICE_WORKSTATUS_REPORT_RSP: IDEVICE_WORKSTATUS_REPORT_RSP;
  PUSH_DEVICE_AGENT_SETTING_REQ: IPUSH_DEVICE_AGENT_SETTING_REQ;
  PUSH_DEVICE_AGENT_SETTING_RSP: IPUSH_DEVICE_AGENT_SETTING_RSP;
  PUSH_DEVICE_BATTERY_INFO_REQ: IPUSH_DEVICE_BATTERY_INFO_REQ;
  PUSH_DEVICE_BATTERY_INFO_RSP: IPUSH_DEVICE_BATTERY_INFO_RSP;
  PUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ: IPUSH_DEVICE_PACKAGE_UPGRADE_INFO_REQ;
  PUSH_DEVICE_PACKAGE_UPGRADE_INFO_RSP: IPUSH_DEVICE_PACKAGE_UPGRADE_INFO_RSP;
  UNK_0044: IUNK_0044;
  UNK_11A4: IUNK_11A4;
  UNK_11A7: IUNK_11A7;
  USER_GET_DEVICE_QUIETHOURS_REQ: IUSER_GET_DEVICE_QUIETHOURS_REQ;
  USER_GET_DEVICE_QUIETHOURS_RSP: IUSER_GET_DEVICE_QUIETHOURS_RSP;
  USER_SET_DEVICE_CLEANPREFERENCE_REQ: IUSER_SET_DEVICE_CLEANPREFERENCE_REQ;
  USER_SET_DEVICE_CLEANPREFERENCE_RSP: IUSER_SET_DEVICE_CLEANPREFERENCE_RSP;
  USER_SET_DEVICE_CTRL_SETTING_REQ: IUSER_SET_DEVICE_CTRL_SETTING_REQ;
  USER_SET_DEVICE_CTRL_SETTING_RSP: IUSER_SET_DEVICE_CTRL_SETTING_RSP;
  USER_SET_DEVICE_QUIETHOURS_REQ: IUSER_SET_DEVICE_QUIETHOURS_REQ;
  USER_SET_DEVICE_QUIETHOURS_RSP: IUSER_SET_DEVICE_QUIETHOURS_RSP;
}

export type PayloadObject = PayloadObjectMap[PayloadObjectName];
export type PayloadObjectName = keyof PayloadObjectMap & OPNameLiteral;
export type PayloadObjectFrom<Name extends PayloadObjectName> = PayloadObjectMap[Name];
