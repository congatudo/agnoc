import { Command } from "commander";
import { version } from "../package.json";
import { decode } from "./commands/decode.command";
import { encode } from "./commands/encode.command";
import { read } from "./commands/read.command";

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

program.name("agnoc").version(version);

program
  .command("decode <file>")
  .description("decode a flow file from binary to stdout", {
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
  .description("read and decode a pcap file to stdout", {
    file: "file to read, use '-' to read from stdin.",
  })
  .option("-j, --json", "json output")
  .action((file, options) =>
    read(file, {
      ...options,
      ...stdio,
    })
  );

program.addHelpCommand("help [command]", "display help for command");

program.parse(process.argv);
