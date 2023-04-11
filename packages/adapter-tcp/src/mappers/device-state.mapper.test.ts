import { DeviceState, DeviceStateValue } from '@agnoc/domain';
import { DomainException, NotImplementedException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceStateMapper } from './device-state.mapper';

describe('DeviceStateMapper', function () {
  let mapper: DeviceStateMapper;

  beforeEach(function () {
    mapper = new DeviceStateMapper();
  });

  describe('#toDomain()', function () {
    it('should return an error device state', function () {
      const deviceState = mapper.toDomain({ chargeStatus: true, type: 1, workMode: 0 });

      expect(deviceState).to.be.instanceOf(DeviceState);
      expect(deviceState.value).to.be.equal(DeviceStateValue.Error);
    });

    it('should return a manual control device state', function () {
      const deviceState = mapper.toDomain({ chargeStatus: false, type: 0, workMode: 2 });

      expect(deviceState).to.be.instanceOf(DeviceState);
      expect(deviceState.value).to.be.equal(DeviceStateValue.ManualControl);
    });

    it('should return a returning device state', function () {
      const deviceState = mapper.toDomain({ chargeStatus: false, type: 0, workMode: 5 });

      expect(deviceState).to.be.instanceOf(DeviceState);
      expect(deviceState.value).to.be.equal(DeviceStateValue.Returning);
    });

    it('should return a paused device state', function () {
      const deviceState = mapper.toDomain({ chargeStatus: false, type: 0, workMode: 4 });

      expect(deviceState).to.be.instanceOf(DeviceState);
      expect(deviceState.value).to.be.equal(DeviceStateValue.Paused);
    });

    it('should return a cleaning device state', function () {
      const deviceState = mapper.toDomain({ chargeStatus: false, type: 0, workMode: 1 });

      expect(deviceState).to.be.instanceOf(DeviceState);
      expect(deviceState.value).to.be.equal(DeviceStateValue.Cleaning);
    });

    it('should return a docked device state', function () {
      const deviceState = mapper.toDomain({ chargeStatus: true, type: 0, workMode: 0 });

      expect(deviceState).to.be.instanceOf(DeviceState);
      expect(deviceState.value).to.be.equal(DeviceStateValue.Docked);
    });

    it('should return a idle device state', function () {
      const deviceState = mapper.toDomain({ chargeStatus: false, type: 0, workMode: 0 });

      expect(deviceState).to.be.instanceOf(DeviceState);
      expect(deviceState.value).to.be.equal(DeviceStateValue.Idle);
    });

    it('should throw an error when device state is unknown', function () {
      expect(() => mapper.toDomain({ chargeStatus: false, type: 0, workMode: 100 })).to.throw(
        DomainException,
        'Unable to map device state from data: {"chargeStatus":false,"type":0,"workMode":100}',
      );
    });
  });

  describe('#fromDomain()', function () {
    it('should throw an error', function () {
      expect(() => mapper.fromDomain()).to.throw(NotImplementedException, 'DeviceStateMapper.fromDomain');
    });
  });
});
