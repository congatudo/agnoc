declare module "pcap" {
  import { EventEmitter } from "events";

  interface TCP {
    data: Buffer | null;
    sport: string;
    dport: string;
  }

  interface IPv4 {
    payload?: TCP;
  }

  interface EthernetPacket {
    payload?: IPv4;
  }

  interface PcapPacket {
    payload?: EthernetPacket;
  }

  interface Decode {
    packet: (packet: PacketWithHeader) => PcapPacket;
  }

  export const decode: Decode;

  export declare class PcapSession extends EventEmitter {
    private constructor();
    readonly link_type: LinkType;
    close(): void;
    stats(): CaptureStats;
    inject(data: Buffer): void;
  }

  export interface CommonSessionOptions {
    filter?: string;
  }

  export type OfflineSessionOptions = CommonSessionOptions;

  export interface PacketWithHeader {
    buf: Buffer;
    header: Buffer;
    link_type: LinkType;
  }

  export interface LiveSessionOptions extends CommonSessionOptions {
    buffer_size?: number;
    promiscuous?: boolean;
    buffer_timeout?: number;
    monitor?: boolean;
    snap_length?: number;
  }

  export declare function createSession(
    device: string,
    options?: LiveSessionOptions
  ): PcapSession;
  export declare function createOfflineSession(
    path: string,
    options?: LiveSessionOptions
  ): PcapSession;
}
