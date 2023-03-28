import { Command, ID } from '@agnoc/toolkit';
import { VoiceSetting } from '../value-objects/voice-setting.value-object';

export interface SetDeviceVoiceCommandInput {
  deviceId: ID;
  voice: VoiceSetting;
}

export class SetDeviceVoiceCommand extends Command<SetDeviceVoiceCommandInput, void> {
  get deviceId(): ID {
    return this.props.deviceId;
  }

  get voice(): VoiceSetting {
    return this.props.voice;
  }

  protected validate(props: SetDeviceVoiceCommandInput): void {
    this.validateDefinedProp(props, 'deviceId');
    this.validateInstanceProp(props, 'deviceId', ID);
    this.validateDefinedProp(props, 'voice');
    this.validateInstanceProp(props, 'voice', VoiceSetting);
  }
}
