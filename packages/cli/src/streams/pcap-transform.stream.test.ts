import { imock, instance, when } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { readStream } from '../test-support';
import { PCapTransform } from './pcap-transform.stream';
import type { EthernetPacket, IPv4, PcapPacket, TCP } from 'pcap';

describe('TCPStream', function () {
  let pcapPacket: PcapPacket;
  let ethernetPacket: EthernetPacket;
  let ipv4: IPv4;
  let tcp: TCP;

  beforeEach(function () {
    pcapPacket = imock();
    ethernetPacket = imock();
    ipv4 = imock();
    tcp = imock();
  });

  it('should transform a pcap-packet stream to a buffer stream', async function () {
    when(pcapPacket.payload).thenReturn(instance(ethernetPacket));
    when(ethernetPacket.payload).thenReturn(instance(ipv4));
    when(ipv4.payload).thenReturn(instance(tcp));
    when(tcp.data).thenReturn(Buffer.from('0500000002', 'hex'));
    when(tcp.dport).thenReturn('1234');
    when(tcp.sport).thenReturn('5678');

    const stream = new PCapTransform();

    stream.end(instance(pcapPacket));

    const [ret] = await readStream(stream);

    expect(ret).to.be.deep.equal(Buffer.from('0500000002', 'hex'));
  });

  it('should do nothing when the packet is not a tcp packet', async function () {
    when(pcapPacket.payload).thenReturn(instance(ethernetPacket));
    when(ethernetPacket.payload).thenReturn(instance(ipv4));
    when(ipv4.payload).thenReturn(undefined);

    const stream = new PCapTransform();

    stream.end(instance(pcapPacket));

    const [ret] = await readStream(stream);

    expect(ret).to.be.undefined;
  });

  it('should do nothing when the packet has no data', async function () {
    when(pcapPacket.payload).thenReturn(instance(ethernetPacket));
    when(ethernetPacket.payload).thenReturn(instance(ipv4));
    when(ipv4.payload).thenReturn(instance(tcp));
    when(tcp.data).thenReturn(null);
    when(tcp.dport).thenReturn('1234');
    when(tcp.sport).thenReturn('5678');

    const stream = new PCapTransform();

    stream.end(instance(pcapPacket));

    const [ret] = await readStream(stream);

    expect(ret).to.be.undefined;
  });

  it('should transform a pcap-packet stream with mixed packets to a buffer stream', async function () {
    const tcp2: TCP = imock();

    when(pcapPacket.payload).thenReturn(instance(ethernetPacket));
    when(ethernetPacket.payload).thenReturn(instance(ipv4));
    when(ipv4.payload).thenReturn(instance(tcp)).thenReturn(instance(tcp2));
    when(tcp.data).thenReturn(Buffer.from('0500000002', 'hex'));
    when(tcp.dport).thenReturn('1234');
    when(tcp.sport).thenReturn('5678');
    when(tcp2.data).thenReturn(Buffer.from('0500000003', 'hex'));
    when(tcp2.dport).thenReturn('5678');
    when(tcp2.sport).thenReturn('1234');

    const stream = new PCapTransform();

    stream.write(instance(pcapPacket));
    stream.end(instance(pcapPacket));

    const [ret1, ret2] = await readStream(stream);

    expect(ret1).to.be.deep.equal(Buffer.from('0500000002', 'hex'));
    expect(ret2).to.be.deep.equal(Buffer.from('0500000003', 'hex'));
  });

  it('should transform a pcap-packet stream with several packets to a buffer stream', async function () {
    const tcp2: TCP = imock();

    when(pcapPacket.payload).thenReturn(instance(ethernetPacket));
    when(ethernetPacket.payload).thenReturn(instance(ipv4));
    when(ipv4.payload).thenReturn(instance(tcp)).thenReturn(instance(tcp2));
    when(tcp.data).thenReturn(Buffer.from('050000000205000000', 'hex'));
    when(tcp.dport).thenReturn('1234');
    when(tcp.sport).thenReturn('5678');
    when(tcp2.data).thenReturn(Buffer.from('03', 'hex'));
    when(tcp2.dport).thenReturn('1234');
    when(tcp2.sport).thenReturn('5678');

    const stream = new PCapTransform();

    stream.write(instance(pcapPacket));
    stream.end(instance(pcapPacket));

    const [ret1, ret2] = await readStream(stream);

    expect(ret1).to.be.deep.equal(Buffer.from('0500000002', 'hex'));
    expect(ret2).to.be.deep.equal(Buffer.from('0500000003', 'hex'));
  });
});
