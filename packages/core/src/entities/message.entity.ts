import { Socket } from "net";
import { Packet, PacketProps } from "./packet.entity";
import debug from "debug";
import path from "path";
import { OPCode } from "../value-objects/opcode.value-object";
import { OPName } from "../constants/opcodes.constant";
import { Payload } from "../value-objects/payload.value-object";

const log = debug(path.basename(__filename));

export class Message {
  constructor(private socket: Socket, private packet: Packet) {}

  send(): void {
    const data = this.packet.toBuffer();

    log(`[Port: ${this.socket.localPort}] ${this.packet.toString()}`);

    // Maybe throw on error?
    if (this.socket.writable) {
      this.socket.write(data);
    }
  }

  buildResponse(opname: OPName, object: Record<string, unknown>): Message {
    const props: Partial<PacketProps> = {
      ctype: this.packet.ctype,
      userId: this.packet.userId,
      deviceId: this.packet.deviceId,
      sequence: this.packet.sequence,
    };

    const opcode = OPCode.fromName(opname);

    props.payload = Payload.fromObject(opcode, object);
    props.flow = this.packet.flow + 1;

    return new Message(this.socket, new Packet(props as PacketProps));
  }
}
