import { randomUUID } from "crypto";
import { TypedEmitter } from "tiny-typed-emitter";
import { debug } from "../utils/debug.util";
import {
  WebSocketMessage,
  WebSocketMessageHandler,
  WebSocketMessageHandlers,
} from "../value-objects/web-sockets/web-socket-message.value-object";
import { WebSocketPacketSocket } from "../sockets/web-socket-packet.socket";
import {
  AuthLoginClientRequest,
  ClientRequest,
} from "../constants/web-sockets.constant";
import { Device } from "../entities/device.entity";
import { DeviceSystem } from "../value-objects/device-system.value-object";
import { ID } from "../value-objects/id.value-object";
import { DeviceVersion } from "../value-objects/device-version.value-object";
import { User } from "../entities/user.entity";
import { WebSocketConnection } from "./web-socket-connection.emitter";
import { WebSocketServer } from "./web-socket-server.emitter";
import { EventLogHttpServer } from "./event-log-http-server.emitter";
import { LoggerHttpServer } from "./logger-http-server.emitter";
import { DiscoveryHttpServer } from "./discovery-http-server.emitter";
import { WebSocketRobot } from "./web-socket-robot.emitter";

interface CloudServerEvents {
  addRobot: (robot: WebSocketRobot) => void;
  error: (err: Error) => void;
}

export class WebSocketCloudServer extends TypedEmitter<CloudServerEvents> {
  private debug = debug("cloud-server");
  private robots = new Map() as Map<WebSocketConnection, WebSocketRobot>;
  private servers = {
    discovery: new DiscoveryHttpServer(),
    logger: new LoggerHttpServer(),
    eventLog: new EventLogHttpServer(),
    webSocket: new WebSocketServer(),
  };
  private handlers: WebSocketMessageHandlers = {
    "sweeper-robot-center/auth/login": this.handleClientLogin.bind(this),
  } as const;

  constructor() {
    super();
    this.addListeners();
  }

  async listen(host?: string): Promise<void> {
    this.debug(`listening servers`);

    await Promise.all([
      this.servers.discovery.listen({ host, port: 4010 }),
      this.servers.logger.listen({ host, port: 8002 }),
      this.servers.eventLog.listen({ host, port: 8006 }),
      this.servers.webSocket.listen({ host, port: 9090 }),
    ]);
  }

  async close(): Promise<void> {
    this.debug(`closing servers`);

    await Promise.all([
      this.servers.discovery.close(),
      this.servers.logger.close(),
      this.servers.eventLog.close(),
      this.servers.webSocket.close(),
    ]);
  }

  private addListeners() {
    this.servers.webSocket.on(
      "connection",
      this.handleWebSocketConnection.bind(this)
    );
  }

  private handleWebSocketConnection(socket: WebSocketPacketSocket) {
    const connection = new WebSocketConnection(socket);

    connection.on("close", () => {
      this.debug("removing connection");
      connection.removeAllListeners();
      this.robots.delete(connection);
    });
    connection.on("error", (err) => {
      this.debug(`connection error: ${err.message}`);
    });
    connection.on("data", (packet) => {
      const message = new WebSocketMessage({ connection, packet });

      this.handleMessage(message);
    });
  }

  private handleMessage<Payload extends ClientRequest>(
    message: WebSocketMessage<Payload>
  ) {
    const handler = this.handlers[message.command] as
      | WebSocketMessageHandler<Payload>
      | undefined;

    if (handler) {
      return handler(message);
    }

    const robot = this.robots.get(message.connection);

    if (robot) {
      robot.handleMessage(message);
      return;
    }

    // TODO: handle unknown command
    throw new Error(`no handler for ${message.command}`);
  }

  private handleClientLogin(message: WebSocketMessage<AuthLoginClientRequest>) {
    const connection = message.connection;
    const payload = message.packet.toJSON();
    const device = new Device({
      id: ID.generate(),
      system: new DeviceSystem({
        deviceSerialNumber: payload.content.sn,
        deviceMac: payload.content.mac,
        deviceType: payload.content.packageVersions[0].version,
        customerFirmwareId: payload.content.factoryId,
        ctrlVersion: payload.content.packageVersions[0].ctrlVersion,
      }),
      version: new DeviceVersion({
        software: "",
        hardware: "",
      }),
    });
    const user = new User({
      id: ID.generate(),
    });
    const bindList: number[] = [
      ID.generate().value,
      user.id.value,
      ID.generate().value,
    ];
    const robot = new WebSocketRobot({ device, user, connection });

    this.robots.set(message.connection, robot);

    // TODO: remove robot on disconnect
    this.emit("addRobot", robot);

    void message.respond({
      data: {
        AUTH: randomUUID(),
        FACTORY_ID: String(payload.content.factoryId),
        USERNAME: payload.content.sn,
        CONNECTION_TYPE: "sweeper",
        PROJECT_TYPE: payload.content.projectType,
        ROBOT_TYPE: "sweeper",
        SN: payload.content.sn,
        MAC: payload.content.mac,
        BIND_LIST: JSON.stringify(bindList.map(String)),
        COUNTRY_CITY: encodeURIComponent(
          JSON.stringify({
            continent: "Unknown",
            country: "Unknown",
            city: "Unknown",
          })
        ),
      },
      clientType: "ROBOT",
      id: String(device.id.value),
      resetCode: 0,
    });

    void robot.handshake().catch((err) => {
      this.debug(`handshake error: ${(err as Error).message}`);
      connection.destroy(err as Error);
    });
  }
}
