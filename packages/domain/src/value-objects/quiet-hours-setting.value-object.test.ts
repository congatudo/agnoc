import { ValueObject, ArgumentNotProvidedException, ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeQuietHoursSettingProps } from '../test-support';
import { QuietHoursSetting } from './quiet-hours-setting.value-object';

describe('QuietHoursSetting', function () {
  it('should be created', function () {
    const quietHoursSettingProps = givenSomeQuietHoursSettingProps();
    const quietHoursSetting = new QuietHoursSetting(quietHoursSettingProps);

    expect(quietHoursSetting).to.be.instanceOf(ValueObject);
    expect(quietHoursSetting.isEnabled).to.be.equal(quietHoursSettingProps.isEnabled);
    expect(quietHoursSetting.beginTime).to.be.equal(quietHoursSettingProps.beginTime);
    expect(quietHoursSetting.endTime).to.be.equal(quietHoursSettingProps.endTime);
  });

  it("should throw an error when 'isEnabled' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new QuietHoursSetting({ ...givenSomeQuietHoursSettingProps(), isEnabled: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'isEnabled' for QuietHoursSetting not provided`,
    );
  });

  it("should throw an error when 'isEnabled' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new QuietHoursSetting({ ...givenSomeQuietHoursSettingProps(), isEnabled: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'isEnabled' for QuietHoursSetting is not a boolean`,
    );
  });

  it("should throw an error when 'beginTime' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new QuietHoursSetting({ ...givenSomeQuietHoursSettingProps(), beginTime: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'beginTime' for QuietHoursSetting not provided`,
    );
  });

  it("should throw an error when 'beginTime' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new QuietHoursSetting({ ...givenSomeQuietHoursSettingProps(), beginTime: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'beginTime' for QuietHoursSetting is not a DeviceTime`,
    );
  });

  it("should throw an error when 'endTime' property is not provided", function () {
    // @ts-expect-error - missing property
    expect(() => new QuietHoursSetting({ ...givenSomeQuietHoursSettingProps(), endTime: undefined })).to.throw(
      ArgumentNotProvidedException,
      `Property 'endTime' for QuietHoursSetting not provided`,
    );
  });

  it("should throw an error when 'endTime' property is invalid", function () {
    // @ts-expect-error - invalid property
    expect(() => new QuietHoursSetting({ ...givenSomeQuietHoursSettingProps(), endTime: 'foo' })).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'endTime' for QuietHoursSetting is not a DeviceTime`,
    );
  });
});
