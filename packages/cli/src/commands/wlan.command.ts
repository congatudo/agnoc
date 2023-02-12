import cli from 'cli-ux';
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
  await cli.anykey('Put your robot in AP mode and press any key to continue');

  cli.action.start('Checking current connection');
  const currentNetworks = await wifi.getCurrentConnections();
  cli.action.stop();

  let ap = currentNetworks.find(isCongaAP);

  if (!ap) {
    cli.action.start('Looking for robot AP');

    do {
      const networks = await wifi.scan();

      ap = networks.find(isCongaAP);

      if (!ap) {
        await timeout(1000);
      }
    } while (!ap);

    cli.action.stop();

    cli.action.start('Connecting to robot AP');
    await wifi.connect({ ssid: ap.ssid });
    cli.action.stop();

    cli.action.start('Checking current connection');
    const currentNetworks = await wifi.getCurrentConnections();
    cli.action.stop();

    if (!currentNetworks.find(isCongaAP)) {
      throw new Error('Unable to connect to robot AP');
    }
  }

  cli.action.start('Configuring wifi settings in the robot');
  await wlanConfig(ssid, pass, { timeout: Number(options.timeout) });
  cli.action.stop();
}
