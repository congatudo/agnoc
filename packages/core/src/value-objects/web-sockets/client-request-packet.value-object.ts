import {
  DomainPrimitive,
  Primitives,
} from "@agnoc/core/base-classes/value-object.base";
import { ClientRequest } from "@agnoc/core/constants/web-sockets.constant";
import { ArgumentNotProvidedException } from "@agnoc/core/exceptions/argument-not-provided.exception";
import { WebSocketPacket } from "./web-socket-packet.value-object";

export class ClientRequestPacket<
  Payload extends ClientRequest
> extends WebSocketPacket<Payload> {
  get traceId(): Payload["traceId"] {
    return this.props.traceId;
  }

  get method(): Payload["method"] {
    return this.props.method;
  }

  get service(): Payload["service"] {
    return this.props.service;
  }

  protected override validate(
    props: Payload extends Primitives | Date
      ? DomainPrimitive<Payload>
      : Payload
  ): void {
    super.validate(props);

    const validProps = ["traceId", "method", "service"];

    validProps.forEach((validProp) => {
      if (!(validProp in props))
        throw new ArgumentNotProvidedException(
          `Missing property '${validProp}' in web client request packet constructor`
        );
    });
  }
}
