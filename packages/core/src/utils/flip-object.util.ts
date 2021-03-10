type AllValues<T extends Record<PropertyKey, PropertyKey>> = {
  [P in keyof T]: { key: P; value: T[P] };
}[keyof T];

type FlipObject<T extends Record<PropertyKey, PropertyKey>> = {
  [P in AllValues<T>["value"]]: Extract<AllValues<T>, { value: P }>["key"];
};

export function flipObject<T extends Record<PropertyKey, PropertyKey>>(
  obj: T
): FlipObject<T> {
  const entries = Object.entries(obj) as [keyof T, T[keyof T]][];

  return entries.reduce((acc, [key, value]) => {
    // eslint-disable-next-line security/detect-object-injection
    acc[value] = key;
    return acc;
  }, {} as FlipObject<T>);
}
