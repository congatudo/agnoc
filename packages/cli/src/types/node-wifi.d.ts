declare module 'node-wifi' {
  interface InitOptions {
    iface: string | null;
  }

  function init(options: InitOptions): Promise<void>;

  interface Network {
    ssid: string;
    bssid: string;
    mac: string;
    channel: number;
    frequency: number;
    signal_level: number;
    quality: number;
    security: string;
    security_flags: string;
    mode: string;
  }

  function scan(): Promise<Network[]>;

  interface ConnectOptions {
    ssid: string;
    password?: string;
  }

  function connect(options: ConnectOptions): Promise<void>;
  function disconnect(): Promise<void>;
  function getCurrentConnections(): Promise<Network[]>;
}
