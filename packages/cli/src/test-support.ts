import type { JSONPacket } from './streams/packet-encode-transform.stream';

export function givenAJSONPacket(): JSONPacket<'DEVICE_GETTIME_RSP'> {
  return {
    ctype: 1,
    flow: 0,
    deviceId: 2,
    userId: 3,
    sequence: '7a479a0fbb978c12',
    payload: {
      opcode: 'DEVICE_GETTIME_RSP',
      data: {
        result: 1,
        body: {
          deviceTime: 2,
        },
      },
    },
  };
}
