import { DomainException } from "../exceptions/domain.exception";

export type WaitForCallback = () => boolean;

export interface WaitForOptions {
  timeout: number;
  interval: number;
}

const DEFAULT_OPTIONS = {
  timeout: 2 ** 31 - 1,
  interval: 50,
};

export function waitFor(
  callback: WaitForCallback,
  options?: Partial<WaitForOptions>
): Promise<void> {
  return new Promise((resolve, reject) => {
    const opts = Object.assign({}, DEFAULT_OPTIONS, options);

    function check() {
      const ret = callback();

      if (ret) {
        clearTimeout(abortTimer);
        resolve();
      } else {
        checkTimer = setTimeout(check, opts.interval);
      }
    }

    function abort() {
      clearTimeout(checkTimer);
      reject(new DomainException("Timeout on wait for function"));
    }

    const abortTimer = setTimeout(abort, opts.timeout);
    let checkTimer: NodeJS.Timer;

    process.nextTick(check);
  });
}
