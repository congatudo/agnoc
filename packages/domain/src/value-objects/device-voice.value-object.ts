import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

export interface DeviceVoiceProps {
  isEnabled: boolean;
  volume: number;
}

const MIN_VOLUME = 0;
const MAX_VOLUME = 100;

export class DeviceVoice extends ValueObject<DeviceVoiceProps> {
  get isEnabled(): boolean {
    return this.props.isEnabled;
  }

  get volume(): number {
    return this.props.volume;
  }

  protected validate(props: DeviceVoiceProps): void {
    if (![props.isEnabled, props.volume].every(isPresent)) {
      throw new ArgumentNotProvidedException('Missing property in device voice constructor');
    }

    if (props.volume < MIN_VOLUME || props.volume > MAX_VOLUME) {
      throw new ArgumentInvalidException('Invalid property in device voice constructor');
    }
  }

  static MIN_VOLUME = MIN_VOLUME;
  static MAX_VOLUME = MAX_VOLUME;
}
