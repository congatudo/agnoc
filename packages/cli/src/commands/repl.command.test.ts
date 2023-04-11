import { imock, verify, instance, anything, when, capture } from '@johanblumenberg/ts-mockito';
import { expect } from 'chai';
import { restore } from 'mock-fs';
import { REPLCommand } from './repl.command';
import type { Server } from '@agnoc/toolkit';
import type { Context } from 'node:vm';
import type { REPLServer } from 'repl';

describe('REPLCommand', function () {
  let server: Server;
  let repl: REPLServer;
  let command: REPLCommand;
  let historyFilename: string;

  beforeEach(function () {
    server = imock();
    repl = imock();
    historyFilename = 'historyFilename';
    command = new REPLCommand(instance(server), instance(repl));
  });

  afterEach(function () {
    restore();
  });

  it('should start a server', async function () {
    when(repl.setupHistory(anything(), anything())).thenCall((_, callback: SetupHistoryCallback) =>
      callback(null, instance(repl)),
    );

    await command.action({ historyFilename });

    verify(server.listen()).once();
  });

  it('should set repl context', async function () {
    const context: Context = {};

    when(repl.context).thenReturn(context);
    when(repl.setupHistory(anything(), anything())).thenCall((_, callback: SetupHistoryCallback) =>
      callback(null, instance(repl)),
    );

    await command.action({ historyFilename });

    expect(context.server).to.be.equal(instance(server));
  });

  it('should set repl history', async function () {
    when(repl.setupHistory(anything(), anything())).thenCall((_, callback: SetupHistoryCallback) =>
      callback(null, instance(repl)),
    );

    await command.action({ historyFilename });

    verify(repl.setupHistory(historyFilename, anything())).once();
  });

  it('should throw an error when history cannot be set', async function () {
    const error = new Error('unexpected');

    when(repl.setupHistory(anything(), anything())).thenCall((_, callback: SetupHistoryCallback) =>
      callback(error, instance(repl)),
    );

    await expect(command.action({ historyFilename })).to.be.rejectedWith(error);
  });

  it('should close the server on exit event', async function () {
    when(repl.setupHistory(anything(), anything())).thenCall((_, callback: SetupHistoryCallback) =>
      callback(null, instance(repl)),
    );

    await command.action({ historyFilename });

    const [, onExit] = capture<'exit', () => void>(repl.on).second();

    onExit();

    verify(server.close()).once();
  });

  it('should set the context on reset event', async function () {
    const context: Context = {};

    when(repl.setupHistory(anything(), anything())).thenCall((_, callback: SetupHistoryCallback) =>
      callback(null, instance(repl)),
    );

    await command.action({ historyFilename });

    const [, onReset] = capture<'reset', (context: Context) => void>(repl.on).first();

    onReset(context);

    expect(context.server).to.be.equal(instance(server));
  });
});

type SetupHistoryCallback = (err: Error | null, repl: REPLServer) => void;
