import { Repository } from '@agnoc/toolkit';
import type { Connection, ConnectionWithDevice } from '../aggregate-roots/connection.aggregate-root';
import type { ID } from '@agnoc/toolkit';

export interface ConnectionRepositoryPorts {
  findByDeviceId(deviceId: ID): Promise<Connection[]>;
}

export class ConnectionRepository extends Repository<Connection> implements ConnectionRepositoryPorts {
  async findByDeviceId(deviceId: ID): Promise<(Connection & ConnectionWithDevice)[]> {
    const connections = this.adapter.getAll() as Connection[];

    return connections.filter((connection) => deviceId.equals(connection.device?.id)) as (Connection &
      ConnectionWithDevice)[];
  }
}
