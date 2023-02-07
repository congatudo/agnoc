import { json, Request, Response } from "express";
import { debug } from "../utils/debug.util";
import { HttpServer } from "./http-server.emitter";

export class EventLogHttpServer extends HttpServer {
  protected debug = debug("event-log-http-server");

  protected addMiddlewares(): void {
    this.app.use(json());
  }

  protected addRoutes(): void {
    this.app.post(
      "/sweeper-report/robot/event_log",
      this.handleEventLog.bind(this)
    );
    this.app.all("*", this.handleOther.bind(this));
  }

  protected addErrorHandlers(): void {
    this.app.use(this.handleError.bind(this));
  }

  protected handleEventLog(req: Request, res: Response): void {
    this.debug(`handleEventLog`, req.body);

    res.send({
      code: 0,
      result: true,
    });
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
