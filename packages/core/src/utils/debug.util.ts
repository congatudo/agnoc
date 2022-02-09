import logger, { Debugger } from "debug";
import path from "path";

export type Debug = Debugger;

export function debug(filename: string): Debug {
  const extname = path.extname(filename);
  const basename = path.basename(filename, extname);

  return logger("agnoc").extend("core").extend(basename);
}
