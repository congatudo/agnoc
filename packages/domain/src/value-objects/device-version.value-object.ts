import { ValueObject, isPresent, ArgumentNotProvidedException } from '@agnoc/toolkit';

export interface DeviceVersionProps {
  software: string;
  hardware: string;
}

export class DeviceVersion extends ValueObject<DeviceVersionProps> {
  get software(): string {
    return this.props.software;
  }

  get hardware(): string {
    return this.props.hardware;
  }

  protected validate(props: DeviceVersionProps): void {
    if (![props.software, props.hardware].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device current clean constructor');
    }
  }
}
