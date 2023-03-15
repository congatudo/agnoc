import { anything, deepEqual, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { WlanCommand } from './wlan.command';
import type { WlanConfigCommand } from './wlan-config.command';
import type { CliUx, Wifi } from './wlan.command';
import type { Network } from 'node-wifi';

describe('WlanCommand', function () {
  let cliUx: CliUx;
  let cliUxAction: CliUx['action'];
  let wifi: Wifi;
  let wlanConfigCommand: WlanConfigCommand;
  let wlanCommand: WlanCommand;

  beforeEach(function () {
    cliUx = imock();
    cliUxAction = imock();
    wifi = imock();
    wlanConfigCommand = imock();
    wlanCommand = new WlanCommand(instance(cliUx), instance(wifi), instance(wlanConfigCommand));

    when(cliUx.anykey(anything())).thenResolve();
    when(cliUx.action).thenReturn(instance(cliUxAction));
    when(cliUxAction.start(anything())).thenReturn();
    when(cliUxAction.stop()).thenReturn();
  });

  it('should configure wlan when current wifi is a conga access point', async function () {
    const network = { ...givenANetwork(), ssid: 'CongaLaser-123' };

    when(wifi.init(anything())).thenResolve();
    when(wifi.getCurrentConnections()).thenResolve([network]);
    when(wlanConfigCommand.action(anything(), anything(), anything())).thenResolve();

    await wlanCommand.action('ssid', 'pass', { timeout: 1000, iface: 'wlan0' });

    verify(wifi.init(deepEqual({ iface: 'wlan0' }))).once();
    verify(wifi.getCurrentConnections()).once();
    verify(wifi.scan()).never();
    verify(wifi.connect(anything())).never();
    verify(wlanConfigCommand.action('ssid', 'pass', deepEqual({ timeout: 1000 }))).once();
  });

  it('should scan and connect to a conga access point', async function () {
    const otherNetwork = givenANetwork();
    const congaNetwork = { ...givenANetwork(), ssid: 'CongaLaser-123' };

    when(wifi.init(anything())).thenResolve();
    when(wifi.getCurrentConnections()).thenResolve([otherNetwork]).thenResolve([congaNetwork]);
    when(wifi.scan()).thenResolve([otherNetwork, congaNetwork]);
    when(wifi.connect(anything())).thenResolve();
    when(wlanConfigCommand.action(anything(), anything(), anything())).thenResolve();

    await wlanCommand.action('ssid', 'pass', { timeout: 1000, iface: 'wlan0' });

    verify(wifi.init(deepEqual({ iface: 'wlan0' }))).once();
    verify(wifi.getCurrentConnections()).twice();
    verify(wifi.scan()).once();
    verify(wifi.connect(deepEqual({ ssid: 'CongaLaser-123' }))).once();
    verify(wlanConfigCommand.action('ssid', 'pass', deepEqual({ timeout: 1000 }))).once();
  });

  it('should throw an error when cannot connect to a conga access point', async function () {
    const otherNetwork = givenANetwork();
    const congaNetwork = { ...givenANetwork(), ssid: 'CongaLaser-123' };

    when(wifi.init(anything())).thenResolve();
    when(wifi.getCurrentConnections()).thenResolve([otherNetwork]);
    when(wifi.scan()).thenResolve([otherNetwork, congaNetwork]);
    when(wifi.connect(anything())).thenResolve();
    when(wlanConfigCommand.action(anything(), anything(), anything())).thenResolve();

    await expect(wlanCommand.action('ssid', 'pass', { timeout: 1000, iface: 'wlan0' })).to.be.rejectedWith(
      Error,
      'Unable to connect to robot AP',
    );

    verify(wifi.init(deepEqual({ iface: 'wlan0' }))).once();
    verify(wifi.getCurrentConnections()).twice();
    verify(wifi.scan()).once();
    verify(wifi.connect(deepEqual({ ssid: 'CongaLaser-123' }))).once();
    verify(wlanConfigCommand.action('ssid', 'pass', deepEqual({ timeout: 1000 }))).never();
  });
});

function givenANetwork(): Network {
  return {
    ssid: 'ssid',
    bssid: 'bssid',
    mac: 'mac',
    channel: 1,
    frequency: 1,
    signal_level: 1,
    quality: 1,
    security: 'security',
    security_flags: 'security_flags',
    mode: 'mode',
  };
}
