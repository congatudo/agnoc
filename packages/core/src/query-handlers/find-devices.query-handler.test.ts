import { Device, FindDevicesQuery } from '@agnoc/domain';
import { givenSomeDeviceProps } from '@agnoc/domain/test-support';
import { imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { FindDevicesQueryHandler } from './find-devices.query-handler';
import type { DeviceRepository } from '@agnoc/domain';

describe('FindDevicesQueryHandler', function () {
  let deviceRepository: DeviceRepository;
  let queryHandler: FindDevicesQueryHandler;

  beforeEach(function () {
    deviceRepository = imock();
    queryHandler = new FindDevicesQueryHandler(instance(deviceRepository));
  });

  it('should define the name', function () {
    expect(queryHandler.forName).to.be.equal('FindDevicesQuery');
  });

  describe('#handle()', function () {
    it('should find some devices', async function () {
      const devices = [new Device(givenSomeDeviceProps())];
      const query = new FindDevicesQuery();

      when(deviceRepository.findAll()).thenResolve(devices);

      const result = await queryHandler.handle(query);

      expect(result).to.be.deep.equal({ devices });

      verify(deviceRepository.findAll()).once();
    });
  });
});
