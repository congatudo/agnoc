import { ValueObject } from "@agnoc/core/base-classes/value-object.base";
import {
  ClientRequest,
  ClientRequestCommand,
  PickClientRequest,
  PickServerResponse,
} from "@agnoc/core/constants/web-sockets.constant";
import {
  WebSocketConnection,
  WebSocketConnectionRespondArguments,
} from "@agnoc/core/emitters/web-socket-connection.emitter";
import { ArgumentInvalidException } from "@agnoc/core/exceptions/argument-invalid.exception";
import { ArgumentNotProvidedException } from "@agnoc/core/exceptions/argument-not-provided.exception";
import { isPresent } from "@agnoc/core/utils/is-present.util";
import { ClientRequestPacket } from "./client-request-packet.value-object";

export type WebSocketMessageHandler<Payload extends ClientRequest> = (
  message: WebSocketMessage<Payload>
) => void;

export type WebSocketMessageHandlers = Partial<{
  [Command in ClientRequestCommand]: WebSocketMessageHandler<
    PickClientRequest<Command>
  >;
}>;

export interface WebSocketMessageProps<Payload extends ClientRequest> {
  connection: WebSocketConnection;
  packet: ClientRequestPacket<Payload>;
}

export class WebSocketMessage<
  Payload extends ClientRequest
> extends ValueObject<WebSocketMessageProps<Payload>> {
  get connection(): WebSocketConnection {
    return this.props.connection;
  }

  get packet(): ClientRequestPacket<Payload> {
    return this.props.packet;
  }

  get command(): Payload["service"] {
    return this.packet.service;
  }

  async respond(
    result: PickServerResponse<Payload["service"]>["result"]
  ): Promise<void> {
    // TODO: fix this unknown
    return await this.connection.respond({
      packet: this.packet,
      result,
    } as unknown as WebSocketConnectionRespondArguments<Payload>);
  }

  public override toString(): string {
    return "[Message]";
  }

  protected validate(props: WebSocketMessageProps<Payload>): void {
    if (![props.connection, props.packet].every(isPresent)) {
      throw new ArgumentNotProvidedException(
        "Missing property in web socket message constructor"
      );
    }

    if (!(props.connection instanceof WebSocketConnection)) {
      throw new ArgumentInvalidException(
        "Invalid connection in web socket message constructor"
      );
    }

    if (!(props.packet instanceof ClientRequestPacket)) {
      throw new ArgumentInvalidException(
        "Invalid packet in web socket message constructor"
      );
    }
  }
}
