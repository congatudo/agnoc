import { EventHandlerRegistry } from '@agnoc/toolkit';
import {
  getCustomDecoders,
  getProtobufRoot,
  PacketMapper,
  PacketServer,
  PayloadMapper,
  PayloadObjectParserService,
  PacketFactory,
} from '@agnoc/transport-tcp';
import { ConnectionManager } from './connection.manager';
import { LocateDeviceEventHandler } from './event-handlers/command-event-handlers/locate-device.event-handler';
import { LockDeviceWhenDeviceIsConnectedEventHandler } from './event-handlers/domain-event-handlers/lock-device-when-device-is-connected-event-handler.event-handler';
import { QueryDeviceInfoWhenDeviceIsLockedEventHandler } from './event-handlers/domain-event-handlers/query-device-info-when-device-is-locked-event-handler.event-handler';
import { ClientHeartbeatEventHandler } from './event-handlers/packet-event-handlers/client-heartbeat.event-handler';
import { ClientLoginEventHandler } from './event-handlers/packet-event-handlers/client-login.event-handler';
import { DeviceBatteryUpdateEventHandler } from './event-handlers/packet-event-handlers/device-battery-update.event-handler';
import { DeviceCleanMapDataReportEventHandler } from './event-handlers/packet-event-handlers/device-clean-map-data-report.event-handler';
import { DeviceCleanMapReportEventHandler } from './event-handlers/packet-event-handlers/device-clean-map-report.event-handler';
import { DeviceCleanTaskReportEventHandler } from './event-handlers/packet-event-handlers/device-clean-task-report.event-handler';
import { DeviceGetAllGlobalMapEventHandler } from './event-handlers/packet-event-handlers/device-get-all-global-map.event-handler';
import { DeviceLocatedEventHandler } from './event-handlers/packet-event-handlers/device-located.event-handler';
import { DeviceLockedEventHandler } from './event-handlers/packet-event-handlers/device-locked.event-handler';
import { DeviceMapChargerPositionUpdateEventHandler } from './event-handlers/packet-event-handlers/device-map-charger-position-update.event-handler';
import { DeviceMapUpdateEventHandler } from './event-handlers/packet-event-handlers/device-map-update.event-handler';
import { DeviceMapWorkStatusUpdateEventHandler } from './event-handlers/packet-event-handlers/device-map-work-status-update.event-handler';
import { DeviceMemoryMapInfoEventHandler } from './event-handlers/packet-event-handlers/device-memory-map-info.event-handler';
import { DeviceOfflineEventHandler } from './event-handlers/packet-event-handlers/device-offline.event-handler';
import { DeviceRegisterEventHandler } from './event-handlers/packet-event-handlers/device-register.event-handler';
import { DeviceSettingsUpdateEventHandler } from './event-handlers/packet-event-handlers/device-settings-update.event-handler';
import { DeviceTimeUpdateEventHandler } from './event-handlers/packet-event-handlers/device-time-update.event-handler';
import { DeviceUpgradeInfoEventHandler } from './event-handlers/packet-event-handlers/device-upgrade-info.event-handler';
import { DeviceVersionUpdateEventHandler } from './event-handlers/packet-event-handlers/device-version-update.event-handler';
import { DeviceWlanUpdateEventHandler } from './event-handlers/packet-event-handlers/device-wlan-update.event-handler';
import { DeviceBatteryMapper } from './mappers/device-battery.mapper';
import { DeviceErrorMapper } from './mappers/device-error.mapper';
import { DeviceFanSpeedMapper } from './mappers/device-fan-speed.mapper';
import { DeviceModeMapper } from './mappers/device-mode.mapper';
import { DeviceStateMapper } from './mappers/device-state.mapper';
import { DeviceVoiceMapper } from './mappers/device-voice.mapper';
import { DeviceWaterLevelMapper } from './mappers/device-water-level.mapper';
import { PacketEventBus } from './packet.event-bus';
import { TimeSyncServer } from './time-sync.server';
import type { DeviceRepository } from '@agnoc/domain';

export class TCPAdapter {
  private readonly timeSyncServer: TimeSyncServer;
  private readonly cmdServer: PacketServer;
  private readonly mapServer: PacketServer;

  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly domainEventHandlerRegistry: EventHandlerRegistry,
    private readonly commandEventHandlerRegistry: EventHandlerRegistry,
  ) {
    // Packet foundation
    const payloadMapper = new PayloadMapper(new PayloadObjectParserService(getProtobufRoot(), getCustomDecoders()));
    const packetMapper = new PacketMapper(payloadMapper);
    const packetFactory = new PacketFactory();

    // Servers
    this.timeSyncServer = new TimeSyncServer(new PacketServer(packetMapper), packetFactory);
    this.cmdServer = new PacketServer(packetMapper);
    this.mapServer = new PacketServer(packetMapper);

    // Mappers
    const deviceFanSpeedMapper = new DeviceFanSpeedMapper();
    const deviceWaterLevelMapper = new DeviceWaterLevelMapper();
    const deviceVoiceMapper = new DeviceVoiceMapper();
    const deviceStateMapper = new DeviceStateMapper();
    const deviceModeMapper = new DeviceModeMapper();
    const deviceErrorMapper = new DeviceErrorMapper();
    const deviceBatteryMapper = new DeviceBatteryMapper();

    // Packet event bus
    const packetEventBus = new PacketEventBus();
    const packetEventHandlerRegistry = new EventHandlerRegistry(packetEventBus);

    // Connection managers
    const connectionManager = new ConnectionManager(packetEventBus, packetFactory, this.deviceRepository);

    connectionManager.addServers(this.cmdServer, this.mapServer);

    // Packet event handlers
    packetEventHandlerRegistry.register(
      new ClientHeartbeatEventHandler(),
      new ClientLoginEventHandler(),
      new DeviceBatteryUpdateEventHandler(deviceBatteryMapper),
      new DeviceCleanMapDataReportEventHandler(),
      new DeviceCleanMapReportEventHandler(),
      new DeviceCleanTaskReportEventHandler(),
      new DeviceGetAllGlobalMapEventHandler(),
      new DeviceLocatedEventHandler(),
      new DeviceLockedEventHandler(this.deviceRepository),
      new DeviceMapChargerPositionUpdateEventHandler(),
      new DeviceMapWorkStatusUpdateEventHandler(
        deviceStateMapper,
        deviceModeMapper,
        deviceErrorMapper,
        deviceBatteryMapper,
        deviceFanSpeedMapper,
        deviceWaterLevelMapper,
      ),
      new DeviceMemoryMapInfoEventHandler(),
      new DeviceOfflineEventHandler(),
      new DeviceRegisterEventHandler(this.deviceRepository),
      new DeviceSettingsUpdateEventHandler(deviceVoiceMapper),
      new DeviceTimeUpdateEventHandler(),
      new DeviceUpgradeInfoEventHandler(),
      new DeviceVersionUpdateEventHandler(),
      new DeviceWlanUpdateEventHandler(),
      new DeviceMapUpdateEventHandler(
        deviceBatteryMapper,
        deviceModeMapper,
        deviceStateMapper,
        deviceErrorMapper,
        deviceFanSpeedMapper,
      ),
    );

    // Domain event handlers
    this.domainEventHandlerRegistry.register(
      new LockDeviceWhenDeviceIsConnectedEventHandler(connectionManager),
      new QueryDeviceInfoWhenDeviceIsLockedEventHandler(connectionManager),
    );

    // Command event handlers
    this.commandEventHandlerRegistry.register(new LocateDeviceEventHandler(connectionManager));
  }

  async start(): Promise<void> {
    await Promise.all([this.cmdServer.listen(4010), this.mapServer.listen(4030), this.timeSyncServer.listen()]);
  }

  async stop(): Promise<void> {
    await Promise.all([this.cmdServer.close(), this.mapServer.close(), this.timeSyncServer.close()]);
  }
}
