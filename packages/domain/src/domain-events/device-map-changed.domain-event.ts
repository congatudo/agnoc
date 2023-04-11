import { DomainEvent } from '@agnoc/toolkit';
import { DeviceMap } from '../entities/device-map.entity';
import type { DomainEventProps } from '@agnoc/toolkit';

export interface DeviceMapChangedDomainEventProps extends DomainEventProps {
  previousMap?: DeviceMap;
  currentMap: DeviceMap;
}

export class DeviceMapChangedDomainEvent extends DomainEvent<DeviceMapChangedDomainEventProps> {
  get previousMap(): DeviceMap | undefined {
    return this.props.previousMap;
  }

  get currentMap(): DeviceMap {
    return this.props.currentMap;
  }

  protected validate(props: DeviceMapChangedDomainEventProps): void {
    if (props.previousMap) {
      this.validateInstanceProp(props, 'previousMap', DeviceMap);
    }

    this.validateDefinedProp(props, 'currentMap');
    this.validateInstanceProp(props, 'currentMap', DeviceMap);
  }
}
