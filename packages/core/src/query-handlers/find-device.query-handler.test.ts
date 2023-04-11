import { Device, FindDeviceQuery } from '@agnoc/domain';
import { givenSomeDeviceProps } from '@agnoc/domain/test-support';
import { ID } from '@agnoc/toolkit';
import { anything, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { FindDeviceQueryHandler } from './find-device.query-handler';
import type { DeviceRepository } from '@agnoc/domain';

describe('FindDeviceQueryHandler', function () {
  let deviceRepository: DeviceRepository;
  let queryHandler: FindDeviceQueryHandler;

  beforeEach(function () {
    deviceRepository = imock();
    queryHandler = new FindDeviceQueryHandler(instance(deviceRepository));
  });

  it('should define the name', function () {
    expect(queryHandler.forName).to.be.equal('FindDeviceQuery');
  });

  describe('#handle()', function () {
    it('should find a device', async function () {
      const deviceId = new ID(1);
      const device = new Device(givenSomeDeviceProps());
      const query = new FindDeviceQuery({ deviceId });

      when(deviceRepository.findOneById(anything())).thenResolve(device);

      const result = await queryHandler.handle(query);

      expect(result).to.be.deep.equal({ device });

      verify(deviceRepository.findOneById(deviceId)).once();
    });

    it("throw an error when 'device' is not found", async function () {
      const deviceId = new ID(1);
      const query = new FindDeviceQuery({ deviceId });

      when(deviceRepository.findOneById(anything())).thenResolve(undefined);

      await expect(queryHandler.handle(query)).to.be.rejectedWith(`Unable to find a device with id ${deviceId.value}`);

      verify(deviceRepository.findOneById(deviceId)).once();
    });
  });
});
