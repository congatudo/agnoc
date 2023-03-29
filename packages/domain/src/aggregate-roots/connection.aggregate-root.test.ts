import { AggregateRoot, ArgumentInvalidException, DomainException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { ConnectionDeviceChangedDomainEvent } from '../domain-events/connection-device-changed.domain-event';
import { givenSomeDeviceProps, givenSomeConnectionProps } from '../test-support';
import { Connection } from './connection.aggregate-root';
import { Device } from './device.aggregate-root';
import type { ConnectionProps } from './connection.aggregate-root';

describe('Connection', function () {
  it('should be created', function () {
    const props = givenSomeDeviceProps();
    const connection = new DummyConnection(props);

    expect(connection).to.be.instanceOf(AggregateRoot);
    expect(connection.id).to.be.equal(props.id);
  });

  it('should be created with device', function () {
    const device = new Device(givenSomeDeviceProps());
    const connection = new DummyConnection({ ...givenSomeConnectionProps(), device });

    expect(connection.device).to.be.equal(device);
  });

  it("should throw an error when 'deviceId' is not a Device", function () {
    // @ts-expect-error - invalid property
    expect(() => new DummyConnection({ ...givenSomeConnectionProps(), device: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'device' of DummyConnection is not an instance of Device`,
    );
  });

  describe('#setDevice', function () {
    it('should set a device', function () {
      const device = new Device(givenSomeDeviceProps());
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device: undefined });

      connection.setDevice(device);

      expect(connection.device).to.be.equal(device);

      const event = connection.domainEvents[0] as ConnectionDeviceChangedDomainEvent;

      expect(event).to.be.instanceOf(ConnectionDeviceChangedDomainEvent);
      expect(event.aggregateId).to.be.equal(connection.id);
      expect(event.previousDeviceId).to.be.equal(undefined);
      expect(event.currentDeviceId).to.be.equal(device.id);
    });

    it('should override a device', function () {
      const deviceA = new Device(givenSomeDeviceProps());
      const deviceB = new Device(givenSomeDeviceProps());
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device: deviceA });

      connection.setDevice(deviceB);

      expect(connection.device).to.be.equal(deviceB);

      const event = connection.domainEvents[0] as ConnectionDeviceChangedDomainEvent;

      expect(event).to.be.instanceOf(ConnectionDeviceChangedDomainEvent);
      expect(event.aggregateId).to.be.equal(connection.id);
      expect(event.previousDeviceId).to.be.equal(deviceA.id);
      expect(event.currentDeviceId).to.be.equal(deviceB.id);
    });

    it('should unset a device', function () {
      const device = new Device(givenSomeDeviceProps());
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device });

      connection.setDevice(undefined);

      expect(connection.device).to.be.equal(undefined);

      const event = connection.domainEvents[0] as ConnectionDeviceChangedDomainEvent;

      expect(event).to.be.instanceOf(ConnectionDeviceChangedDomainEvent);
      expect(event.aggregateId).to.be.equal(connection.id);
      expect(event.previousDeviceId).to.be.equal(device.id);
      expect(event.currentDeviceId).to.be.equal(undefined);
    });

    it('should do nothing when setting the same device', function () {
      const device = new Device(givenSomeDeviceProps());
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device });

      connection.setDevice(device);

      expect(connection.device).to.be.equal(device);
      expect(connection.domainEvents).to.be.empty;
    });

    it('should do nothing when setting nothing over nothing', function () {
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device: undefined });

      connection.setDevice(undefined);

      expect(connection.device).to.be.equal(undefined);
      expect(connection.domainEvents).to.be.empty;
    });

    it('should throw an error when setting not a Device', function () {
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device: undefined });

      // @ts-expect-error - invalid property
      expect(() => connection.setDevice('foo')).to.throw(
        ArgumentInvalidException,
        `Value 'foo' for property 'device' of DummyConnection is not an instance of Device`,
      );
    });
  });

  describe('#assertDevice()', function () {
    it('should throw an error when the connection does not has a device set', function () {
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device: undefined });

      expect(() => connection.assertDevice()).to.throw(
        DomainException,
        'Connection does not have a reference to a device',
      );
    });

    it('should not throw an error when the connection has a device set', function () {
      const device = new Device(givenSomeDeviceProps());
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device });

      expect(() => connection.assertDevice()).to.not.throw(DomainException);
    });
  });
});

class DummyConnection extends Connection<ConnectionProps> {
  connectionType = 'Dummy';
}
