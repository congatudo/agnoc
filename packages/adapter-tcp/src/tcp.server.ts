import { EventHandlerRegistry } from '@agnoc/toolkit';
import {
  getCustomDecoders,
  getProtobufRoot,
  PacketMapper,
  PacketServer,
  PayloadMapper,
  PayloadDataParserService,
  PacketFactory,
} from '@agnoc/transport-tcp';
import { LocateDeviceEventHandler } from './command-handlers/locate-device.event-handler';
import { LockDeviceWhenDeviceIsConnectedEventHandler } from './domain-event-handlers/lock-device-when-device-is-connected-event-handler.event-handler';
import { QueryDeviceInfoWhenDeviceIsLockedEventHandler } from './domain-event-handlers/query-device-info-when-device-is-locked-event-handler.event-handler';
import { SetDeviceAsConnectedWhenConnectionDeviceAddedDomainEventHandler } from './domain-event-handlers/set-device-connected-when-connection-device-changed.domain-event';
import { PacketConnectionFactory } from './factories/connection.factory';
import { DeviceBatteryMapper } from './mappers/device-battery.mapper';
import { DeviceErrorMapper } from './mappers/device-error.mapper';
import { DeviceFanSpeedMapper } from './mappers/device-fan-speed.mapper';
import { DeviceModeMapper } from './mappers/device-mode.mapper';
import { DeviceStateMapper } from './mappers/device-state.mapper';
import { DeviceVoiceMapper } from './mappers/device-voice.mapper';
import { DeviceWaterLevelMapper } from './mappers/device-water-level.mapper';
import { NTPServerConnectionHandler } from './ntp-server.connection-handler';
import { ClientHeartbeatEventHandler } from './packet-event-handlers/client-heartbeat.event-handler';
import { ClientLoginEventHandler } from './packet-event-handlers/client-login.event-handler';
import { DeviceBatteryUpdateEventHandler } from './packet-event-handlers/device-battery-update.event-handler';
import { DeviceCleanMapDataReportEventHandler } from './packet-event-handlers/device-clean-map-data-report.event-handler';
import { DeviceCleanMapReportEventHandler } from './packet-event-handlers/device-clean-map-report.event-handler';
import { DeviceCleanTaskReportEventHandler } from './packet-event-handlers/device-clean-task-report.event-handler';
import { DeviceGetAllGlobalMapEventHandler } from './packet-event-handlers/device-get-all-global-map.event-handler';
import { DeviceLocatedEventHandler } from './packet-event-handlers/device-located.event-handler';
import { DeviceLockedEventHandler } from './packet-event-handlers/device-locked.event-handler';
import { DeviceMapChargerPositionUpdateEventHandler } from './packet-event-handlers/device-map-charger-position-update.event-handler';
import { DeviceMapUpdateEventHandler } from './packet-event-handlers/device-map-update.event-handler';
import { DeviceMapWorkStatusUpdateEventHandler } from './packet-event-handlers/device-map-work-status-update.event-handler';
import { DeviceMemoryMapInfoEventHandler } from './packet-event-handlers/device-memory-map-info.event-handler';
import { DeviceOfflineEventHandler } from './packet-event-handlers/device-offline.event-handler';
import { DeviceRegisterEventHandler } from './packet-event-handlers/device-register.event-handler';
import { DeviceSettingsUpdateEventHandler } from './packet-event-handlers/device-settings-update.event-handler';
import { DeviceTimeUpdateEventHandler } from './packet-event-handlers/device-time-update.event-handler';
import { DeviceUpgradeInfoEventHandler } from './packet-event-handlers/device-upgrade-info.event-handler';
import { DeviceVersionUpdateEventHandler } from './packet-event-handlers/device-version-update.event-handler';
import { DeviceWlanUpdateEventHandler } from './packet-event-handlers/device-wlan-update.event-handler';
import { PackerServerConnectionHandler } from './packet-server.connection-handler';
import { PacketEventBus } from './packet.event-bus';
import type { CommandsOrQueries, ConnectionRepository, DeviceRepository } from '@agnoc/domain';
import type { Server, TaskHandlerRegistry } from '@agnoc/toolkit';
import type { AddressInfo } from 'net';

export class TCPServer implements Server {
  private readonly cmdServer: PacketServer;
  private readonly mapServer: PacketServer;
  private readonly ntpServer: PacketServer;

  constructor(
    private readonly deviceRepository: DeviceRepository,
    private readonly connectionRepository: ConnectionRepository,
    private readonly domainEventHandlerRegistry: EventHandlerRegistry,
    private readonly commandQueryHandlerRegistry: TaskHandlerRegistry<CommandsOrQueries>,
  ) {
    // Packet foundation
    const payloadMapper = new PayloadMapper(new PayloadDataParserService(getProtobufRoot(), getCustomDecoders()));
    const packetMapper = new PacketMapper(payloadMapper);
    const packetFactory = new PacketFactory();

    // Servers
    this.ntpServer = new PacketServer(packetMapper);
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

    // Connection
    const packetConnectionFactory = new PacketConnectionFactory(packetEventBus, packetFactory);
    const connectionManager = new PackerServerConnectionHandler(
      packetEventBus,
      this.deviceRepository,
      this.connectionRepository,
      packetConnectionFactory,
    );

    connectionManager.addServers(this.cmdServer, this.mapServer);

    // Time Sync server controller
    const ntpServerConnectionHandler = new NTPServerConnectionHandler(packetFactory);

    ntpServerConnectionHandler.register(this.ntpServer);

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
      new LockDeviceWhenDeviceIsConnectedEventHandler(connectionRepository),
      new QueryDeviceInfoWhenDeviceIsLockedEventHandler(connectionRepository),
      new SetDeviceAsConnectedWhenConnectionDeviceAddedDomainEventHandler(connectionRepository, deviceRepository),
    );

    // Command event handlers
    this.commandQueryHandlerRegistry.register(new LocateDeviceEventHandler(connectionRepository));
  }

  async listen(options: TCPAdapterListenOptions = listenDefaultOptions): Promise<TCPAdapterListenReturn> {
    const host = options.host;
    const ports = options.ports ?? listenDefaultOptions.ports;

    await Promise.all([
      this.cmdServer.listen({ host, port: ports.cmd }),
      this.mapServer.listen({ host, port: ports.map }),
      this.ntpServer.listen({ host, port: ports.ntp }),
    ]);

    return {
      ports: {
        cmd: (this.cmdServer.address as AddressInfo).port,
        map: (this.mapServer.address as AddressInfo).port,
        ntp: (this.ntpServer.address as AddressInfo).port,
      },
    };
  }

  async close(): Promise<void> {
    await Promise.all([this.cmdServer.close(), this.mapServer.close(), this.ntpServer.close()]);
  }
}

const listenDefaultOptions = { ports: { cmd: 4010, map: 4030, ntp: 4050 } } satisfies TCPAdapterListenOptions;

export interface TCPAdapterListenOptions {
  host?: string;
  ports?: ServerPorts;
}

interface TCPAdapterListenReturn {
  ports: ServerPorts;
}

export interface ServerPorts {
  cmd: number;
  map: number;
  ntp: number;
}
