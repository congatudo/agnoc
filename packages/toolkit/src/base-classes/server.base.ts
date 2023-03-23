export abstract class Server {
  abstract listen(options?: unknown): Promise<unknown>;
  abstract close(): Promise<void>;
}
