import { Command, ID } from '@agnoc/toolkit';
import { VoiceSetting } from '../value-objects/voice-setting.value-object';

/** Input for the command setting the voice setting of a device. */
export interface SetDeviceVoiceCommandInput {
  /** ID of the device to set the voice setting for. */
  deviceId: ID;
  /** Voice setting to set. */
  voice: VoiceSetting;
}

/** Command that sets the voice setting of a device. */
export class SetDeviceVoiceCommand extends Command<SetDeviceVoiceCommandInput, void> {
  /** Returns the ID of the device to set the voice setting for. */
  get deviceId(): ID {
    return this.props.deviceId;
  }

  /** Returns the voice setting to set. */
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
