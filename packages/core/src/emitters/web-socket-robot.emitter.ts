import { TypedEmitter } from "tiny-typed-emitter";
import {
  ClientRequest,
  DeviceCtrlToBindClientRequestContentData,
  DeviceReportDataClientRequest,
  GetMapToBindClientRequestContentData,
  GetPreferenceToBindClientRequestContentData,
  GetStatusToBindClientRequestContentData,
  GetTimeToBindClientRequestContentData,
  HeartbeatClientRequest,
  LockDeviceToBindClientRequestContentData,
  PickToBindClientRequestContentData,
  ServerRequest,
  SetPreferenceToBindClientRequestContentData,
  SetVoiceTypeToBindClientRequestContentData,
  StatusToBindClientRequestContentData,
  ToBindClientRequest,
  ToBindClientRequestContentData,
  ToBindServerRequestContent,
  UpgradePacketInfoToBindClientRequestContentData,
} from "../constants/web-sockets.constant";
import { Device } from "../entities/device.entity";
import { User } from "../entities/user.entity";
import { DomainException } from "../exceptions/domain.exception";
import { debug, Debug } from "../utils/debug.util";
import { ClientRequestPacket } from "../value-objects/web-sockets/client-request-packet.value-object";
import {
  WebSocketMessage,
  WebSocketMessageHandler,
  WebSocketMessageHandlers,
} from "../value-objects/web-sockets/web-socket-message.value-object";
import { WebSocketConnection } from "./web-socket-connection.emitter";

interface WebSocketRobotEvents {
  updateDevice: () => void;
  updateMap: () => void;
  updateRobotPosition: () => void;
  updateChargerPosition: () => void;
}

export interface WebSocketRobotProps {
  device: Device;
  user: User;
  connection: WebSocketConnection;
}

const RECV_TIMEOUT = 5000;

export type WebSocketBindHandlers = Partial<{
  [Control in ToBindClientRequestContentData["control"]]: WebSocketMessageHandler<
    ToBindClientRequest<PickToBindClientRequestContentData<Control>>
  >;
}>;

export class WebSocketRobot extends TypedEmitter<WebSocketRobotEvents> {
  public readonly device: Device;
  public readonly user: User;
  private readonly connection: WebSocketConnection;
  private debug: Debug;
  private handlers: WebSocketMessageHandlers = {
    "heart-beat": this.handleHeartBeat.bind(this),
    "sweeper-robot-center/device/report_data":
      this.handleDeviceReportData.bind(this),
    "sweeper-transmit/transmit/to_bind": this.handleToBind.bind(this),
  };
  private bindHandlers: WebSocketBindHandlers = {
    get_preference: this.handleGetPreference.bind(this),
    set_preference: this.handleSetPreference.bind(this),
    get_map: this.handleGetMap.bind(this),
    lock_device: this.handleLockDevice.bind(this),
    get_status: this.handleGetStatus.bind(this),
    status: this.handleStatus.bind(this),
    device_ctrl: this.handleDeviceCtrl.bind(this),
    upgrade_packet_info: this.handleUpgradePacketInfo.bind(this),
    get_time: this.handleGetTime.bind(this),
    setVoiceType: this.handleSetVoiceType.bind(this),
  };

  constructor({ device, user, connection }: WebSocketRobotProps) {
    super();
    this.device = device;
    this.user = user;
    this.connection = connection;
    this.debug = debug(__filename).extend(this.device.id.toString());
    this.debug("new robot");
  }

  override toString(): string {
    return [
      `device: ${this.device.toString()}`,
      `user: ${this.user.toString()}`,
    ].join(" ");
  }

  disconnect(): void {
    this.debug("disconnecting...");

    return this.connection.close();
  }

  handleMessage<Payload extends ClientRequest>(
    message: WebSocketMessage<Payload>
  ): void {
    const handler = this.handlers[message.command] as
      | WebSocketMessageHandler<Payload>
      | undefined;

    if (handler) {
      handler(message);
    } else {
      this.debug(`unhandled command ${message.command}`);
    }
  }

  async send<Payload extends ServerRequest>(
    command: Payload["tag"],
    content: Payload["content"]
  ): Promise<void> {
    try {
      await this.connection.send({
        command,
        content,
      });
    } catch (e) {
      throw new DomainException(
        `There was an error sending opcode '${command}': ${
          (e as Error).message
        }`
      );
    }
  }

  recv<Payload extends ClientRequest>(
    command: Payload["service"]
  ): Promise<ClientRequestPacket<Payload>> {
    return new Promise((resolve, reject) => {
      const done = (packet: ClientRequestPacket<ClientRequest>) => {
        clearTimeout(timer);
        resolve(packet as ClientRequestPacket<Payload>);
      };

      const fail = () => {
        this.connection.off(command, done);
        reject(
          new DomainException(
            `Timeout waiting for response from command '${command}'`
          )
        );
      };

      const timer = setTimeout(fail, RECV_TIMEOUT);

      this.connection.once(command, done);
    });
  }

  async sendBind<Content extends ToBindServerRequestContent>(
    content: Content
  ): Promise<void> {
    return await this.send("sweeper-transmit/to_bind", content);
  }

  recvBind<Data extends ToBindClientRequestContentData>(
    control: Data["control"]
  ): Promise<ClientRequestPacket<ToBindClientRequest<Data>>> {
    const command = "sweeper-transmit/transmit/to_bind";

    return new Promise((resolve, reject) => {
      const done = (packet: ClientRequestPacket<ClientRequest>) => {
        const payload = packet.toJSON() as ToBindClientRequest<Data>;

        if (payload.content.data.control === control) {
          clearTimeout(timer);
          resolve(packet as ClientRequestPacket<ToBindClientRequest<Data>>);
        }
      };

      const fail = () => {
        this.connection.off(command, done);
        reject(
          new DomainException(
            `Timeout waiting for response from command '${command}:${control}'`
          )
        );
      };

      const timer = setTimeout(fail, RECV_TIMEOUT);

      this.connection.on(command, done);
    });
  }

  async sendRecvBind<
    SendContent extends ToBindServerRequestContent,
    RecvData extends ToBindClientRequestContentData
  >(
    send_content: SendContent,
    recv_control: RecvData["control"]
  ): Promise<ClientRequestPacket<ToBindClientRequest<RecvData>>> {
    void this.send("sweeper-transmit/to_bind", send_content);

    return await this.recvBind(recv_control);
  }

  async handshake(): Promise<void> {
    await this.lockDevice();
    await this.getStatus();
    await this.getMap();
    await this.getTime();
    await this.upgradePacketInfo();
    await this.setVoiceType();
  }

  private async lockDevice(): Promise<void> {
    await this.sendBind({
      control: "lock_device",
      userid: this.user.id.value,
    });
    await this.sendRecvBind(
      {
        control: "lock_device",
        userid: this.user.id.value,
      },
      "lock_device"
    );
  }

  private async getStatus(): Promise<void> {
    await this.sendRecvBind(
      {
        begin_time: 1,
        control: "get_status",
        ctrltype: -1,
        end_time: 1,
        isSave: -1,
        is_open: -1,
        mapid: 0,
        operation: 0,
        result: -1,
        type: -1,
        value: -1,
        voiceMode: -1,
        volume: -1,
      },
      "get_status"
    );
  }

  async getMap(): Promise<void> {
    await this.sendRecvBind(
      {
        control: "get_map",
        start_index: 0,
        end_index: 0,
        taskid: 0,
        mask: 1,
        mapid: 0,
        type: 0,
      },
      "get_map"
    );
  }

  async getTime(): Promise<void> {
    await this.sendRecvBind(
      {
        control: "get_time",
        userid: this.user.id.value,
      },
      "get_time"
    );
  }

  async upgradePacketInfo(): Promise<void> {
    await this.sendRecvBind(
      {
        control: "upgrade_packet_info",
        userid: this.user.id.value,
      },
      "upgrade_packet_info"
    );
  }

  async setVoiceType(): Promise<void> {
    await this.sendRecvBind(
      {
        // TODO: parameterize this
        Voice: 3,
        control: "setVoiceType",
      },
      "setVoiceType"
    );
  }

  async locate(): Promise<void> {
    await this.sendRecvBind(
      {
        begin_time: 1,
        control: "device_ctrl",
        ctrltype: 3,
        end_time: 1,
        isSave: -1,
        is_open: -1,
        mapid: 0,
        operation: 1,
        result: -1,
        type: -1,
        value: -1,
        voiceMode: -1,
        volume: -1,
      },
      "device_ctrl"
    );
  }

  private handleToBind<Data extends ToBindClientRequestContentData>(
    message: WebSocketMessage<ToBindClientRequest<Data>>
  ): void {
    const payload = message.packet.toJSON();
    const handler = this.bindHandlers[payload.content.data.control] as
      | WebSocketMessageHandler<ToBindClientRequest<Data>>
      | undefined;

    if (handler) {
      return handler(message);
    }

    throw new Error(
      `no handler for '${message.command}:${payload.content.data.control}'`
    );
  }

  private handleHeartBeat(message: WebSocketMessage<HeartbeatClientRequest>) {
    void message.respond(String(new Date().getTime()));
  }

  private handleDeviceReportData(
    message: WebSocketMessage<DeviceReportDataClientRequest>
  ) {
    void message.respond(true);
  }

  private handleGetPreference(
    message: WebSocketMessage<
      ToBindClientRequest<GetPreferenceToBindClientRequestContentData>
    >
  ) {
    // TODO: read data
    void message.respond(true);
  }

  private handleSetPreference(
    message: WebSocketMessage<
      ToBindClientRequest<SetPreferenceToBindClientRequestContentData>
    >
  ) {
    // nothing here
    void message.respond(true);
  }

  private handleGetMap(
    message: WebSocketMessage<
      ToBindClientRequest<GetMapToBindClientRequestContentData>
    >
  ) {
    // TODO: read data
    void message.respond(true);
  }

  private handleLockDevice(
    message: WebSocketMessage<
      ToBindClientRequest<LockDeviceToBindClientRequestContentData>
    >
  ) {
    // nothing here
    void message.respond(true);
  }

  private handleSetVoiceType(
    message: WebSocketMessage<
      ToBindClientRequest<SetVoiceTypeToBindClientRequestContentData>
    >
  ) {
    // nothing here
    void message.respond(true);
  }

  private handleStatus(
    message: WebSocketMessage<
      ToBindClientRequest<StatusToBindClientRequestContentData>
    >
  ) {
    // TODO: read data
    void message.respond(true);
  }

  private handleGetStatus(
    message: WebSocketMessage<
      ToBindClientRequest<GetStatusToBindClientRequestContentData>
    >
  ) {
    // TODO: read data
    void message.respond(true);
  }

  private handleGetTime(
    message: WebSocketMessage<
      ToBindClientRequest<GetTimeToBindClientRequestContentData>
    >
  ) {
    // TODO: read data
    void message.respond(true);
  }

  private handleDeviceCtrl(
    message: WebSocketMessage<
      ToBindClientRequest<DeviceCtrlToBindClientRequestContentData>
    >
  ) {
    // nothing here
    void message.respond(true);
  }

  private handleUpgradePacketInfo(
    message: WebSocketMessage<
      ToBindClientRequest<UpgradePacketInfoToBindClientRequestContentData>
    >
  ) {
    // TODO: read data
    void message.respond(true);
  }
}
