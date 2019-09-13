import { rotateLeft } from "./../util/util.ts";

export function chacha20QuarterRound(
  state: Uint32Array,
  a: number,
  b: number,
  c: number,
  d: number
): void {
  state[a] += state[b];
  state[d] = rotateLeft(state[d] ^ state[a], 16);
  state[c] += state[d];
  state[b] = rotateLeft(state[b] ^ state[c], 12);
  state[a] += state[b];
  state[d] = rotateLeft(state[d] ^ state[a], 8);
  state[c] += state[d];
  state[b] = rotateLeft(state[b] ^ state[c], 7);
}
