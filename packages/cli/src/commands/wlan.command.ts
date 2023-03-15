import { setTimeout } from 'timers/promises';
import type { WlanConfigCommand } from './wlan-config.command';
import type { Command } from '../interfaces/command';
import type { Network, ConnectOptions, InitOptions } from 'node-wifi';

interface WlanCommandOptions {
  timeout: number;
  iface: string | null;
}

export class WlanCommand implements Command {
  constructor(
    private readonly cliUx: CliUx,
    private readonly wifi: Wifi,
    private readonly wlanConfigCommand: WlanConfigCommand,
  ) {}

  async action(ssid: string, pass: string, options: WlanCommandOptions): Promise<void> {
    await this.wifi.init({ iface: options.iface });
    await this.cliUx.anykey('Put your robot in AP mode and press any key to continue');

    this.cliUx.action.start('Checking current connection');
    const currentNetworks = await this.wifi.getCurrentConnections();
    this.cliUx.action.stop();

    let ap = currentNetworks.find(isCongaAP);

    if (!ap) {
      this.cliUx.action.start('Looking for robot AP');

      do {
        const networks = await this.wifi.scan();

        ap = networks.find(isCongaAP);

        /* istanbul ignore if */
        if (!ap) {
          await setTimeout(1000);
        }
      } while (!ap);

      this.cliUx.action.stop();

      this.cliUx.action.start('Connecting to robot AP');
      await this.wifi.connect({ ssid: ap.ssid });
      this.cliUx.action.stop();

      this.cliUx.action.start('Checking current connection');
      const currentNetworks = await this.wifi.getCurrentConnections();
      this.cliUx.action.stop();

      if (!currentNetworks.find(isCongaAP)) {
        throw new Error('Unable to connect to robot AP');
      }
    }

    this.cliUx.action.start('Configuring wifi settings in the robot');
    await this.wlanConfigCommand.action(ssid, pass, { timeout: options.timeout });
    this.cliUx.action.stop();
  }
}

function isCongaAP(network: Network): boolean {
  return Boolean(/CongaLaser/.exec(network.ssid));
}

export interface CliUx {
  anykey(message: string): Promise<void>;
  action: {
    start(message: string): void;
    stop(): void;
  };
}

export interface Wifi {
  init(options: InitOptions): Promise<void>;
  getCurrentConnections(): Promise<Network[]>;
  scan(): Promise<Network[]>;
  connect(options: ConnectOptions): Promise<void>;
}
