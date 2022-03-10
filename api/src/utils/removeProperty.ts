export function removeProperty<T>(obj: T, property: keyof T) {
  const { [property]: _, ...rest } = obj;
  return rest;
}
