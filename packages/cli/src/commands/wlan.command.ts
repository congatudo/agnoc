import cliUx from 'cli-ux';
import wifi from 'node-wifi';
import { wlanConfig } from './wlan-config.command';
import type { Network } from 'node-wifi';

interface WlanOptions {
  timeout: number;
  iface: string | null;
}

function timeout(time: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, time));
}

function isCongaAP(network: Network): boolean {
  return Boolean(/CongaLaser/.exec(network.ssid));
}

export async function wlan(ssid: string, pass: string, options: WlanOptions): Promise<void> {
  await wifi.init({ iface: options.iface });
  await cliUx.anykey('Put your robot in AP mode and press any key to continue');

  cliUx.action.start('Checking current connection');
  const currentNetworks = await wifi.getCurrentConnections();
  cliUx.action.stop();

  let ap = currentNetworks.find(isCongaAP);

  if (!ap) {
    cliUx.action.start('Looking for robot AP');

    do {
      const networks = await wifi.scan();

      ap = networks.find(isCongaAP);

      if (!ap) {
        await timeout(1000);
      }
    } while (!ap);

    cliUx.action.stop();

    cliUx.action.start('Connecting to robot AP');
    await wifi.connect({ ssid: ap.ssid });
    cliUx.action.stop();

    cliUx.action.start('Checking current connection');
    const currentNetworks = await wifi.getCurrentConnections();
    cliUx.action.stop();

    if (!currentNetworks.find(isCongaAP)) {
      throw new Error('Unable to connect to robot AP');
    }
  }

  cliUx.action.start('Configuring wifi settings in the robot');
  await wlanConfig(ssid, pass, { timeout: Number(options.timeout) });
  cliUx.action.stop();
}
