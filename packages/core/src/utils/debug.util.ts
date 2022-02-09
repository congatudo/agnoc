import path from "path";
import logger, { Debugger } from "debug";

export type Debug = Debugger;

export function debug(filename: string): Debug {
  const extname = path.extname(filename);
  const basename = path.basename(filename, extname);

  return logger("agnoc").extend("core").extend(basename);
}
