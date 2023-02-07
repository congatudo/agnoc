import {
  DomainPrimitive,
  Primitives,
} from "@agnoc/core/base-classes/value-object.base";
import { ServerRequest } from "@agnoc/core/constants/web-sockets.constant";
import { ArgumentNotProvidedException } from "@agnoc/core/exceptions/argument-not-provided.exception";
import { WebSocketPacket } from "./web-socket-packet.value-object";

export class ServerRequestPacket<
  Payload extends ServerRequest
> extends WebSocketPacket<Payload> {
  get tag(): Payload["tag"] {
    return this.props.tag;
  }

  get content(): Payload["content"] {
    return this.props.content;
  }

  protected override validate(
    props: Payload extends Primitives | Date
      ? DomainPrimitive<Payload>
      : Payload
  ): void {
    super.validate(props);

    const validProps = ["tag", "content"];

    validProps.forEach((validProp) => {
      if (!(validProp in props))
        throw new ArgumentNotProvidedException(
          `Missing property '${validProp}' in server request packet constructor`
        );
    });
  }
}
