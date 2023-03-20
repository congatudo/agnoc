export abstract class Server {
  abstract listen(): Promise<unknown>;
  abstract close(): Promise<void>;
}
