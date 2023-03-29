import { AggregateRoot, DomainException } from '@agnoc/toolkit';
import { ConnectionDeviceChangedDomainEvent } from '../domain-events/connection-device-changed.domain-event';
import { Device } from './device.aggregate-root';
import type { EntityProps } from '@agnoc/toolkit';

export interface ConnectionProps extends EntityProps {
  device?: Device;
}

export interface ConnectionWithDevice<T extends Device = Device> extends Connection {
  device: T;
}

export abstract class Connection<Props extends ConnectionProps = ConnectionProps> extends AggregateRoot<Props> {
  abstract readonly connectionType: string;

  constructor(props: Props) {
    super(props);
  }

  get device(): Device | undefined {
    return this.props.device;
  }

  setDevice(device: Device | undefined): void {
    if (this.device === device || this.device?.equals(device)) {
      return;
    }

    if (device) {
      this.validateInstanceProp({ device }, 'device', Device);
    }

    const previousDeviceId = this.device?.id;
    const currentDeviceId = device?.id;

    this.props.device = device;
    this.addEvent(new ConnectionDeviceChangedDomainEvent({ aggregateId: this.id, previousDeviceId, currentDeviceId }));
  }

  assertDevice(): asserts this is Connection & ConnectionWithDevice {
    if (!this.device) {
      throw new DomainException('Connection does not have a reference to a device');
    }
  }

  protected validate(props: Props): void {
    if (props.device) {
      this.validateInstanceProp(props, 'device', Device);
    }
  }
}
