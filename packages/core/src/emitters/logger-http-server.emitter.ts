import { json, Request, Response } from "express";
import { debug } from "../utils/debug.util";
import { HttpServer } from "./http-server.emitter";

export class LoggerHttpServer extends HttpServer {
  protected debug = debug("logger-http-server");

  protected addMiddlewares(): void {
    this.app.use(json());
  }

  protected addRoutes(): void {
    this.app.all("*", this.handleOther.bind(this));
  }

  protected addErrorHandlers(): void {
    this.app.use(this.handleError.bind(this));
  }

  private handleOther(req: Request, res: Response) {
    this.debug(`handleOther(${req.method} ${req.url}): `, req.body);

    res.sendStatus(404);
  }

  private handleError(err: Error, req: Request, res: Response) {
    this.debug(`handleError(${req.method} ${req.url}): ${err.message}`);

    res.sendStatus(500);
  }
}
