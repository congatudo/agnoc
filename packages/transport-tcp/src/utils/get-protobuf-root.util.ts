import protobuf from 'protobufjs/light';
import type { INamespace, Root } from 'protobufjs/light';

// eslint-disable-next-line node/no-missing-require, @typescript-eslint/no-var-requires
const schema = require('@agnoc/schemas-tcp/json') as INamespace;
const root = protobuf.Root.fromJSON(schema);

export function getProtobufRoot(): Root {
  return root;
}
