import { ConnectionDeviceChangedDomainEvent } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { SetDeviceAsConnectedWhenConnectionDeviceAddedEventHandler } from './set-device-connected-when-connection-device-changed.event-handler';
import type { ConnectionRepository, DeviceRepository, Device, ConnectionWithDevice } from '@agnoc/domain';

describe('SetDeviceAsConnectedWhenConnectionDeviceAddedEventHandler', function () {
  let connectionRepository: ConnectionRepository;
  let deviceRepository: DeviceRepository;
  let eventHandler: SetDeviceAsConnectedWhenConnectionDeviceAddedEventHandler;
  let connection: ConnectionWithDevice;
  let device: Device;

  beforeEach(function () {
    connectionRepository = imock();
    deviceRepository = imock();
    eventHandler = new SetDeviceAsConnectedWhenConnectionDeviceAddedEventHandler(
      instance(connectionRepository),
      instance(deviceRepository),
    );
    connection = imock();
    device = imock();
  });

  it('should define the name', function () {
    expect(eventHandler.forName).to.be.equal('ConnectionDeviceChangedDomainEvent');
  });

  describe('#handle()', function () {
    it('should set device as connected when there are more than one connection', async function () {
      const currentDeviceId = new ID(2);
      const event = new ConnectionDeviceChangedDomainEvent({ aggregateId: new ID(1), currentDeviceId });

      when(connectionRepository.findByDeviceId(anything())).thenResolve([instance(connection), instance(connection)]);
      when(deviceRepository.findOneById(anything())).thenResolve(instance(device));
      when(connection.connectionType).thenReturn('PACKET');
      when(device.isConnected).thenReturn(false);

      await eventHandler.handle(event);

      verify(connectionRepository.findByDeviceId(currentDeviceId)).once();
      verify(deviceRepository.findOneById(currentDeviceId)).once();
      verify(device.setAsConnected()).once();
      verify(deviceRepository.saveOne(instance(device))).once();
    });

    it('should do nothing when there is no current device id', async function () {
      const event = new ConnectionDeviceChangedDomainEvent({ aggregateId: new ID(1) });

      await eventHandler.handle(event);

      verify(connectionRepository.findByDeviceId(anything())).never();
      verify(deviceRepository.findOneById(anything())).never();
      verify(device.setAsConnected()).never();
      verify(deviceRepository.saveOne(anything())).never();
    });

    it('should do nothing when there is only one connection', async function () {
      const currentDeviceId = new ID(2);
      const event = new ConnectionDeviceChangedDomainEvent({ aggregateId: new ID(1), currentDeviceId });

      when(connectionRepository.findByDeviceId(anything())).thenResolve([instance(connection)]);
      when(deviceRepository.findOneById(anything())).thenResolve(instance(device));
      when(connection.connectionType).thenReturn('PACKET');
      when(device.isConnected).thenReturn(false);

      await eventHandler.handle(event);

      verify(connectionRepository.findByDeviceId(currentDeviceId)).once();
      verify(deviceRepository.findOneById(currentDeviceId)).once();
      verify(device.setAsConnected()).never();
      verify(deviceRepository.saveOne(anything())).never();
    });

    it('should do nothing when connections are not packet connections', async function () {
      const currentDeviceId = new ID(2);
      const event = new ConnectionDeviceChangedDomainEvent({ aggregateId: new ID(1), currentDeviceId });

      when(connectionRepository.findByDeviceId(anything())).thenResolve([instance(connection), instance(connection)]);
      when(deviceRepository.findOneById(anything())).thenResolve(instance(device));
      when(connection.connectionType).thenReturn('OTHER');
      when(device.isConnected).thenReturn(false);

      await eventHandler.handle(event);

      verify(connectionRepository.findByDeviceId(currentDeviceId)).once();
      verify(deviceRepository.findOneById(currentDeviceId)).once();
      verify(device.setAsConnected()).never();
      verify(deviceRepository.saveOne(anything())).never();
    });
  });
});
