import { DeviceCapability, DeviceMode, DeviceModeValue } from '@agnoc/domain';
import { ArgumentInvalidException, DomainException } from '@agnoc/toolkit';
import { anything, capture, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { DeviceModeChangerService } from './device-mode-changer.service';
import type { PacketConnection } from '../aggregate-roots/packet-connection.aggregate-root';
import type { PacketMessage } from '../objects/packet.message';
import type { Device, DeviceSystem } from '@agnoc/domain';
import type { WaiterService } from '@agnoc/toolkit';

describe('DeviceModeChangerService', function () {
  let waiterService: WaiterService;
  let service: DeviceModeChangerService;
  let packetConnection: PacketConnection;
  let device: Device;
  let packetMessage: PacketMessage;

  beforeEach(function () {
    waiterService = imock();
    service = new DeviceModeChangerService(instance(waiterService));
    packetConnection = imock();
    device = imock();
    packetMessage = imock();
  });

  describe('#changeMode()', function () {
    describe('to None', function () {
      it('should do nothing when the mode is already none', async function () {
        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.None));

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.None));

        verify(packetConnection.assertDevice()).once();
        verify(packetConnection.sendAndWait(anything(), anything())).never();
      });

      it('should change device mode to none', async function () {
        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenResolve();

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.None));

        const [callback] = capture(waiterService.waitFor).first();

        expect(callback()).to.be.false;

        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.None));

        expect(callback()).to.be.true;

        verify(packetConnection.assertDevice()).once();
        verify(
          packetConnection.sendAndWait(
            'DEVICE_AUTO_CLEAN_REQ',
            deepEqual({
              ctrlValue: 0,
              cleanType: 2,
            }),
          ),
        ).once();
        verify(packetMessage.assertPayloadName('DEVICE_AUTO_CLEAN_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });

      it('should throw an error when device mode change times out', async function () {
        when(packetConnection.device).thenReturn(instance(device));
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenReject(new Error('Timeout'));

        await expect(
          service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.None)),
        ).to.be.rejectedWith(DomainException, `Unable to change device mode from 'Unknown' to 'None'`);

        verify(packetConnection.assertDevice()).once();
        verify(
          packetConnection.sendAndWait(
            'DEVICE_AUTO_CLEAN_REQ',
            deepEqual({
              ctrlValue: 0,
              cleanType: 2,
            }),
          ),
        ).once();
        verify(packetMessage.assertPayloadName('DEVICE_AUTO_CLEAN_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });
    });

    describe('to Spot', function () {
      it('should do nothing when the mode is already spot', async function () {
        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Spot));

        verify(packetConnection.assertDevice()).once();
        verify(packetConnection.sendAndWait(anything(), anything())).never();
      });

      it('should change device mode to spot on device with map plans support', async function () {
        const deviceSystem: DeviceSystem = imock();

        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));
        when(device.system).thenReturn(instance(deviceSystem));
        when(deviceSystem.supports(anything())).thenReturn(true);
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenResolve();

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Spot));

        const [callback] = capture(waiterService.waitFor).first();

        expect(callback()).to.be.false;

        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));

        expect(callback()).to.be.true;

        verify(packetConnection.assertDevice()).once();
        verify(deviceSystem.supports(DeviceCapability.MAP_PLANS)).once();
        verify(packetConnection.sendAndWait('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', deepEqual({ mask: 0x7aff }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });

      it('should change device mode to spot on device without map plans support', async function () {
        const deviceSystem: DeviceSystem = imock();

        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));
        when(device.system).thenReturn(instance(deviceSystem));
        when(deviceSystem.supports(anything())).thenReturn(false);
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenResolve();

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Spot));

        const [callback] = capture(waiterService.waitFor).first();

        expect(callback()).to.be.false;

        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Spot));

        expect(callback()).to.be.true;

        verify(packetConnection.assertDevice()).once();
        verify(deviceSystem.supports(DeviceCapability.MAP_PLANS)).once();
        verify(packetConnection.sendAndWait('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', deepEqual({ mask: 0x2ff }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });

      it('should throw an error when device mode change times out', async function () {
        const deviceSystem: DeviceSystem = imock();

        when(packetConnection.device).thenReturn(instance(device));
        when(device.system).thenReturn(instance(deviceSystem));
        when(deviceSystem.supports(anything())).thenReturn(true);
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenReject(new Error('Timeout'));

        await expect(
          service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Spot)),
        ).to.be.rejectedWith(DomainException, `Unable to change device mode from 'Unknown' to 'Spot'`);

        verify(packetConnection.assertDevice()).once();
        verify(packetConnection.sendAndWait('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', deepEqual({ mask: 0x7aff }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });
    });

    describe('to Zone', function () {
      it('should do nothing when the mode is already zone', async function () {
        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Zone));

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Zone));

        verify(packetConnection.assertDevice()).once();
        verify(packetConnection.sendAndWait(anything(), anything())).never();
      });

      it('should change device mode to zone on device with map plans support', async function () {
        const deviceSystem: DeviceSystem = imock();

        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));
        when(device.system).thenReturn(instance(deviceSystem));
        when(deviceSystem.supports(anything())).thenReturn(true);
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenResolve();

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Zone));

        const [callback] = capture(waiterService.waitFor).first();

        expect(callback()).to.be.false;

        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Zone));

        expect(callback()).to.be.true;

        verify(packetConnection.assertDevice()).once();
        verify(deviceSystem.supports(DeviceCapability.MAP_PLANS)).once();
        verify(packetConnection.sendAndWait('DEVICE_AREA_CLEAN_REQ', deepEqual({ ctrlValue: 0 }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_AREA_CLEAN_RSP')).once();
        verify(packetConnection.sendAndWait('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', deepEqual({ mask: 0x79ff }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });

      it('should change device mode to zone on device without map plans support', async function () {
        const deviceSystem: DeviceSystem = imock();

        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));
        when(device.system).thenReturn(instance(deviceSystem));
        when(deviceSystem.supports(anything())).thenReturn(false);
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenResolve();

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Zone));

        const [callback] = capture(waiterService.waitFor).first();

        expect(callback()).to.be.false;

        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Zone));

        expect(callback()).to.be.true;

        verify(packetConnection.assertDevice()).once();
        verify(deviceSystem.supports(DeviceCapability.MAP_PLANS)).once();
        verify(packetConnection.sendAndWait('DEVICE_AREA_CLEAN_REQ', deepEqual({ ctrlValue: 0 }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_AREA_CLEAN_RSP')).once();
        verify(packetConnection.sendAndWait('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', deepEqual({ mask: 0x1ff }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });

      it('should throw an error when device mode change times out', async function () {
        const deviceSystem: DeviceSystem = imock();

        when(packetConnection.device).thenReturn(instance(device));
        when(device.system).thenReturn(instance(deviceSystem));
        when(deviceSystem.supports(anything())).thenReturn(true);
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenReject(new Error('Timeout'));

        await expect(
          service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Zone)),
        ).to.be.rejectedWith(DomainException, `Unable to change device mode from 'Unknown' to 'Zone'`);

        verify(packetConnection.assertDevice()).once();
        verify(packetConnection.sendAndWait('DEVICE_AREA_CLEAN_REQ', deepEqual({ ctrlValue: 0 }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_AREA_CLEAN_RSP')).once();
        verify(packetConnection.sendAndWait('DEVICE_MAPID_GET_GLOBAL_INFO_REQ', deepEqual({ mask: 0x79ff }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_MAPID_GET_GLOBAL_INFO_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });
    });

    describe('to Mop', function () {
      it('should do nothing when the mode is already mop', async function () {
        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Mop));

        verify(packetConnection.assertDevice()).once();
        verify(packetConnection.sendAndWait(anything(), anything())).never();
      });

      it('should change device mode to mop', async function () {
        when(packetConnection.device).thenReturn(instance(device));
        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.None));
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenResolve();

        await service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Mop));

        const [callback] = capture(waiterService.waitFor).first();

        expect(callback()).to.be.false;

        when(device.mode).thenReturn(new DeviceMode(DeviceModeValue.Mop));

        expect(callback()).to.be.true;

        verify(packetConnection.assertDevice()).once();
        verify(packetConnection.sendAndWait('DEVICE_MAPID_INTO_MODEIDLE_INFO_REQ', deepEqual({ mode: 7 }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_MAPID_INTO_MODEIDLE_INFO_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });

      it('should throw an error when device mode change times out', async function () {
        when(packetConnection.device).thenReturn(instance(device));
        when(packetConnection.sendAndWait(anything(), anything())).thenResolve(instance(packetMessage));
        when(waiterService.waitFor(anything(), anything())).thenReject(new Error('Timeout'));

        await expect(
          service.changeMode(instance(packetConnection), new DeviceMode(DeviceModeValue.Mop)),
        ).to.be.rejectedWith(DomainException, `Unable to change device mode from 'Unknown' to 'Mop'`);

        verify(packetConnection.assertDevice()).once();
        verify(packetConnection.sendAndWait('DEVICE_MAPID_INTO_MODEIDLE_INFO_REQ', deepEqual({ mode: 7 }))).once();
        verify(packetMessage.assertPayloadName('DEVICE_MAPID_INTO_MODEIDLE_INFO_RSP')).once();
        verify(waiterService.waitFor(anything(), deepEqual({ timeout: 5000 }))).once();
      });
    });

    it('should thrown an error when the mode is not supported', async function () {
      const deviceMode: DeviceMode = imock();

      when(deviceMode.equals(anything())).thenReturn(false);
      when(deviceMode.value).thenReturn('Unknown' as DeviceModeValue);

      await expect(service.changeMode(instance(packetConnection), instance(deviceMode))).to.be.rejectedWith(
        ArgumentInvalidException,
        `Value 'Unknown' is not supported in DeviceModeChangerService`,
      );
    });
  });
});
