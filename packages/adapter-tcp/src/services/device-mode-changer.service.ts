import { DeviceCapability, DeviceModeValue } from '@agnoc/domain';
import { ArgumentInvalidException, DomainException } from '@agnoc/toolkit';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { DeviceMode, ConnectionWithDevice } from '@agnoc/domain';
import type { WaiterService } from '@agnoc/toolkit';

const MODE_CHANGE_TIMEOUT = 5000;

export enum ModeCtrlValue {
  Stop = 0,
  Start = 1,
  Pause = 2,
}

export class DeviceModeChangerService {
  constructor(private readonly waiterService: WaiterService) {}

  async changeMode(connection: PacketConnection, mode: DeviceMode): Promise<void> {
    connection.assertDevice();

    if (mode.equals(connection.device.mode)) {
      return;
    }

    if (mode.value === DeviceModeValue.None) {
      await this.changeModeToNone(connection);
    } else if (mode.value === DeviceModeValue.Spot) {
      await this.changeModeToSpot(connection);
    } else if (mode.value === DeviceModeValue.Zone) {
      await this.changeModeToZone(connection);
    } else if (mode.value === DeviceModeValue.Mop) {
      await this.changeModeToMop(connection);
    } else {
      throw new ArgumentInvalidException(
        `Value '${mode.value as string}' is not supported in ${this.constructor.name}`,
      );
    }

    return this.waitForModeChange(connection, mode);
  }

  private async changeModeToNone(connection: PacketConnection): Promise<void> {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_AUTO_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Stop,
      cleanType: 2,
    });

    response.assertPayloadName('DEVICE_AUTO_CLEAN_RSP');
  }

  private async changeModeToSpot(connection: PacketConnection & ConnectionWithDevice): Promise<void> {
    let mask = 0x78ff | 0x200;

    if (!connection.device.system.supports(DeviceCapability.MAP_PLANS)) {
      mask = 0xff | 0x200;
    }

    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', { mask });

    response.assertPayloadName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP');
  }

  private async changeModeToZone(connection: PacketConnection & ConnectionWithDevice): Promise<void> {
    let response: PacketMessage;

    response = await connection.sendAndWait('DEVICE_AREA_CLEAN_REQ', {
      ctrlValue: ModeCtrlValue.Stop,
    });

    response.assertPayloadName('DEVICE_AREA_CLEAN_RSP');

    let mask = 0x78ff | 0x100;

    if (!connection.device.system.supports(DeviceCapability.MAP_PLANS)) {
      mask = 0xff | 0x100;
    }

    response = await connection.sendAndWait('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', { mask });

    response.assertPayloadName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP');
  }

  private async changeModeToMop(connection: PacketConnection & ConnectionWithDevice): Promise<void> {
    const response: PacketMessage = await connection.sendAndWait('DEVICE_MAPID_INTO_MODEIDLE_INFO_REQ', {
      mode: 7,
    });

    response.assertPayloadName('DEVICE_MAPID_INTO_MODEIDLE_INFO_RSP');
  }

  private async waitForModeChange(
    connection: PacketConnection & ConnectionWithDevice,
    mode: DeviceMode,
  ): Promise<void> {
    const callback = () => mode.equals(connection.device.mode);
    const options = { timeout: MODE_CHANGE_TIMEOUT };

    try {
      await this.waiterService.waitFor(callback, options);
    } catch (err) {
      throw new DomainException(
        `Unable to change device mode from '${connection.device.mode?.value ?? 'Unknown'}' to '${mode.value}'`,
        undefined,
        { cause: err },
      );
    }
  }
}
