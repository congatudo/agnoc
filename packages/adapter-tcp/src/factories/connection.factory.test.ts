import { Connection } from '@agnoc/domain';
import { ID } from '@agnoc/toolkit';
import { PacketSocket } from '@agnoc/transport-tcp';
import { imock, instance } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PacketConnectionFactory } from './connection.factory';
import type { PacketEventBus } from '../packet.event-bus';
import type { PacketFactory, PacketMapper } from '@agnoc/transport-tcp';

describe('PacketConnectionFactory', function () {
  let packetEventBus: PacketEventBus;
  let packetFactory: PacketFactory;
  let packetMapper: PacketMapper;
  let connectionFactory: PacketConnectionFactory;

  beforeEach(function () {
    packetEventBus = imock();
    packetFactory = imock();
    packetMapper = imock();
    connectionFactory = new PacketConnectionFactory(instance(packetEventBus), instance(packetFactory));
  });

  describe('#create()', function () {
    it('should return a PacketConnection', function () {
      const id = ID.generate();
      const connection = connectionFactory.create({ id, socket: new PacketSocket(packetMapper) });

      expect(connection).to.be.instanceOf(Connection);
      expect(connection.id.equals(id)).to.be.true;
    });
  });
});
