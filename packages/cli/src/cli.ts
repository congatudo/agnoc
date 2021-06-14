import { Command } from "commander";
import { version } from "../package.json";
import { decode } from "./commands/decode.command";
import { encode } from "./commands/encode.command";
import { read } from "./commands/read.command";
import { wlan } from "./commands/wlan.command";
import { wlanConfig } from "./commands/wlan-config.command";
import cli from "cli-ux";
import chalk from "chalk";

process.on("unhandledRejection", (e) => {
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
  cli.action.stop(chalk.red("!"));
  stdio.stderr.write(chalk.red(e.message + "\n"));
}

program.name("agnoc").version(version);

program
  .command("decode <file>")
  .description("decodes a flow file from binary to stdout", {
    file: "file to decode, use '-' to read from stdin.",
  })
  .option("-j, --json", "json output")
  .action((file, options) =>
    decode(file, {
      ...options,
      ...stdio,
    })
  );

program
  .command("encode <file>")
  .description("encode a json file to binary to stdout", {
    file: "file to encode, use '-' to read from stdin.",
  })
  .action((file, options) =>
    encode(file, {
      ...options,
      ...stdio,
    })
  );

program
  .command("read <file>")
  .description("reads and decodes a pcap file to stdout", {
    file: "file to read, use '-' to read from stdin.",
  })
  .option("-j, --json", "json output")
  .action((file, options) =>
    read(file, {
      ...options,
      ...stdio,
    })
  );

program
  .command("wlan <ssid> <pass>")
  .description("connects and configures robot wlan", {
    ssid: "wifi ssid",
    pass: "wifi password",
  })
  .option("-i, --iface <iface>", "network interface used to connect")
  .option("-t, --timeout <timeout>", "connect timeout in milliseconds", "10000")
  .action((ssid, pass, options) =>
    wlan(ssid, pass, options).catch(handleError)
  );

program
  .command("wlan:config <ssid> <pass>")
  .description("configures robot wlan", {
    ssid: "wifi ssid",
    pass: "wifi password",
  })
  .option("-t, --timeout <timeout>", "connect timeout in milliseconds", "10000")
  .action(async (ssid, pass, { timeout }) => {
    cli.action.start("Configuring wifi settings in the robot");
    await wlanConfig(ssid, pass, { timeout: Number(timeout) }).catch(
      handleError
    );
    cli.action.stop();
  });

program.addHelpCommand("help [command]", "display help for command");

program.parse(process.argv);
