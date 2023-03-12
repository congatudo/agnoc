import { anything, fnmock, imock, instance, verify, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { PCapReader } from './pcap-reader.stream';
import type { PCapReaderOptions } from './pcap-reader.stream';
import type { Decode, LiveSessionOptions, PacketWithHeader, PcapPacket, PcapSession } from 'pcap';

describe('TCPStream', function () {
  let createSession: PCapReaderOptions['createSession'];
  let decode: Decode;
  let file: string;
  let session: PcapSession;
  let raw: PacketWithHeader;
  let pcapPacket: PcapPacket;

  beforeEach(function () {
    createSession = fnmock();
    decode = imock();
    session = imock();
    file = 'some-file';
    raw = imock();
    pcapPacket = imock();
  });

  it('should read stream chunks from pcap', function () {
    const options = { createSession: instance(createSession), decode: instance(decode) };
    const chunk = instance(pcapPacket);
    let onPacket: OnPacket;
    let onComplete: OnComplete;

    when(createSession(anything(), anything())).thenReturn(instance(session));
    when(session.on('packet', anything())).thenCall((_, fn: Listener) => {
      onPacket = fn;
      return session;
    });
    when(session.on('complete', anything())).thenCall((_, fn: Listener) => {
      onComplete = fn;
      return session;
    });
    when(decode.packet(anything())).thenReturn(chunk);

    const stream = new PCapReader(file, options);

    onPacket!(raw);
    onComplete!();

    const ret = stream.read() as Buffer;

    expect(ret).to.be.equal(chunk);

    verify(createSession(file, options as Partial<LiveSessionOptions>)).once();
    verify(session.on('packet', anything())).once();
    verify(session.on('complete', anything())).once();
    verify(decode.packet(raw)).once();
  });

  it('should do nothing on read', function () {
    const options = { createSession: instance(createSession), decode: instance(decode) };

    when(createSession(anything(), anything())).thenReturn(instance(session));

    const stream = new PCapReader(file, options);

    const ret = stream.read() as Buffer;

    expect(ret).to.be.null;

    verify(createSession(file, options as Partial<LiveSessionOptions>)).once();
  });
});

type Listener = (...args: unknown[]) => void;
type OnPacket = (raw: PacketWithHeader) => void;
type OnComplete = () => void;
