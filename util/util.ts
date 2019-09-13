export function xor(
  a: Uint8Array,
  b: Uint8Array,
  l: number,
  c: Uint8Array,
  o: number
): void {
  for (let i: number = 0; i < l; ++i) {
    c[o + i] = a[i] ^ b[i];
  }
}

export function rotateLeft(v: number, c: number): number {
  return (v << c) | (v >>> (32 - c));
}

export function fourLittleEndianBytesToNumber(
  x: Uint8Array,
  o: number
): number {
  return x[o] | (x[o + 1] << 8) | (x[o + 2] << 16) | (x[o + 3] << 24);
}

export function numberToLittleEndianBytes(
  v: number,
  out: Uint8Array,
  l: number,
  o: number
): void {
  const end: number = o + l;

  for (let i: number = o; i < end; ++i) {
    out[i] = v & 0xff;
    v >>= 8;
  }
}
