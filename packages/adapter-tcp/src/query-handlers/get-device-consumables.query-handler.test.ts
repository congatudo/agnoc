import { DeviceConsumable, DeviceConsumableType, GetDeviceConsumablesQuery } from '@agnoc/domain';
import { DomainException, ID } from '@agnoc/toolkit';
import { Payload, OPCode, Packet } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { imock, instance, when, verify, anything, deepEqual } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { GetDeviceConsumablesQueryHandler } from './get-device-consumables.query-handler';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { PacketConnectionFinderService } from '../services/packet-connection-finder.service';
import type { ConnectionWithDevice, DeviceRepository, Device } from '@agnoc/domain';

describe('GetDeviceConsumablesQueryHandler', function () {
  let deviceRepository: DeviceRepository;
  let packetConnectionFinderService: PacketConnectionFinderService;
  let queryHandler: GetDeviceConsumablesQueryHandler;
  let packetConnection: PacketConnection & ConnectionWithDevice;
  let packetMessage: PacketMessage;
  let device: Device;

  beforeEach(function () {
    deviceRepository = imock();
    packetConnectionFinderService = imock();
    queryHandler = new GetDeviceConsumablesQueryHandler(
      instance(packetConnectionFinderService),
      instance(deviceRepository),
    );
    packetConnection = imock();
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(queryHandler.forName).to.be.equal('GetDeviceConsumablesQuery');
  });

  describe('#handle()', function () {
    it('should throw an error when no connection is found', async function () {
      const query = new GetDeviceConsumablesQuery({ deviceId: new ID(1) });

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(undefined);

      await expect(queryHandler.handle(query)).to.be.rejectedWith(
        DomainException,
        'Unable to find a device connected with id 1',
      );

      verify(packetConnection.sendAndWait(anything(), anything())).never();
      verify(packetMessage.assertPayloadName(anything())).never();
    });

    it('should get consumables', async function () {
      const query = new GetDeviceConsumablesQuery({ deviceId: new ID(1) });
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_MAPID_GET_CONSUMABLES_PARAM_REQ'),
        data: {
          mainBrushTime: 1,
          sideBrushTime: 2,
          filterTime: 3,
          dishclothTime: 4,
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });
      const consumables = [
        new DeviceConsumable({
          type: DeviceConsumableType.MainBrush,
          hoursUsed: 1,
        }),
        new DeviceConsumable({
          type: DeviceConsumableType.SideBrush,
          hoursUsed: 2,
        }),
        new DeviceConsumable({
          type: DeviceConsumableType.Filter,
          hoursUsed: 3,
        }),
        new DeviceConsumable({
          type: DeviceConsumableType.Dishcloth,
          hoursUsed: 4,
        }),
      ];

      when(packetConnectionFinderService.findByDeviceId(anything())).thenResolve(instance(packetConnection));
      when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
      when(packetMessage.packet).thenReturn(packet);
      when(packetConnection.device).thenReturn(instance(device));

      const ret = await queryHandler.handle(query);

      expect(ret.consumables).to.be.deep.equal(consumables);

      verify(packetConnection.sendAndWait('DEVICE_MAPID_GET_CONSUMABLES_PARAM_REQ', deepEqual({}))).once();
      verify(packetMessage.assertPayloadName('DEVICE_MAPID_GET_CONSUMABLES_PARAM_RSP')).once();
      verify(device.updateConsumables(deepEqual(consumables))).once();
      verify(deviceRepository.saveOne(anything())).once();
    });
  });
});
