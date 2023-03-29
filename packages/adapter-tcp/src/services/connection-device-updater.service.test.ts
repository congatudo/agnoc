import { Device } from '@agnoc/domain';
import { givenSomeDeviceProps } from '@agnoc/domain/test-support';
import { ID } from '@agnoc/toolkit';
import { Packet } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { ConnectionDeviceUpdaterService } from './connection-device-updater.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { ConnectionRepository, DeviceRepository } from '@agnoc/domain';

describe('ConnectionDeviceUpdaterService', function () {
  let connectionRepository: ConnectionRepository;
  let deviceRepository: DeviceRepository;
  let service: ConnectionDeviceUpdaterService;
  let connection: PacketConnection;

  beforeEach(function () {
    connectionRepository = imock();
    deviceRepository = imock();
    connection = imock();
    service = new ConnectionDeviceUpdaterService(instance(connectionRepository), instance(deviceRepository));
  });

  describe('#updateFromPacket()', function () {
    it('should update device in connection from packet when ids does not match', async function () {
      const device = new Device(givenSomeDeviceProps());
      const packet = new Packet({ ...givenSomePacketProps(), deviceId: new ID(1) });

      when(connection.device).thenReturn(new Device({ ...givenSomeDeviceProps(), id: new ID(2) }));
      when(deviceRepository.findOneById(anything())).thenResolve(device);

      await service.updateFromPacket(packet, instance(connection));

      verify(connection.setDevice(device)).once();
      verify(connectionRepository.saveOne(instance(connection))).once();
    });

    it('should not update device in connection from packet when ids match', async function () {
      const device = new Device(givenSomeDeviceProps());
      const packet = new Packet({ ...givenSomePacketProps(), deviceId: new ID(1) });

      when(connection.device).thenReturn(new Device({ ...givenSomeDeviceProps(), id: new ID(1) }));
      when(deviceRepository.findOneById(anything())).thenResolve(device);

      await service.updateFromPacket(packet, instance(connection));

      verify(connection.setDevice(anything())).never();
      verify(connectionRepository.saveOne(anything())).never();
    });

    it('should update device in connection with nothing when packet device id is zero', async function () {
      const device = new Device(givenSomeDeviceProps());
      const packet = new Packet({ ...givenSomePacketProps(), deviceId: new ID(0) });

      when(connection.device).thenReturn(new Device({ ...givenSomeDeviceProps(), id: new ID(1) }));
      when(deviceRepository.findOneById(anything())).thenResolve(device);

      await service.updateFromPacket(packet, instance(connection));

      verify(connection.setDevice(undefined)).once();
      verify(connectionRepository.saveOne(instance(connection))).once();
    });
  });
});
