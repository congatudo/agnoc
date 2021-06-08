import { BufferWriter } from "@agnoc/core/streams/buffer-writer.stream";
import { writeWord } from "@agnoc/core/utils/stream.util";
import { Socket } from "net";
import { Duplex } from "stream";

interface WlanOptions {
  stdin: Duplex;
  stdout: Duplex;
  stderr: Duplex;
}

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

export function wlan(ssid: string, pass: string, options: WlanOptions): void {
  const socket = new Socket();

  socket.on("data", () => {
    options.stdout.write(
      "Done! Check if your robot is connected to your wifi.\n"
    );
    socket.end();
  });

  socket.on("connect", () => {
    options.stdout.write("Connected! Sending wifi data...\n");
    socket.write(buildHeaders());
    socket.write(buildPayload(ssid, pass));
  });

  socket.on("error", (e) => {
    options.stderr.write(e.message + "\n");
    socket.end();
  });

  socket.on("timeout", () => {
    options.stderr.write("Timeout connecting to robot.\n");
    socket.end();
  });

  socket.setTimeout(10000);
  socket.connect({
    host: "192.168.5.1",
    port: 6008,
    family: 4,
  });

  options.stdout.write("Connecting to robot...\n");
}
