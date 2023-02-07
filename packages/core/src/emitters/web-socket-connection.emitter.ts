import { TypedEmitter } from "tiny-typed-emitter";
import {
  ClientRequest,
  ClientRequestCommand,
  PickClientRequest,
  PickServerResponse,
  ServerRequest,
  ServerResponse,
  WebSocketPayload,
} from "../constants/web-sockets.constant";
import { ClientRequestPacket } from "../value-objects/web-sockets/client-request-packet.value-object";
import { debug } from "../utils/debug.util";
import { WebSocketPacketSocket } from "../sockets/web-socket-packet.socket";
import { ServerRequestPacket } from "../value-objects/web-sockets/server-request-packet.value-object";
import { ServerResponsePacket } from "../value-objects/web-sockets/server-response-packet.value-object";
import { WebSocketPacket } from "../value-objects/web-sockets/web-socket-packet.value-object";
import { promisify } from "../utils/promisify.util";

type WebSocketConnectionEvents<Command extends ClientRequestCommand> = {
  [key in Command]: (
    packet: ClientRequestPacket<PickClientRequest<Command>>
  ) => void;
} & {
  data: (packet: ClientRequestPacket<ClientRequest>) => void;
  close: () => void;
  error: (err: Error) => void;
};

interface WebSocketConnectionSendArguments<Payload extends ServerRequest> {
  command: Payload["tag"];
  content: Payload["content"];
}

export interface WebSocketConnectionRespondArguments<
  Payload extends ClientRequest
> {
  packet: ClientRequestPacket<Payload>;
  result: PickServerResponse<Payload["service"]>["result"];
}

export class WebSocketConnection extends TypedEmitter<
  WebSocketConnectionEvents<ClientRequestCommand>
> {
  private debug = debug("web-socket-connection");
  private socket: WebSocketPacketSocket;

  constructor(socket: WebSocketPacketSocket) {
    super();
    this.socket = socket;
    this.addListeners();
    this.debug = debug(`web-socket-connection`).extend(this.toString());
    this.debug("new connection");
  }

  override toString(): string {
    return this.socket.toString();
  }

  async send<Payload extends ServerRequest>({
    command,
    content,
  }: WebSocketConnectionSendArguments<Payload>): Promise<void> {
    const packet = new ServerRequestPacket({
      tag: command,
      content,
    });

    this.debug(`sending packet ${packet.toString()}`);

    return await this.write(packet);
  }

  async respond<Payload extends ClientRequest>({
    packet,
    result,
  }: WebSocketConnectionRespondArguments<Payload>): Promise<void> {
    const response = new ServerResponsePacket({
      code: 0,
      traceId: String(packet.traceId),
      service: packet.service,
      result,
    } as ServerResponse);

    this.debug(`sending packet ${response.toString()}`);

    return await this.write(response);
  }

  close(): void {
    this.debug("closing socket...");

    this.socket.end();
  }

  destroy(err: Error): void {
    this.debug("destroying socket...");

    this.socket.destroy(err);
  }

  private async write(
    packet: WebSocketPacket<ServerRequest | ServerResponse>
  ): Promise<void> {
    await promisify((callback) => this.socket.write(packet, callback));
  }

  private addListeners() {
    this.socket.on("data", (packet: WebSocketPacket<WebSocketPayload>) =>
      this.handlePacket(packet as ClientRequestPacket<ClientRequest>)
    );
    this.socket.on("error", this.handleError.bind(this));
    this.socket.on("close", this.handleClose.bind(this));
  }

  private handlePacket(packet: ClientRequestPacket<ClientRequest>) {
    this.debug(`received packet: ${packet.toString()}`);
    this.emit(packet.command, packet);
    this.emit("data", packet);
  }

  private handleClose() {
    this.debug("handling close");
    this.emit("close");
  }

  private handleError(err: Error) {
    this.debug(`handling error: ${err.message}`);
    this.emit("error", err);
  }
}
