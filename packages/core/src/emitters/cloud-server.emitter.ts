/* eslint-disable @typescript-eslint/unbound-method */
import { Robot } from "./robot.emitter";
import { PacketSocket } from "../sockets/packet.socket";
import { PacketServer } from "./packet-server.emitter";
import { bind } from "../decorators/bind.decorator";
import { Device } from "../entities/device.entity";
import { Message } from "../value-objects/message.value-object";
import { OPName } from "../constants/opcodes.constant";
import { User } from "../entities/user.entity";
import { TypedEmitter } from "tiny-typed-emitter";
import { Connection } from "./connection.emitter";
import { DeviceSystem } from "../value-objects/device-system.value-object";
import {
  ICLIENT_ONLINE_REQ,
  ICLIENT_ONLINE_RSP,
  ICOMMON_ERROR_REPLY,
  IDEVICE_REGISTER_REQ,
  IDEVICE_REGISTER_RSP,
  IDEVICE_TIME_SYNC_RSP,
} from "../../schemas/schema";
import { ID } from "../value-objects/id.value-object";
import { Multiplexer } from "./multiplexer.emitter";

interface Servers {
  cmd: PacketServer;
  map: PacketServer;
  rtc: PacketServer;
}

type Handler = (message: Message) => void;
type Handlers = Partial<Record<OPName, Handler>>;

interface CloudServerEvents {
  addRobot: (robot: Robot) => void;
  error: (err: Error) => void;
}

export class CloudServer extends TypedEmitter<CloudServerEvents> {
  private robots = new Map() as Map<number, Robot>;
  private servers: Servers;
  private handlers: Handlers = {
    CLIENT_ONLINE_REQ: this.handleClientLogin,
    DEVICE_REGISTER_REQ: this.handleClientRegister,
  };

  constructor() {
    super();
    this.servers = {
      cmd: new PacketServer(),
      map: new PacketServer(),
      rtc: new PacketServer(),
    };
    this.addListeners();
  }

  getRobots(): Robot[] {
    return [...this.robots.values()];
  }

  async listen(host?: string): Promise<void> {
    await Promise.all([
      this.servers.cmd.listen({ host, port: 4010 }),
      this.servers.map.listen({ host, port: 4030 }),
      this.servers.rtc.listen({ host, port: 4050 }),
    ]);
  }

  async close(): Promise<void> {
    this.getRobots().map((robot) => {
      robot.disconnect();
    });

    await Promise.all([
      this.servers.cmd.close(),
      this.servers.map.close(),
      this.servers.rtc.close(),
    ]);
  }

  @bind
  private handleClientLogin(message: Message): void {
    const robot = this.robots.get(message.packet.deviceId.value);

    if (!robot) {
      const object = message.packet.payload.object as ICLIENT_ONLINE_REQ;

      message.respond("CLIENT_ONLINE_RSP", {
        result: 12002,
        reason: `Device not registered(devsn: ${object.deviceSerialNumber})`,
      } as ICLIENT_ONLINE_RSP);
    } else {
      message.respond("CLIENT_ONLINE_RSP", {
        result: 0,
      } as ICLIENT_ONLINE_RSP);

      void robot.adquire();

      this.emit("addRobot", robot);
    }
  }

  @bind
  private handleClientRegister(message: Message): void {
    const props = message.packet.payload.object as IDEVICE_REGISTER_REQ;
    const multiplexer = new Multiplexer();
    const device = new Device({
      id: ID.generate(),
      system: new DeviceSystem(props),
    });
    const user = new User({
      id: ID.generate(),
    });
    const robot = new Robot({ device, user, multiplexer });

    multiplexer.on("error", (err) => this.emit("error", err));

    robot.addConnection(message.connection);

    this.robots.set(device.id.value, robot);

    message.respond("DEVICE_REGISTER_RSP", {
      result: 0,
      device: {
        id: device.id.value,
      },
    } as IDEVICE_REGISTER_RSP);
  }

  @bind
  handleMessage(message: Message): void {
    const handler = this.handlers[message.opname];

    if (handler) {
      return handler(message);
    }

    const robot = this.robots.get(message.packet.deviceId.value);

    if (robot) {
      robot.addConnection(message.connection);
      robot.handleMessage(message);
      return;
    }

    message.respond("COMMON_ERROR_REPLY", {
      // TODO: type this.
      result: 1,
      opcode: message.packet.payload.opcode.value,
      error: "Device not registered",
    } as ICOMMON_ERROR_REPLY);
  }

  @bind
  private handleConnection(socket: PacketSocket): void {
    const connection = new Connection(socket);

    connection.on("data", (packet) => {
      const message = new Message({ connection, packet });

      this.handleMessage(message);
    });
  }

  @bind
  private handleRTPConnection(socket: PacketSocket) {
    const connection = new Connection(socket);

    connection.send({
      opname: "DEVICE_TIME_SYNC_RSP",
      userId: new ID(0),
      deviceId: new ID(0),
      object: {
        result: 0,
        body: {
          time: Math.floor(Date.now() / 1000),
        },
      } as IDEVICE_TIME_SYNC_RSP,
    });

    connection.close();
  }

  private addListeners(): void {
    this.servers.cmd.on("connection", this.handleConnection);
    this.servers.map.on("connection", this.handleConnection);
    this.servers.rtc.on("connection", this.handleRTPConnection);
  }
}
