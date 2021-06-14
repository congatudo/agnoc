import { BufferWriter } from "@agnoc/core/streams/buffer-writer.stream";
import { writeWord } from "@agnoc/core/utils/stream.util";
import { Socket } from "net";
import { debug as debugFactory } from "@agnoc/core/utils/debug.util";

function buildHeaders() {
  const stream = new BufferWriter();

  writeWord(stream, 1364758872);
  writeWord(stream, 0);
  writeWord(stream, 101);
  writeWord(stream, 84);
  writeWord(stream, 0);

  return stream.buffer;
}

function str(str: string, size: number) {
  const buffer = Buffer.alloc(size);

  buffer.write(str);

  return buffer;
}

function buildPayload(ssid: string, pass: string) {
  const stream = new BufferWriter();

  stream.write(str(ssid, 32));
  stream.write(str(pass, 48));

  writeWord(stream, 290826);

  return stream.buffer;
}

interface WlanConfigOptions {
  timeout: number;
}

export function wlanConfig(
  ssid: string,
  pass: string,
  { timeout }: WlanConfigOptions
): Promise<void> {
  return new Promise((resolve, reject) => {
    const debug = debugFactory("wlan:config");
    const socket = new Socket();
    const gateway = "192.168.5.1";
    const port = 6008;

    socket.on("data", (data) => {
      debug(`Received data: ${data.toString("hex")}`);
      socket.end();
      resolve();
    });

    socket.on("connect", () => {
      debug("Sending wifi headers...");
      socket.write(buildHeaders());
      debug("Sending wifi payload...");
      socket.write(buildPayload(ssid, pass));
    });

    socket.on("error", (e) => {
      reject(e);
    });

    socket.on("timeout", () => {
      socket.destroy(new Error("Timeout connecting to robot."));
    });

    socket.setTimeout(timeout);
    socket.connect({
      host: gateway,
      port,
      family: 4,
    });

    debug(`Connecting to robot at ${gateway}`);
  });
}
