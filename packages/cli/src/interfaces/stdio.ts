import type { Duplex } from 'stream';

export interface Stdio {
  stdin: Duplex;
  stdout: Duplex;
  stderr: Duplex;
}
