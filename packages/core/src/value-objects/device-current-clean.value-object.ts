import { ValueObject } from '../base-classes/value-object.base';
import { ArgumentNotProvidedException } from '../exceptions/argument-not-provided.exception';
import { isPresent } from '../utils/is-present.util';

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
