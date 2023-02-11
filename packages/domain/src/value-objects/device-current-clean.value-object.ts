import { ValueObject, isPresent, ArgumentNotProvidedException } from '@agnoc/toolkit';

export interface DeviceCurrentCleanProps {
  size: number;
  time: number;
}

export class DeviceCurrentClean extends ValueObject<DeviceCurrentCleanProps> {
  get size(): number {
    return this.props.size;
  }

  get time(): number {
    return this.props.time;
  }

  protected validate(props: DeviceCurrentCleanProps): void {
    if (![props.size, props.time].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device current clean constructor');
    }
  }
}
