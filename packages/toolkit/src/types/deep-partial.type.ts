/** Type an object to be partially deep. */
export type DeepPartial<T> = {
  [P in keyof T]?: DeepPartial<T[P]>;
};
