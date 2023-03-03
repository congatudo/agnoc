import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeDeviceSettingsProps } from '../test-support';
import { DeviceSettings } from './device-settings.value-object';

describe('DeviceSettings', function () {
  it('should be created', function () {
    const deviceSettingsProps = givenSomeDeviceSettingsProps();
    const deviceSettings = new DeviceSettings(deviceSettingsProps);

    expect(deviceSettings).to.be.instanceOf(ValueObject);
    expect(deviceSettings.voice).to.be.equal(deviceSettingsProps.voice);
    expect(deviceSettings.quietHours).to.be.equal(deviceSettingsProps.quietHours);
    expect(deviceSettings.ecoMode).to.be.equal(deviceSettingsProps.ecoMode);
    expect(deviceSettings.repeatClean).to.be.equal(deviceSettingsProps.repeatClean);
    expect(deviceSettings.brokenClean).to.be.equal(deviceSettingsProps.brokenClean);
    expect(deviceSettings.carpetMode).to.be.equal(deviceSettingsProps.carpetMode);
    expect(deviceSettings.historyMap).to.be.equal(deviceSettingsProps.historyMap);
  });

  it("should throw an error when 'voice' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), voice: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'voice' for DeviceSettings not provided`);
  });

  it("should throw an error when 'voice' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), voice: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'voice' of DeviceSettings is not an instance of VoiceSetting`,
    );
  });

  it("should throw an error when 'quietHours' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), quietHours: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'quietHours' for DeviceSettings not provided`);
  });

  it("should throw an error when 'quietHours' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), quietHours: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'quietHours' of DeviceSettings is not an instance of QuietHoursSetting`,
    );
  });

  it("should throw an error when 'ecoMode' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), ecoMode: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'ecoMode' for DeviceSettings not provided`);
  });

  it("should throw an error when 'ecoMode' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), ecoMode: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'ecoMode' of DeviceSettings is not an instance of DeviceSetting`,
    );
  });

  it("should throw an error when 'repeatClean' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), repeatClean: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'repeatClean' for DeviceSettings not provided`);
  });

  it("should throw an error when 'repeatClean' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), repeatClean: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'repeatClean' of DeviceSettings is not an instance of DeviceSetting`,
    );
  });

  it("should throw an error when 'brokenClean' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), brokenClean: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'brokenClean' for DeviceSettings not provided`);
  });

  it("should throw an error when 'brokenClean' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), brokenClean: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'brokenClean' of DeviceSettings is not an instance of DeviceSetting`,
    );
  });

  it("should throw an error when 'carpetMode' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), carpetMode: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'carpetMode' for DeviceSettings not provided`);
  });

  it("should throw an error when 'carpetMode' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), carpetMode: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'carpetMode' of DeviceSettings is not an instance of DeviceSetting`,
    );
  });

  it("should throw an error when 'historyMap' property is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), historyMap: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'historyMap' for DeviceSettings not provided`);
  });

  it("should throw an error when 'historyMap' property is invalid", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new DeviceSettings({ ...givenSomeDeviceSettingsProps(), historyMap: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'historyMap' of DeviceSettings is not an instance of DeviceSetting`,
    );
  });
});
