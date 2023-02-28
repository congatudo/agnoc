import chalk from 'chalk';
import cliUx from 'cli-ux';
import { Command } from 'commander';
import { version } from '../package.json';
import { decode } from './commands/decode.command';
import { encode } from './commands/encode.command';
import { read } from './commands/read.command';
import { wlanConfig } from './commands/wlan-config.command';
import { wlan } from './commands/wlan.command';

process.on('unhandledRejection', (e) => {
  console.error(e);
  // eslint-disable-next-line no-process-exit
  process.exit(1);
});

const program = new Command();
const stdio = {
  stdin: process.stdin,
  stdout: process.stdout,
  stderr: process.stderr,
};

function handleError(e: Error): void {
  cliUx.action.stop(chalk.red('!'));
  stdio.stderr.write(chalk.red(e.message + '\n'));
}

program.name('agnoc').version(version as string);

program
  .command('decode')
  .description('decodes a flow file from binary to stdout')
  .argument('<file>', "file to decode, use '-' to read from stdin.")
  .option('-j, --json', 'json output')
  .action((file: string, options: { json: true | undefined }) =>
    decode(file, {
      ...options,
      ...stdio,
    }),
  );

program
  .command('encode')
  .description('encode a json file to binary to stdout')
  .argument('<file>', "file to encode, use '-' to read from stdin.")
  .action((file: string) =>
    encode(file, {
      ...stdio,
    }),
  );

program
  .command('read')
  .description('reads and decodes a pcap file to stdout')
  .argument('<file>', "file to read, use '-' to read from stdin.")
  .option('-j, --json', 'json output')
  .action((file: string, options: { json: true | undefined }) =>
    read(file, {
      ...options,
      ...stdio,
    }),
  );

interface WlanCommandOptions {
  iface: string | undefined;
  timeout: string | undefined;
}

program
  .command('wlan')
  .description('connects and configures robot wlan')
  .argument('<ssid>', 'wifi ssid')
  .argument('<password>', 'wifi password')
  .option('-i, --iface <iface>', 'network interface used to connect')
  .option('-t, --timeout <timeout>', 'connect timeout in milliseconds', '10000')
  .action((ssid: string, password: string, { iface, timeout }: WlanCommandOptions) =>
    wlan(ssid, password, {
      iface: iface ?? null,
      timeout: Number(timeout),
    }).catch(handleError),
  );

interface WlanConfigCommandOptions {
  timeout: string | undefined;
}

program
  .command('wlan:config')
  .description('configures robot wlan')
  .argument('<ssid>', 'wifi ssid')
  .argument('<password>', 'wifi password')
  .option('-t, --timeout <timeout>', 'connect timeout in milliseconds', '10000')
  .action(async (ssid: string, password: string, { timeout }: WlanConfigCommandOptions) => {
    cliUx.action.start('Configuring wifi settings in the robot');
    await wlanConfig(ssid, password, { timeout: Number(timeout) }).catch(handleError);
    cliUx.action.stop();
  });

program.addHelpCommand('help [command]', 'display help for command');

program.parse(process.argv);
