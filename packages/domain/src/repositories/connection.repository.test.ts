import { ID, Repository } from '@agnoc/toolkit';
import { imock, instance, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { Connection } from '../aggregate-roots/connection.aggregate-root';
import { Device } from '../aggregate-roots/device.aggregate-root';
import { givenSomeConnectionProps, givenSomeDeviceProps } from '../test-support';
import { ConnectionRepository } from './connection.repository';
import type { ConnectionProps } from '../aggregate-roots/connection.aggregate-root';
import type { Adapter, EventBus } from '@agnoc/toolkit';

describe('ConnectionRepository', function () {
  let eventBus: EventBus;
  let adapter: Adapter;
  let repository: ConnectionRepository;

  beforeEach(function () {
    eventBus = imock();
    adapter = imock();
    repository = new ConnectionRepository(instance(eventBus), instance(adapter));
  });

  it('should be a repository', function () {
    expect(repository).to.be.an.instanceOf(Repository);
  });

  describe('#findByDeviceId', function () {
    it('should find a connection by device id', async function () {
      const connections = [
        givenAConnectionWithDeviceId(new ID(1)),
        givenAConnectionWithDeviceId(new ID(2)),
        givenAConnectionWithDeviceId(new ID(3)),
      ];

      when(adapter.getAll()).thenReturn(connections);

      const ret = await repository.findByDeviceId(new ID(1));

      expect(ret).to.contain(connections[0]);
    });
  });
});

class DummyConnection extends Connection<ConnectionProps> {
  connectionType = 'Dummy';
}

function givenAConnectionWithDeviceId(deviceId: ID) {
  return new DummyConnection({
    ...givenSomeConnectionProps(),
    device: new Device({ ...givenSomeDeviceProps(), id: deviceId }),
  });
}
