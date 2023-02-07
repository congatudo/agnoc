import { inflateSync } from "zlib";
import { Readable } from "stream";
import { URL } from "url";
import { toStream } from "@agnoc/core/utils/to-stream.util";
import {
  readString,
  readUInt16BE,
  readUInt32BE,
  readUInt8,
  readWord,
} from "@agnoc/core/utils/stream.util";
import protobuf, { INamespace } from "protobufjs/light";
import { decodeRobotPosition } from "@agnoc/core/decoders/robot-position.decoder";
import {
  PickWebSocketCommand,
  RobotSynNoCacheClientRequest,
  RobotSynNoCacheClientRequestContentData,
  ServerRequest,
  WebSocketPayload,
} from "@agnoc/core/constants/web-sockets.constant";
import isValidUTF8 from "utf-8-validate";
import {
  DomainPrimitive,
  Primitives,
  ValueObject,
} from "@agnoc/core/base-classes/value-object.base";
import { ArgumentNotProvidedException } from "@agnoc/core/exceptions/argument-not-provided.exception";
import { isPresent } from "@agnoc/core/utils/is-present.util";
import { PACK_TYPE_MAP_DATA } from "../../../schemas/websocket";
import schema from "../../../schemas/websocket.json";

const root = protobuf.Root.fromJSON(schema as INamespace);

function unpackJSON(buffer: Buffer): WebSocketPayload {
  const payload = JSON.parse(buffer.toString("utf8")) as Record<
    string,
    unknown
  >;

  if (payload.content) {
    payload.content = JSON.parse(payload.content as string);
  }

  return payload as unknown as WebSocketPayload;
}

function readRobotPositionData(buffer: Buffer) {
  return decodeRobotPosition(buffer);
}

function readMapData(buffer: Buffer) {
  const data = inflateSync(buffer);
  const schema = root.lookupType("PACK_TYPE_MAP_DATA");
  const message = schema.decode(data);

  return schema.toObject(message) as PACK_TYPE_MAP_DATA;
}

function readMapAllData(buffer: Buffer) {
  const stream = toStream(buffer);
  const count = readWord(stream);
  const maps = [];

  for (let i = 0; i < count; i++) {
    const _id = readWord(stream);
    const length = readWord(stream);
    const data = stream.read(length) as Buffer;
    const map = readMapData(data);

    maps.push(map);
  }

  return maps;
}

const BINARY_PACK_TYPE_HANDLERS = {
  0: readRobotPositionData,
  1: readMapData,
  3: readMapAllData,
} as const;

function readBinaryData(stream: Readable) {
  const packType = readUInt8(stream);
  const _unk1 = readUInt16BE(stream);
  const _packId = readUInt8(stream);
  const _deviceId = readUInt32BE(stream);
  const _unk2 = readUInt16BE(stream);
  const packSize = readUInt16BE(stream);
  const handler =
    BINARY_PACK_TYPE_HANDLERS[
      packType as keyof typeof BINARY_PACK_TYPE_HANDLERS
    ];
  const data = stream.read(packSize) as Buffer;

  if (handler) {
    return handler(data);
  }

  throw new Error(`Unhandled pack type: ${packType}`);
}

function unpackBinary(buffer: Buffer) {
  const stream = toStream(buffer);

  const _unk1 = readUInt32BE(stream);
  const traceId = readUInt32BE(stream);
  const _unk2 = readUInt8(stream);
  const method = readString(stream);
  const _unk3 = readUInt8(stream);
  const path = readString(stream);
  const url = new URL(path, "http://localhost");
  const service = url.pathname.slice(1);
  const targets = url.searchParams.getAll("targets").map(Number);
  const data = readBinaryData(stream);

  return {
    traceId,
    method,
    service,
    content: {
      data,
      targets,
    },
  } as RobotSynNoCacheClientRequest<RobotSynNoCacheClientRequestContentData>;
}

function unpack(buffer: Buffer): WebSocketPayload {
  if (isValidUTF8(buffer)) {
    return unpackJSON(buffer);
  }

  return unpackBinary(buffer);
}

function pack(payload: Record<string, unknown>): Buffer {
  if (payload.content) {
    payload.content = JSON.stringify(payload.content);
  }

  return Buffer.from(JSON.stringify(payload));
}

function isServerRequest(payload: WebSocketPayload): payload is ServerRequest {
  return typeof (payload as ServerRequest).tag !== "undefined";
}

export class WebSocketPacket<
  Payload extends WebSocketPayload
> extends ValueObject<Payload> {
  get command(): PickWebSocketCommand<Payload> {
    if (isServerRequest(this.props)) {
      return this.props.tag as PickWebSocketCommand<Payload>;
    }

    return this.props.service as PickWebSocketCommand<Payload>;
  }

  toBuffer(): Buffer {
    return pack(this.props as unknown as Record<string, unknown>);
  }

  override toJSON(): Payload {
    return super.toJSON() as Payload;
  }

  protected validate(
    props: Payload extends Primitives | Date
      ? DomainPrimitive<Payload>
      : Payload
  ): void {
    if (!isPresent(props))
      throw new ArgumentNotProvidedException(
        "Missing property in packet constructor"
      );
  }

  static fromBuffer(buffer: Buffer): WebSocketPacket<WebSocketPayload> {
    return new this(unpack(buffer));
  }

  static fromJSON(
    payload: WebSocketPayload
  ): WebSocketPacket<WebSocketPayload> {
    return new this(payload);
  }
}
