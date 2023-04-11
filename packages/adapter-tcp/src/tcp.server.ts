import { EventHandlerRegistry, WaiterService } from '@agnoc/toolkit';
import {
  getCustomDecoders,
  getProtobufRoot,
  PacketMapper,
  PacketServer,
  PayloadMapper,
  PayloadDataParserService,
  PacketFactory,
} from '@agnoc/transport-tcp';
import { CleanSpotCommandHandler } from './command-handlers/clean-spot.command-handler';
import { CleanZonesCommandHandler } from './command-handlers/clean-zones.command-handler';
import { LocateDeviceCommandHandler } from './command-handlers/locate-device.command-handler';
import { PauseCleaningCommandHandler } from './command-handlers/pause-cleaning.command-handler';
import { ResetConsumableCommandHandler } from './command-handlers/reset-consumable.command-handler';
import { ReturnHomeCommandHandler } from './command-handlers/return-home.command-handler';
import { SetCarpetModeCommandHandler } from './command-handlers/set-carpet-mode.command-handler';
import { SetDeviceModeCommandHandler } from './command-handlers/set-device-mode.command-handler';
import { SetDeviceQuietHoursCommandHandler } from './command-handlers/set-device-quiet-hours.command-handler';
import { SetDeviceVoiceCommandHandler } from './command-handlers/set-device-voice.command-handler';
import { SetFanSpeedCommandHandler } from './command-handlers/set-fan-speed.command-handler';
import { SetWaterLevelCommandHandler } from './command-handlers/set-water-level.command-handler';
import { StartCleaningCommandHandler } from './command-handlers/start-cleaning.command-handler';
import { StopCleaningCommandHandler } from './command-handlers/stop-cleaning.command-handler';
import { NTPServerConnectionHandler } from './connection-handlers/ntp-server.connection-handler';
import { PackerServerConnectionHandler } from './connection-handlers/packet-server.connection-handler';
import { LockDeviceWhenDeviceIsConnectedEventHandler } from './domain-event-handlers/lock-device-when-device-is-connected-event-handler.event-handler';
import { QueryDeviceInfoWhenDeviceIsLockedEventHandler } from './domain-event-handlers/query-device-info-when-device-is-locked-event-handler.event-handler';
import { SetDeviceAsConnectedWhenConnectionDeviceAddedEventHandler } from './domain-event-handlers/set-device-connected-when-connection-device-changed.event-handler';
import { PacketEventBus } from './event-buses/packet.event-bus';
import { PacketConnectionFactory } from './factories/connection.factory';
import { CleanModeMapper } from './mappers/clean-mode.mapper';
import { DeviceBatteryMapper } from './mappers/device-battery.mapper';
import { DeviceErrorMapper } from './mappers/device-error.mapper';
import { DeviceFanSpeedMapper } from './mappers/device-fan-speed.mapper';
import { DeviceModeMapper } from './mappers/device-mode.mapper';
import { DeviceOrderMapper } from './mappers/device-order.mapper';
import { DeviceStateMapper } from './mappers/device-state.mapper';
import { DeviceWaterLevelMapper } from './mappers/device-water-level.mapper';
import { VoiceSettingMapper } from './mappers/voice-setting.mapper';
import { WeekDayListMapper } from './mappers/week-day-list.mapper';
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
import { DeviceNetworkUpdateEventHandler } from './packet-event-handlers/device-network-update.event-handler';
import { DeviceOfflineEventHandler } from './packet-event-handlers/device-offline.event-handler';
import { DeviceOrderListUpdateEventHandler } from './packet-event-handlers/device-order-list-update.event-handler';
import { DeviceRegisterEventHandler } from './packet-event-handlers/device-register.event-handler';
import { DeviceSettingsUpdateEventHandler } from './packet-event-handlers/device-settings-update.event-handler';
import { DeviceTimeUpdateEventHandler } from './packet-event-handlers/device-time-update.event-handler';
import { DeviceUpgradeInfoEventHandler } from './packet-event-handlers/device-upgrade-info.event-handler';
import { DeviceVersionUpdateEventHandler } from './packet-event-handlers/device-version-update.event-handler';
import { GetDeviceConsumablesQueryHandler } from './query-handlers/get-device-consumables.query-handler';
import { ConnectionDeviceUpdaterService } from './services/connection-device-updater.service';
import { DeviceCleaningService } from './services/device-cleaning.service';
import { DeviceMapService } from './services/device-map.service';
import { DeviceModeChangerService } from './services/device-mode-changer.service';
import { PacketConnectionFinderService } from './services/packet-connection-finder.service';
import { PacketEventPublisherService } from './services/packet-event-publisher.service';
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
    const voiceSettingMapper = new VoiceSettingMapper();
    const deviceStateMapper = new DeviceStateMapper();
    const deviceModeMapper = new DeviceModeMapper();
    const deviceErrorMapper = new DeviceErrorMapper();
    const deviceBatteryMapper = new DeviceBatteryMapper();
    const cleanModeMapper = new CleanModeMapper();
    const weekDayListMapper = new WeekDayListMapper();
    const deviceOrderMapper = new DeviceOrderMapper(
      deviceFanSpeedMapper,
      deviceWaterLevelMapper,
      cleanModeMapper,
      weekDayListMapper,
    );

    // Packet event bus
    const packetEventBus = new PacketEventBus();
    const packetEventHandlerRegistry = new EventHandlerRegistry(packetEventBus);

    // Services
    const waiterService = new WaiterService();
    const connectionDeviceUpdaterService = new ConnectionDeviceUpdaterService(
      this.connectionRepository,
      deviceRepository,
    );
    const packetEventPublisherService = new PacketEventPublisherService(packetEventBus);
    const packetConnectionFinderService = new PacketConnectionFinderService(this.connectionRepository);
    const deviceModeChangerService = new DeviceModeChangerService(waiterService);
    const deviceCleaningService = new DeviceCleaningService();
    const deviceMapService = new DeviceMapService();

    // Connection
    const packetConnectionFactory = new PacketConnectionFactory(packetEventBus, packetFactory);
    const connectionManager = new PackerServerConnectionHandler(
      this.connectionRepository,
      packetConnectionFactory,
      connectionDeviceUpdaterService,
      packetEventPublisherService,
    );

    connectionManager.register(this.cmdServer, this.mapServer);

    // Time Sync server controller
    const ntpServerConnectionHandler = new NTPServerConnectionHandler(packetFactory);

    ntpServerConnectionHandler.register(this.ntpServer);

    // Packet event handlers
    packetEventHandlerRegistry.register(
      new ClientHeartbeatEventHandler(),
      new ClientLoginEventHandler(),
      new DeviceBatteryUpdateEventHandler(deviceBatteryMapper, this.deviceRepository),
      new DeviceCleanMapDataReportEventHandler(),
      new DeviceCleanMapReportEventHandler(),
      new DeviceCleanTaskReportEventHandler(),
      new DeviceGetAllGlobalMapEventHandler(),
      new DeviceLocatedEventHandler(),
      new DeviceLockedEventHandler(this.deviceRepository),
      new DeviceMapChargerPositionUpdateEventHandler(this.deviceRepository),
      new DeviceMapWorkStatusUpdateEventHandler(
        deviceStateMapper,
        deviceModeMapper,
        deviceErrorMapper,
        deviceBatteryMapper,
        deviceFanSpeedMapper,
        deviceWaterLevelMapper,
        this.deviceRepository,
      ),
      new DeviceMemoryMapInfoEventHandler(),
      new DeviceOfflineEventHandler(),
      new DeviceOrderListUpdateEventHandler(deviceOrderMapper, this.deviceRepository),
      new DeviceRegisterEventHandler(this.deviceRepository),
      new DeviceSettingsUpdateEventHandler(voiceSettingMapper, this.deviceRepository),
      new DeviceTimeUpdateEventHandler(),
      new DeviceUpgradeInfoEventHandler(),
      new DeviceVersionUpdateEventHandler(this.deviceRepository),
      new DeviceNetworkUpdateEventHandler(this.deviceRepository),
      new DeviceMapUpdateEventHandler(
        deviceBatteryMapper,
        deviceModeMapper,
        deviceStateMapper,
        deviceErrorMapper,
        deviceFanSpeedMapper,
        this.deviceRepository,
      ),
    );

    // Domain event handlers
    this.domainEventHandlerRegistry.register(
      new LockDeviceWhenDeviceIsConnectedEventHandler(packetConnectionFinderService),
      new QueryDeviceInfoWhenDeviceIsLockedEventHandler(packetConnectionFinderService),
      new SetDeviceAsConnectedWhenConnectionDeviceAddedEventHandler(this.connectionRepository, this.deviceRepository),
    );

    // Command event handlers
    this.commandQueryHandlerRegistry.register(
      new CleanSpotCommandHandler(packetConnectionFinderService, deviceModeChangerService, deviceCleaningService),
      new CleanZonesCommandHandler(
        packetConnectionFinderService,
        deviceModeChangerService,
        deviceMapService,
        deviceCleaningService,
      ),
      new GetDeviceConsumablesQueryHandler(packetConnectionFinderService, this.deviceRepository),
      new LocateDeviceCommandHandler(packetConnectionFinderService),
      new PauseCleaningCommandHandler(packetConnectionFinderService, deviceCleaningService),
      new ResetConsumableCommandHandler(packetConnectionFinderService, this.deviceRepository),
      new ReturnHomeCommandHandler(packetConnectionFinderService),
      new SetCarpetModeCommandHandler(packetConnectionFinderService, this.deviceRepository),
      new SetDeviceModeCommandHandler(packetConnectionFinderService, deviceModeChangerService),
      new SetDeviceQuietHoursCommandHandler(packetConnectionFinderService),
      new SetDeviceVoiceCommandHandler(packetConnectionFinderService, voiceSettingMapper, this.deviceRepository),
      new SetFanSpeedCommandHandler(packetConnectionFinderService, deviceFanSpeedMapper, this.deviceRepository),
      new SetWaterLevelCommandHandler(packetConnectionFinderService, deviceWaterLevelMapper, this.deviceRepository),
      new StartCleaningCommandHandler(
        packetConnectionFinderService,
        deviceModeChangerService,
        deviceCleaningService,
        deviceMapService,
      ),
      new StopCleaningCommandHandler(packetConnectionFinderService, deviceCleaningService),
    );
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
