import { DeviceOrder } from '@agnoc/domain';
import { givenSomeDeviceOrderProps } from '@agnoc/domain/test-support';
import { Payload, OPCode, Packet } from '@agnoc/transport-tcp';
import { givenSomePacketProps } from '@agnoc/transport-tcp/test-support';
import { anything, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceOrderListUpdateEventHandler } from './device-order-list-update.event-handler';
import type { DeviceOrderMapper } from '../mappers/device-order.mapper';
import type { PacketMessage } from '../objects/packet.message';
import type { Device, DeviceRepository } from '@agnoc/domain';

describe('DeviceOrderListUpdateEventHandler', function () {
  let deviceOrderMapper: DeviceOrderMapper;
  let deviceRepository: DeviceRepository;
  let eventHandler: DeviceOrderListUpdateEventHandler;
  let packetMessage: PacketMessage<'DEVICE_ORDERLIST_GETTING_RSP'>;
  let device: Device;

  beforeEach(function () {
    deviceOrderMapper = imock();
    deviceRepository = imock();
    eventHandler = new DeviceOrderListUpdateEventHandler(instance(deviceOrderMapper), instance(deviceRepository));
    packetMessage = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('DEVICE_ORDERLIST_GETTING_RSP');
  });

  describe('#handle()', function () {
    it('should not update the device orders when it is empty', async function () {
      const deviceOrder = new DeviceOrder(givenSomeDeviceOrderProps());
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_ORDERLIST_GETTING_RSP'),
        data: { result: 0 },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(deviceOrderMapper.toDomain(anything())).thenReturn(deviceOrder);
      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceOrderMapper.toDomain(anything())).never();
      verify(device.updateOrders(anything())).never();
      verify(deviceRepository.saveOne(instance(device))).never();
    });

    it('should update the device orders when it has orders', async function () {
      const deviceOrder = new DeviceOrder(givenSomeDeviceOrderProps());
      const order = { orderId: 1, enable: true, repeat: false, weekDay: 1, dayTime: 180 };
      const payload = new Payload({
        opcode: OPCode.fromName('DEVICE_ORDERLIST_GETTING_RSP'),
        data: {
          result: 0,
          orderList: [order],
        },
      });
      const packet = new Packet({ ...givenSomePacketProps(), payload });

      when(deviceOrderMapper.toDomain(anything())).thenReturn(deviceOrder);
      when(packetMessage.packet).thenReturn(packet);
      when(packetMessage.device).thenReturn(instance(device));

      await eventHandler.handle(instance(packetMessage));

      verify(packetMessage.assertDevice()).once();
      verify(deviceOrderMapper.toDomain(order)).once();
      verify(device.updateOrders(deepEqual([deviceOrder]))).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });
  });
});
