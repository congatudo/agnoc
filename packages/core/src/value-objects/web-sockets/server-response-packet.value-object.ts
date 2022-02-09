import {
  DomainPrimitive,
  Primitives,
} from "@agnoc/core/base-classes/value-object.base";
import { ServerResponse } from "@agnoc/core/constants/web-sockets.constant";
import { ArgumentNotProvidedException } from "@agnoc/core/exceptions/argument-not-provided.exception";
import { WebSocketPacket } from "./web-socket-packet.value-object";

export class ServerResponsePacket<
  Payload extends ServerResponse
> extends WebSocketPacket<Payload> {
  get code(): Payload["code"] {
    return this.props.code;
  }

  get traceId(): Payload["traceId"] {
    return this.props.traceId;
  }

  get service(): Payload["service"] {
    return this.props.service;
  }

  get result(): Payload["result"] {
    return this.props.result;
  }

  protected override validate(
    props: Payload extends Primitives | Date
      ? DomainPrimitive<Payload>
      : Payload
  ): void {
    super.validate(props);

    const validProps = ["code", "traceId", "service", "result"];

    validProps.forEach((validProp) => {
      if (!(validProp in props))
        throw new ArgumentNotProvidedException(
          `Missing property '${validProp}' in server response packet constructor`
        );
    });
  }
}
