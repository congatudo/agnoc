import { AggregateRoot, ArgumentInvalidException } from '@agnoc/toolkit';
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
      expect(connection.domainEvents).to.deep.contain(
        new ConnectionDeviceChangedDomainEvent({
          aggregateId: connection.id,
          previousDeviceId: undefined,
          currentDeviceId: device.id,
        }),
      );
    });

    it('should override a device', function () {
      const deviceA = new Device(givenSomeDeviceProps());
      const deviceB = new Device(givenSomeDeviceProps());
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device: deviceA });

      connection.setDevice(deviceB);

      expect(connection.device).to.be.equal(deviceB);
      expect(connection.domainEvents).to.deep.contain(
        new ConnectionDeviceChangedDomainEvent({
          aggregateId: connection.id,
          previousDeviceId: deviceA.id,
          currentDeviceId: deviceB.id,
        }),
      );
    });

    it('should unset a device', function () {
      const device = new Device(givenSomeDeviceProps());
      const connection = new DummyConnection({ ...givenSomeConnectionProps(), device });

      connection.setDevice(undefined);

      expect(connection.device).to.be.equal(undefined);
      expect(connection.domainEvents).to.deep.contain(
        new ConnectionDeviceChangedDomainEvent({
          aggregateId: connection.id,
          previousDeviceId: device.id,
          currentDeviceId: undefined,
        }),
      );
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
});

class DummyConnection extends Connection<ConnectionProps> {
  connectionType = 'Dummy';
}
