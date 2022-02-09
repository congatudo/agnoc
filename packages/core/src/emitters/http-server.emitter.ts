import { Server } from "http";
import express from "express";
import { Debug } from "../utils/debug.util";
import { promisify } from "../utils/promisify.util";

interface ListenOptions {
  host?: string;
  port: number;
}

export abstract class HttpServer {
  protected abstract debug: Debug;
  protected app = express();
  protected server?: Server;

  constructor() {
    this.addMiddlewares();
    this.addRoutes();
    this.addErrorHandlers();
  }

  async listen(options: ListenOptions): Promise<void> {
    await promisify((callback) => {
      if (options.host) {
        this.server = this.app.listen(options.port, options.host, callback);
      } else {
        this.server = this.app.listen(options.port, callback);
      }
    });

    this.debug(`listening to ${this.address}`);
  }

  get address(): string {
    const address = this.server?.address();

    if (address) {
      if (typeof address !== "string") {
        return `${address.address}:${address.port}`;
      }

      return address;
    }

    return "unknown";
  }

  async close(): Promise<void> {
    this.debug(`closing server`);

    await promisify((callback) => {
      if (!this.server) {
        throw new Error("Server not started");
      }

      this.server.close(callback);
    });
  }

  protected abstract addMiddlewares(): void;
  protected abstract addRoutes(): void;
  protected abstract addErrorHandlers(): void;
}
