# @agnoc/cli

[Agnoc](https://github.com/adrigzr/agnoc) command line interface (CLI).

## Install

Using npm:

```
$ npm install -g @agnoc/cli
```

or using yarn:

```
$ yarn add -g @agnoc/cli
```

The tool is named `agnoc`:

```
$ agnoc --help
```

## Commands

### Wlan

This command configures the wifi connection of the robot to the given one.

```
$ agnoc wlan my-wifi my-password
```

### Read

This command reads a binary pcap dump file generated with [tcpdump](https://www.tcpdump.org/) and prints packets to
stdout.

```
$ agnoc read dump.pcap
[ID: 7a479a0fbb978c12] [Flow: 1] [UID: 1] [DID: 2] [OP: DEVICE_GETTIME_RSP] {"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}
```

It is possible to output to json format to be able to parse and manipulate it:

```
$ agnoc read --json dump.pcap

[
  {
    "ctype": 2,
    "flow": 1,
    "deviceId": 1,
    "userId": 2,
    "sequence": "7a479a0fbb978c12",
    "payload": {
      "opcode": {
        "code": "0x1012",
        "name": "DEVICE_GETTIME_RSP"
      },
      "object": {
        "result": 0,
        "body": {
          "deviceTime": 1606129555,
          "deviceTimezone": 3600
        }
      }
    }
  }
]
```

It is possible to use stdin as input, for example:

```
$ cat dump.pcap | agnoc read -

[ID: 7a479a0fbb978c12] [Flow: 1] [UID: 2] [DID: 1] [OP: DEVICE_GETTIME_RSP] {"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}
```

### Decode

This command reads a binary tcp flow file generated with [WireShark](https://www.wireshark.org/) or
[TShark](https://www.wireshark.org/docs/man-pages/tshark.html) and prints packets to stdout.

```
$ agnoc decode example.bin

[ID: 7a479a0fbb978c12] [Flow: 1] [UID: 1] [DID: 2] [OP: DEVICE_GETTIME_RSP] {"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}
```

It is possible to output to json format to be able to parse and manipulate it:

```
$ agnoc decode --json example.bin

[
  {
    "ctype": 2,
    "flow": 1,
    "deviceId": 1,
    "userId": 2,
    "sequence": "7a479a0fbb978c12",
    "payload": {
      "opcode": {
        "code": "0x1012",
        "name": "DEVICE_GETTIME_RSP"
      },
      "object": {
        "result": 0,
        "body": {
          "deviceTime": 1606129555,
          "deviceTimezone": 3600
        }
      }
    }
  }
]
```

It is possible to use stdin as input, for example:

```
$ echo "2500000002010100000002000000128c97bb0f9a477a121008001a090893afeefd0510901c" | xxd -r -p | agnoc decode -

[ID: 7a479a0fbb978c12] [Flow: 1] [UID: 2] [DID: 1] [OP: DEVICE_GETTIME_RSP] {"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}
```

## Encode

As a reverse operation to `decode`, `encode` command allows to build a binary dump using json as input:

```
$ agnoc encode example.json | xxd -r -p

2500000002010200000001000000128c97bb0f9a477a121008001a090893
afeefd0510901c
```

Also, it can be used with stdin:

```
$ echo '[{"ctype":2,"flow":1,"deviceId":1,"userId":2,"sequence":"7a479a0fbb978c12","opcode":{"code":"0x1012","name":"DEVICE_GETTIME_RSP"},"payload":{"result":0,"body":{"deviceTime":1606129555,"deviceTimezone":3600}}}]' | agnoc encode - | xxd -p

2500000002010200000001000000128c97bb0f9a477a121008001a090893
afeefd0510901c
```
