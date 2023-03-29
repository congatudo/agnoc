import { DomainException, ID } from '@agnoc/toolkit';
import { imock, instance, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketConnectionFinderService } from './packet-connection-finder.service';
import type { ConnectionRepository, ConnectionWithDevice } from '@agnoc/domain';

describe('PacketConnectionFinderService', function () {
  let connectionRepository: ConnectionRepository;
  let service: PacketConnectionFinderService;
  let connection: ConnectionWithDevice;

  beforeEach(function () {
    connectionRepository = imock();
    service = new PacketConnectionFinderService(instance(connectionRepository));
    connection = imock();
  });

  describe('#findByDeviceId()', function () {
    it('should find a connection by device id when it is a packet connection', async function () {
      const deviceId = new ID(1);

      when(connectionRepository.findByDeviceId(deviceId)).thenResolve([instance(connection)]);
      when(connection.connectionType).thenReturn('PACKET');

      const ret = await service.findByDeviceId(deviceId);

      expect(ret).to.equal(instance(connection));
    });

    it('should not find anything when is it not a packet connection', async function () {
      const deviceId = new ID(1);

      when(connectionRepository.findByDeviceId(deviceId)).thenResolve([instance(connection)]);
      when(connection.connectionType).thenReturn('OTHER');

      const ret = await service.findByDeviceId(deviceId);

      expect(ret).to.equal(undefined);
    });

    it('should throw an error when no connection is found', async function () {
      const deviceId = new ID(1);

      when(connectionRepository.findByDeviceId(deviceId)).thenResolve([]);

      await expect(service.findByDeviceId(deviceId)).to.be.rejectedWith(
        DomainException,
        'Unable to find a connection for the device with id 1',
      );
    });
  });
});
