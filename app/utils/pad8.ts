// app/utils/pad8.ts
export function pad8(n: number | string) {
  return n.toString().padStart(8, "0");
}
export default pad8;
