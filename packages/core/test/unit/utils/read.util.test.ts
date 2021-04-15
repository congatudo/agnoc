import { describe, it } from "mocha";
import { expect } from "chai";
import { Readable } from "stream";
import {
  readByte,
  readFloat,
  readLong,
  readShort,
  readString,
  readWord,
} from "@agnoc/core/utils/read.util";
import { AssertionError } from "assert";

describe("read.util", () => {
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
      const stream = Readable.from(Buffer.from("01020304050607080910", "hex"), {
        objectMode: false,
      });

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
