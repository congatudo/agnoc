export function promisify<Value, Error>(
  fn: (callback: (err?: Error, value?: Value) => void) => void
): Promise<Value | undefined> {
  return new Promise((resolve, reject) => {
    try {
      fn((err?: Error, value?: Value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    } catch (e) {
      reject(e);
    }
  });
}
