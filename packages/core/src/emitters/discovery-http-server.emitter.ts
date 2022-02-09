import { json, Request, Response } from "express";
import { debug } from "../utils/debug.util";
import { HttpServer } from "./http-server.emitter";

const LOCAL_DOMAIN = "cecotec.das.3irobotix.net";

export class DiscoveryHttpServer extends HttpServer {
  protected debug = debug("discovery-http-server");

  protected addMiddlewares(): void {
    this.app.use(json());
  }

  protected addRoutes(): void {
    this.app.post(
      "/service-publish/open/upgrade/try_upgrade",
      this.handleUpgrade.bind(this)
    );
    this.app.all("*", this.handleOther.bind(this));
  }

  protected addErrorHandlers(): void {
    this.app.use(this.handleError.bind(this));
  }

  protected handleUpgrade(req: Request, res: Response): void {
    this.debug("handleUpgrade", req.body);

    const response = {
      code: 0,
      result: {
        targetUrls: [
          `ws://${LOCAL_DOMAIN}:9090`,
          `http://${LOCAL_DOMAIN}:8002`,
          `http://${LOCAL_DOMAIN}:8006`,
        ],
      },
    };

    this.debug("handleUpgrade -> ", JSON.stringify(response));

    res.send(response);
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
