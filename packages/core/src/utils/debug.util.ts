import path from 'path';
import logger, { Debugger } from 'debug';

export function debug(filename: string): Debugger {
  const extname = path.extname(filename);
  const basename = path.basename(filename, extname);

  return logger('agnoc').extend('core').extend(basename);
}
