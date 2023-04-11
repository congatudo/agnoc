import { promisify } from 'util';
import * as Domain from '@agnoc/domain';
import type { Command } from '../interfaces/command';
import type { Server } from '@agnoc/toolkit';
import type { REPLServer } from 'node:repl';
import type { Context } from 'node:vm';

export interface REPLCommandOptions {
  historyFilename: string;
}

export class REPLCommand implements Command {
  constructor(private readonly server: Server, private readonly repl: REPLServer) {}

  async action(options: REPLCommandOptions): Promise<void> {
    this.setContext(this.repl.context);
    this.addListeners();

    await this.setHistory(options.historyFilename);
    await this.server.listen();
  }

  private addListeners() {
    this.repl.on('reset', (context) => {
      this.setContext(context);
    });

    this.repl.on('exit', () => {
      void this.server.close();
    });
  }

  private setContext(context: Context) {
    Object.assign(context, {
      ...Domain,
      server: this.server,
    });
  }

  private setHistory(historyFilename: string) {
    const setupHistory = promisify(this.repl.setupHistory.bind(this.repl));

    return setupHistory(historyFilename);
  }
}
