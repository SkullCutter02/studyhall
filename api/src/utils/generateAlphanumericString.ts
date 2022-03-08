export function generateAlphanumericString() {
  return Math.random()
    .toString(36)
    .split("")
    .filter((value, index, self) => self.indexOf(value) === index)
    .join("")
    .slice(2, 8);
}
