import { describe, it } from "mocha";
import { expect } from "chai";
import { decode } from "../../../src/commands/decode.command";
import { Duplex, PassThrough } from "stream";
import mockFS from "mock-fs";
import { readStream } from "../../helpers/read-stream.helper";

declare module "mocha" {
  interface Context {
    buffer: Buffer;
    stdio: {
      stdin: Duplex;
      stdout: Duplex;
      stderr: Duplex;
    };
  }
}

describe("decode", () => {
  beforeEach(function () {
    this.buffer = Buffer.from(
      "2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c",
      "hex"
    );

    this.stdio = {
      stdin: new PassThrough(),
      stdout: new PassThrough(),
      stderr: new PassThrough(),
    };

    mockFS({
      "example.bin": this.buffer,
    });
  });

  afterEach(function () {
    mockFS.restore();
  });

  it("decodes a tcp flow from stdin", async function () {
    decode("-", { ...this.stdio, json: undefined });

    this.stdio.stdin.write(this.buffer);
    this.stdio.stdin.end();

    const data = await readStream(this.stdio.stdout);

    expect(data).to.be.equal(
      '[id: 7a479a0fbb978c12] [ctype: 2] [flow: 1] [userId: 2] [deviceId: 1] [opcode: DEVICE_GETTIME_RSP] {"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}\n'
    );
  });

  it("decodes a tcp flow from stdin to json", async function () {
    decode("-", { ...this.stdio, json: true });

    this.stdio.stdin.write(this.buffer);
    this.stdio.stdin.end();

    const data = await readStream(this.stdio.stdout);

    expect(JSON.parse(data)).to.be.deep.equal([
      {
        ctype: 2,
        flow: 1,
        deviceId: 1,
        userId: 2,
        sequence: "7a479a0fbb978c12",
        payload: {
          opcode: "DEVICE_GETTIME_RSP",
          object: {
            result: 0,
            body: {
              deviceTime: 1606129555,
              deviceTimezone: 3600,
            },
          },
        },
      },
    ]);
  });

  it("decodes a tcp flow from file", async function () {
    decode("example.bin", { ...this.stdio, json: undefined });

    const data = await readStream(this.stdio.stdout);

    expect(data).to.be.equal(
      '[id: 7a479a0fbb978c12] [ctype: 2] [flow: 1] [userId: 2] [deviceId: 1] [opcode: DEVICE_GETTIME_RSP] {"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}\n'
    );
  });

  it("decodes a tcp flow from file to json", async function () {
    decode("example.bin", { ...this.stdio, json: true });

    const data = await readStream(this.stdio.stdout);

    expect(JSON.parse(data)).to.be.deep.equal([
      {
        ctype: 2,
        flow: 1,
        deviceId: 1,
        userId: 2,
        sequence: "7a479a0fbb978c12",
        payload: {
          opcode: "DEVICE_GETTIME_RSP",
          object: {
            result: 0,
            body: {
              deviceTime: 1606129555,
              deviceTimezone: 3600,
            },
          },
        },
      },
    ]);
  });
});
