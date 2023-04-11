/* istanbul ignore file */
import { tmpdir } from 'node:os';
import path from 'node:path';
import { start as startREPL } from 'node:repl';
import { TCPServer } from '@agnoc/adapter-tcp';
import { AgnocServer } from '@agnoc/core';
import {
  PayloadDataParserService,
  getProtobufRoot,
  PacketMapper,
  getCustomDecoders,
  PayloadMapper,
} from '@agnoc/transport-tcp';
import chalk from 'chalk';
import cliUx from 'cli-ux';
import { Command } from 'commander';
import wifi from 'node-wifi';
import { DecodeCommand } from './commands/decode.command';
import { EncodeCommand } from './commands/encode.command';
import { ReadCommand } from './commands/read.command';
import { REPLCommand } from './commands/repl.command';
import { WlanConfigCommand } from './commands/wlan-config.command';
import { WlanCommand } from './commands/wlan.command';
import type { Stdio } from './interfaces/stdio';

export function main(): void {
  process.on('unhandledRejection', (e) => {
    console.error(e);
    // eslint-disable-next-line no-process-exit
    process.exit(1);
  });

  // eslint-disable-next-line node/no-missing-require, @typescript-eslint/no-var-requires
  const pkg = require('../package.json') as { version: string };
  const program = new Command();
  const stdio: Stdio = {
    stdin: process.stdin,
    stdout: process.stdout,
    stderr: process.stderr,
  };

  const payloadMapper = new PayloadMapper(new PayloadDataParserService(getProtobufRoot(), getCustomDecoders()));
  const packetMapper = new PacketMapper(payloadMapper);
  const decodeCommand = new DecodeCommand(stdio, packetMapper);
  const readCommand = new ReadCommand(stdio, packetMapper);
  const encodeCommand = new EncodeCommand(stdio, packetMapper);
  const wlanConfigCommand = new WlanConfigCommand('192.168.5.1', 6008);
  const wlanCommand = new WlanCommand(cliUx, wifi, wlanConfigCommand);
  const agnocServer = new AgnocServer();

  agnocServer.buildAdapter(
    (container) =>
      new TCPServer(
        container.deviceRepository,
        container.connectionRepository,
        container.domainEventHandlerRegistry,
        container.commandQueryHandlerRegistry,
      ),
  );

  function handleError(e: Error): void {
    cliUx.action.stop(chalk.red('!'));
    stdio.stderr.write(chalk.red(e.message + '\n'));
  }

  program.name('agnoc').version(pkg.version);

  program
    .command('decode')
    .description('decodes a flow file from binary to stdout')
    .argument('<file>', "file to decode, use '-' to read from stdin.")
    .option('-j, --json', 'json output')
    .action((file: string, options: { json: true | undefined }) =>
      decodeCommand.action(file, {
        json: options.json ?? false,
      }),
    );

  program
    .command('encode')
    .description('encode a json file to binary to stdout')
    .argument('<file>', "file to encode, use '-' to read from stdin.")
    .action((file: string) => encodeCommand.action(file));

  program
    .command('read')
    .description('reads and decodes a pcap file to stdout')
    .argument('<file>', "file to read, use '-' to read from stdin.")
    .option('-j, --json', 'json output')
    .action((file: string, options: { json: true | undefined }) =>
      readCommand.action(file, {
        json: options.json ?? false,
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
      wlanCommand
        .action(ssid, password, {
          iface: iface ?? null,
          timeout: Number(timeout),
        })
        .catch(handleError),
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
      await wlanConfigCommand.action(ssid, password, { timeout: Number(timeout) }).catch(handleError);
      cliUx.action.stop();
    });

  program
    .command('repl')
    .description('start a REPL with a server listening for connections')
    .option('-t, --history <history>', 'file to store the REPL history.', path.join(tmpdir(), 'agnoc-repl-history'))
    .action(({ history }: { history: string }) => {
      const repl = startREPL({ prompt: 'agnoc> ' });
      const replCommand = new REPLCommand(agnocServer, repl);

      return replCommand.action({
        historyFilename: history,
      });
    });

  program.addHelpCommand('help [command]', 'display help for command');

  program.parse(process.argv);
}
