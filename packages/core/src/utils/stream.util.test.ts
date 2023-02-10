import { AssertionError } from "assert";
import { Readable } from "stream";
import { expect } from "chai";
import { describe, it } from "mocha";
import { BufferWriter } from "../streams/buffer-writer.stream";
import {
  readWord,
  readShort,
  readByte,
  readLong,
  readFloat,
  readString,
  writeWord,
  writeShort,
  writeByte,
  writeLong,
  writeFloat,
  writeString,
} from "./stream.util";

declare module "mocha" {
  interface Context {
    writer: BufferWriter;
  }
}

describe("stream.util", () => {
  describe("read", () => {
    describe("readWord", () => {
      it("reads a word from a stream", () => {
        const stream = Readable.from(Buffer.from("0102030405060708", "hex"), {
          objectMode: false,
        });

        const ret = readWord(stream);

        expect(ret.toString(16)).to.be.equal("4030201");
      });

      it("throws an error when stream has not enough data", () => {
        const stream = Readable.from(Buffer.alloc(0), {
          objectMode: false,
        });

        expect(() => {
          readWord(stream);
        }).to.throw(AssertionError);
      });
    });

    describe("readShort", () => {
      it("reads a word from a stream", () => {
        const stream = Readable.from(Buffer.from("0102030405060708", "hex"), {
          objectMode: false,
        });

        const ret = readShort(stream);

        expect(ret.toString(16)).to.be.equal("201");
      });

      it("throws an error when stream has not enough data", () => {
        const stream = Readable.from(Buffer.alloc(0), {
          objectMode: false,
        });

        expect(() => {
          readShort(stream);
        }).to.throw(AssertionError);
      });
    });

    describe("readByte", () => {
      it("reads a word from a stream", () => {
        const stream = Readable.from(Buffer.from("0102030405060708", "hex"), {
          objectMode: false,
        });

        const ret = readByte(stream);

        expect(ret.toString(16)).to.be.equal("1");
      });

      it("throws an error when stream has not enough data", () => {
        const stream = Readable.from(Buffer.alloc(0), {
          objectMode: false,
        });

        expect(() => {
          readByte(stream);
        }).to.throw(AssertionError);
      });
    });

    describe("readLong", () => {
      it("reads a word from a stream", () => {
        const stream = Readable.from(
          Buffer.from("01020304050607080910", "hex"),
          {
            objectMode: false,
          }
        );

        const ret = readLong(stream);

        expect(ret.toString(16)).to.be.equal("807060504030201");
      });

      it("throws an error when stream has not enough data", () => {
        const stream = Readable.from(Buffer.alloc(0), {
          objectMode: false,
        });

        expect(() => {
          readLong(stream);
        }).to.throw(AssertionError);
      });
    });

    describe("readFloat", () => {
      it("reads a word from a stream", () => {
        const stream = Readable.from(Buffer.from("0000c03f0000c03f", "hex"), {
          objectMode: false,
        });

        const ret = readFloat(stream);

        expect(ret).to.be.equal(1.5);
      });

      it("throws an error when stream has not enough data", () => {
        const stream = Readable.from(Buffer.alloc(0), {
          objectMode: false,
        });

        expect(() => {
          readFloat(stream);
        }).to.throw(AssertionError);
      });
    });

    describe("readString", () => {
      it("reads a word from a stream", () => {
        const stream = Readable.from(Buffer.from("046162636465666768", "hex"), {
          objectMode: false,
        });

        const ret = readString(stream);

        expect(ret).to.be.equal("abcd");
      });

      it("reads an empty word", () => {
        const stream = Readable.from(Buffer.from("00000000", "hex"), {
          objectMode: false,
        });

        const ret = readString(stream);

        expect(ret).to.be.equal("");
      });

      it("throws an error when stream has not enough data", () => {
        const stream = Readable.from(Buffer.alloc(0), {
          objectMode: false,
        });

        expect(() => {
          readString(stream);
        }).to.throw(AssertionError);
      });
    });
  });
  describe("write", () => {
    beforeEach(function () {
      this.writer = new BufferWriter();
    });

    it("writes a word to a stream", function () {
      writeWord(this.writer, 0x01020304);

      expect(this.writer.buffer.toString("hex")).to.be.equal("04030201");
    });

    it("writes a short to a stream", function () {
      writeShort(this.writer, 0x0102);

      expect(this.writer.buffer.toString("hex")).to.be.equal("0201");
    });

    it("writes a byte to a stream", function () {
      writeByte(this.writer, 0x01);

      expect(this.writer.buffer.toString("hex")).to.be.equal("01");
    });

    it("writes a long to a stream", function () {
      writeLong(this.writer, BigInt("0x0807060504030201"));

      expect(this.writer.buffer.toString("hex")).to.be.equal(
        "0102030405060708"
      );
    });

    it("writes a float to a stream", function () {
      writeFloat(this.writer, 1.5);

      expect(this.writer.buffer.toString("hex")).to.be.equal("0000c03f");
    });

    it("writes a string to a stream", function () {
      writeString(this.writer, "abcd");

      expect(this.writer.buffer.toString("hex")).to.be.equal("0461626364");
    });
  });
});
