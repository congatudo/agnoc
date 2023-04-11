import { TimeoutException } from '../exceptions/timeout.exception';

/** Callback function signature for the `waitFor` method. */
export type WaitForCallback = () => boolean;

/** Options for the `waitFor` method. */
export interface WaitForOptions {
  /**
   * Timeout in milliseconds. Set to -1 to disable.
   *
   * @defaultValue -1
   */
  timeout: number;

  /**
   * Interval to check the condition in milliseconds.
   *
   * @defaultValue 50
   */
  interval: number;
}

const DEFAULT_OPTIONS = {
  timeout: -1,
  interval: 50,
};

/** Service with utility functions for waiting for a given condition to be met. */
export class WaiterService {
  /** Waits for a callback to return true. */
  async waitFor(callback: WaitForCallback, options?: Partial<WaitForOptions>): Promise<void> {
    return new Promise((resolve, reject) => {
      const opts = Object.assign({}, DEFAULT_OPTIONS, options);
      const isTimeoutEnabled = opts.timeout !== -1;
      let abortTimer: NodeJS.Timer;
      let checkTimer: NodeJS.Timer;

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
        reject(new TimeoutException('Timeout waiting for condition'));
      }

      if (isTimeoutEnabled) {
        abortTimer = setTimeout(abort, opts.timeout);
      }

      process.nextTick(check);
    });
  }
}
