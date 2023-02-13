import { ValueObject, isPresent, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';

export interface DeviceVoiceProps {
  isEnabled: boolean;
  volume: number;
}

export const DeviceVoiceMinVolume = 0;
export const DeviceVoiceMaxVolume = 100;

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

    if (props.volume < DeviceVoiceMinVolume || props.volume > DeviceVoiceMaxVolume) {
      throw new ArgumentInvalidException('Invalid property in device voice constructor');
    }
  }
}
