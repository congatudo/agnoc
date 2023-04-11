import path from 'path';
import logger from 'debug';
import type { Debugger } from 'debug';

/** Create a debug instance from a filename. */
export function debug(filename: string): Debugger {
  const extname = path.extname(filename);
  const basename = path.basename(filename, extname);

  return logger('agnoc').extend(basename);
}
