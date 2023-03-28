import { ArgumentInvalidException, ArgumentNotProvidedException, Command, ID } from '@agnoc/toolkit';
import { expect } from 'chai';
import { givenSomeQuietHoursSettingProps } from '../test-support';
import { QuietHoursSetting } from '../value-objects/quiet-hours-setting.value-object';
import { SetDeviceQuietHoursCommand } from './set-device-quiet-hours.command';
import type { SetDeviceQuietHoursCommandInput } from './set-device-quiet-hours.command';

describe('SetDeviceQuietHoursCommand', function () {
  it('should be created', function () {
    const input = givenASetDeviceQuietHoursCommandInput();
    const command = new SetDeviceQuietHoursCommand(input);

    expect(command).to.be.instanceOf(Command);
    expect(command.deviceId).to.be.equal(input.deviceId);
    expect(command.quietHours).to.be.equal(input.quietHours);
  });

  it("should throw an error when 'deviceId' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetDeviceQuietHoursCommand({ ...givenASetDeviceQuietHoursCommandInput(), deviceId: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'deviceId' for SetDeviceQuietHoursCommand not provided`);
  });

  it("should throw an error when 'deviceId' is not an ID", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetDeviceQuietHoursCommand({ ...givenASetDeviceQuietHoursCommandInput(), deviceId: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'deviceId' of SetDeviceQuietHoursCommand is not an instance of ID`,
    );
  });

  it("should throw an error when 'quietHours' is not provided", function () {
    expect(
      // @ts-expect-error - missing property
      () => new SetDeviceQuietHoursCommand({ ...givenASetDeviceQuietHoursCommandInput(), quietHours: undefined }),
    ).to.throw(ArgumentNotProvidedException, `Property 'quietHours' for SetDeviceQuietHoursCommand not provided`);
  });

  it("should throw an error when 'quietHours' is not an QuietHoursSetting", function () {
    expect(
      // @ts-expect-error - invalid property
      () => new SetDeviceQuietHoursCommand({ ...givenASetDeviceQuietHoursCommandInput(), quietHours: 'foo' }),
    ).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'quietHours' of SetDeviceQuietHoursCommand is not an instance of QuietHoursSetting`,
    );
  });
});

function givenASetDeviceQuietHoursCommandInput(): SetDeviceQuietHoursCommandInput {
  return { deviceId: ID.generate(), quietHours: new QuietHoursSetting(givenSomeQuietHoursSettingProps()) };
}
