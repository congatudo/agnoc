import path from 'path';
import { expect } from 'chai';
import execa from 'execa';
import { describe, it } from 'mocha';
import type { ExecaError } from 'execa';

const filename = path.join(__dirname, '../../bin/agnoc');

describe('cli', function () {
  this.timeout(5000);

  it('displays help by default', async () => {
    try {
      await execa('node', [filename]);
    } catch (e) {
      expect((e as ExecaError).stderr).to.include('Usage: agnoc');
    }
  });

  it('has a decode command', async () => {
    const { stdout } = await execa('node', [filename, 'decode', '-h']);

    expect(stdout).to.include('Usage: agnoc decode');
  });

  it('has a encode command', async () => {
    const { stdout } = await execa('node', [filename, 'encode', '-h']);

    expect(stdout).to.include('Usage: agnoc encode');
  });

  it('has a read command', async () => {
    const { stdout } = await execa('node', [filename, 'read', '-h']);

    expect(stdout).to.include('Usage: agnoc read');
  });

  it('has a wlan command', async () => {
    const { stdout } = await execa('node', [filename, 'wlan', '-h']);

    expect(stdout).to.include('Usage: agnoc wlan');
  });

  it('has a wlan:config command', async () => {
    const { stdout } = await execa('node', [filename, 'wlan:config', '-h']);

    expect(stdout).to.include('Usage: agnoc wlan:config');
  });
});
