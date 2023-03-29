import { DeviceModeValue } from '@agnoc/domain';
import { DomainException } from '@agnoc/toolkit';
import { ModeCtrlValue } from '../services/device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { CommandHandler, PauseCleaningCommand, ConnectionWithDevice } from '@agnoc/domain';

export class PauseCleaningCommandHandler implements CommandHandler {
  readonly forName = 'PauseCleaningCommand';

  constructor(private readonly packetConnectionFinderService: PacketConnectionFinderService) {}

  async handle(event: PauseCleaningCommand): Promise<void> {
    const connection = await this.packetConnectionFinderService.findByDeviceId(event.deviceId);

    if (!connection) {
      return;
    }

    const device = connection.device;
    const deviceModeValue = device.mode?.value;

    if (deviceModeValue === DeviceModeValue.Zone) {
      return this.pauseZoneCleaning(connection);
    }

    if (deviceModeValue === DeviceModeValue.Mop) {
      return this.pauseMopCleaning(connection);
    }

    if (deviceModeValue === DeviceModeValue.Spot) {
      return this.pauseSpotCleaning(connection);
    }

    return this.pauseAutoCleaning(connection);
  }

  private async pauseZoneCleaning(connection: PacketConnection & ConnectionWithDevice) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_AREA_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Pause,
    });

    response.assertPayloadName('DEVICE_AREA_CLEAN_RSP');
  }

  private async pauseSpotCleaning(connection: PacketConnection & ConnectionWithDevice) {
    if (!connection.device.map) {
      throw new DomainException('Unable to pause spot cleaning, no map available');
    }

    if (!connection.device.map.currentSpot) {
      throw new DomainException('Unable to pause spot cleaning, no spot selected');
    }

    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_SET_NAVIGATION_REQ', {
      mapHeadId: connection.device.map.id.value,
      poseX: connection.device.map.currentSpot.x,
      poseY: connection.device.map.currentSpot.y,
      posePhi: connection.device.map.currentSpot.phi,
      ctrlValue: ModeCtrlValue.Pause,
    });

    response.assertPayloadName('DEVICE_MAPID_SET_NAVIGATION_RSP');
  }

  private async pauseMopCleaning(connection: PacketConnection & ConnectionWithDevice) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MOP_FLOOR_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Pause,
    });

    response.assertPayloadName('DEVICE_MOP_FLOOR_CLEAN_RSP');
  }

  private async pauseAutoCleaning(connection: PacketConnection & ConnectionWithDevice) {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Pause,
      cleanType: 2,
    });

    response.assertPayloadName('DEVICE_AUTO_CLEAN_RSP');
  }
}
