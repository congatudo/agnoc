/** Returns the symmetric difference of two arrays. */
export function symmetricDifference<T>(firstArray: T[], secondArray: T[]): T[] {
  const firstSet = new Set(firstArray);
  const secondSet = new Set(secondArray);

  return [
    ...firstArray.filter((firstItem) => !secondSet.has(firstItem)),
    ...secondArray.filter((secondItem) => !firstSet.has(secondItem)),
  ];
}
