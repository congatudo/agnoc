import { Repository } from '@agnoc/toolkit';
import type { Connection } from '../aggregate-roots/connection.aggregate-root';
import type { ID } from '@agnoc/toolkit';

export interface ConnectionRepositoryPorts {
  findByDeviceId(deviceId: ID): Promise<Connection[]>;
}

export class ConnectionRepository extends Repository<Connection> implements ConnectionRepositoryPorts {
  async findByDeviceId(deviceId: ID): Promise<Connection[]> {
    const connections = this.adapter.getAll() as Connection[];

    return connections.filter((connection) => connection.device?.id.equals(deviceId));
  }
}
