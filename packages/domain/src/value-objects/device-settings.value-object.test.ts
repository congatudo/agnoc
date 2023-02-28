import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { DeviceSetting } from './device-setting.value-object';
import { DeviceSettings } from './device-settings.value-object';
import { DeviceTime } from './device-time.value-object';
import { QuietHoursSetting } from './quiet-hours-setting.value-object';
import { VoiceSetting } from './voice-setting.value-object';

describe('DeviceSettings', function () {
  let voice: VoiceSetting;
  let quietHours: QuietHoursSetting;
  let ecoMode: DeviceSetting;
  let repeatClean: DeviceSetting;
  let brokenClean: DeviceSetting;
  let carpetMode: DeviceSetting;
  let historyMap: DeviceSetting;

  beforeEach(function () {
    voice = new VoiceSetting({ isEnabled: true, volume: 50 });
    quietHours = new QuietHoursSetting({
      isEnabled: true,
      beginTime: DeviceTime.fromMinutes(120),
      endTime: DeviceTime.fromMinutes(240),
    });
    ecoMode = new DeviceSetting({ isEnabled: true });
    repeatClean = new DeviceSetting({ isEnabled: true });
    brokenClean = new DeviceSetting({ isEnabled: true });
    carpetMode = new DeviceSetting({ isEnabled: true });
    historyMap = new DeviceSetting({ isEnabled: true });
  });

  it('should be created', function () {
    const deviceSettings = new DeviceSettings({
      voice,
      quietHours,
      ecoMode,
      repeatClean,
      brokenClean,
      carpetMode,
      historyMap,
    });

    expect(deviceSettings).to.be.instanceOf(ValueObject);
    expect(deviceSettings.voice).to.be.equal(voice);
    expect(deviceSettings.quietHours).to.be.equal(quietHours);
    expect(deviceSettings.ecoMode).to.be.equal(ecoMode);
    expect(deviceSettings.repeatClean).to.be.equal(repeatClean);
    expect(deviceSettings.brokenClean).to.be.equal(brokenClean);
    expect(deviceSettings.carpetMode).to.be.equal(carpetMode);
    expect(deviceSettings.historyMap).to.be.equal(historyMap);
  });

  it("should throw an error when 'voice' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ quietHours, ecoMode, repeatClean, brokenClean, carpetMode, historyMap }),
    ).to.throw(ArgumentNotProvidedException, `Property 'voice' for DeviceSettings not provided`);
  });

  it("should throw an error when 'voice' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ voice: 'foo', quietHours, ecoMode, repeatClean, brokenClean, carpetMode, historyMap }),
    ).to.throw(ArgumentInvalidException, `Value 'foo' for property 'voice' for DeviceSettings is not a VoiceSetting`);
  });

  it("should throw an error when 'quietHours' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ voice, ecoMode, repeatClean, brokenClean, carpetMode, historyMap }),
    ).to.throw(ArgumentNotProvidedException, `Property 'quietHours' for DeviceSettings not provided`);
  });

  it("should throw an error when 'quietHours' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ voice, quietHours: 'foo', ecoMode, repeatClean, brokenClean, carpetMode, historyMap }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'quietHours' for DeviceSettings is not a QuietHoursSetting`,
    );
  });

  it("should throw an error when 'ecoMode' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ voice, quietHours, repeatClean, brokenClean, carpetMode, historyMap }),
    ).to.throw(ArgumentNotProvidedException, `Property 'ecoMode' for DeviceSettings not provided`);
  });

  it("should throw an error when 'ecoMode' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ voice, quietHours, ecoMode: 'foo', repeatClean, brokenClean, carpetMode, historyMap }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'ecoMode' for DeviceSettings is not a DeviceSetting`,
    );
  });

  it("should throw an error when 'repeatClean' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ voice, quietHours, ecoMode, brokenClean, carpetMode, historyMap }),
    ).to.throw(ArgumentNotProvidedException, `Property 'repeatClean' for DeviceSettings not provided`);
  });

  it("should throw an error when 'repeatClean' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ voice, quietHours, ecoMode, repeatClean: 'foo', brokenClean, carpetMode, historyMap }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'repeatClean' for DeviceSettings is not a DeviceSetting`,
    );
  });

  it("should throw an error when 'brokenClean' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ voice, quietHours, ecoMode, repeatClean, carpetMode, historyMap }),
    ).to.throw(ArgumentNotProvidedException, `Property 'brokenClean' for DeviceSettings not provided`);
  });

  it("should throw an error when 'brokenClean' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ voice, quietHours, ecoMode, repeatClean, brokenClean: 'foo', carpetMode, historyMap }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'brokenClean' for DeviceSettings is not a DeviceSetting`,
    );
  });

  it("should throw an error when 'carpetMode' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ voice, quietHours, ecoMode, repeatClean, brokenClean, historyMap }),
    ).to.throw(ArgumentNotProvidedException, `Property 'carpetMode' for DeviceSettings not provided`);
  });

  it("should throw an error when 'carpetMode' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ voice, quietHours, ecoMode, repeatClean, brokenClean, carpetMode: 'foo', historyMap }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'carpetMode' for DeviceSettings is not a DeviceSetting`,
    );
  });

  it("should throw an error when 'historyMap' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ voice, quietHours, ecoMode, repeatClean, brokenClean, carpetMode }),
    ).to.throw(ArgumentNotProvidedException, `Property 'historyMap' for DeviceSettings not provided`);
  });

  it("should throw an error when 'historyMap' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ voice, quietHours, ecoMode, repeatClean, brokenClean, carpetMode, historyMap: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'historyMap' for DeviceSettings is not a DeviceSetting`,
    );
  });
});
