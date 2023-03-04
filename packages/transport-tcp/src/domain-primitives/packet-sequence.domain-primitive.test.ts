import { ArgumentInvalidException } from '@agnoc/toolkit';
import { expect } from 'chai';
import { PacketSequence } from './packet-sequence.domain-primitive';

describe('PacketSequence', function () {
  it('should be created', function () {
    const packetSequence = new PacketSequence(1n);

    expect(packetSequence).to.be.instanceOf(PacketSequence);
    expect(packetSequence.value).to.be.equal(1n);
  });

  it("should throw an error when 'value' is not a bigint", function () {
    // @ts-expect-error - invalid value
    expect(() => new PacketSequence('foo')).to.throw(
      ArgumentInvalidException,
      `Value 'foo' for property 'value' of PacketSequence is not a bigint`,
    );
  });

  describe('#generate()', function () {
    it('generates random packet sequence', function () {
      const packetSequence = PacketSequence.generate();

      expect(packetSequence).to.be.instanceof(PacketSequence);
    });
  });

  describe('#toString()', function () {
    it('returns string representation of packet sequence', function () {
      const packetSequence = new PacketSequence(1024n);

      expect(packetSequence.toString()).to.be.equal('400');
    });
  });

  describe('#toJSON()', function () {
    it('returns string representation of packet sequence', function () {
      const packetSequence = new PacketSequence(1024n);

      expect(packetSequence.toJSON()).to.be.equal('400');
    });
  });

  describe('#fromString()', function () {
    it('returns packet sequence from string', function () {
      const packetSequence = PacketSequence.fromString('400');

      expect(packetSequence).to.be.instanceof(PacketSequence);
      expect(packetSequence.value).to.be.equal(1024n);
    });
  });
});
