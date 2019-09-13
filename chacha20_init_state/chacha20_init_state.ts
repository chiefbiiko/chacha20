import { fourLittleEndianBytesToNumber } from "./../util/util.ts";

export function chacha20InitState(
  key: Uint8Array,
  nonce: Uint8Array,
  counter: number
): Uint32Array {
  const state: Uint32Array = new Uint32Array(16);

  state[0] = 0x61707865;
  state[1] = 0x3320646e;
  state[2] = 0x79622d32;
  state[3] = 0x6b206574;
  state[4] = fourLittleEndianBytesToNumber(key, 0);
  state[5] = fourLittleEndianBytesToNumber(key, 4);
  state[6] = fourLittleEndianBytesToNumber(key, 8);
  state[7] = fourLittleEndianBytesToNumber(key, 12);
  state[8] = fourLittleEndianBytesToNumber(key, 16);
  state[9] = fourLittleEndianBytesToNumber(key, 20);
  state[10] = fourLittleEndianBytesToNumber(key, 24);
  state[11] = fourLittleEndianBytesToNumber(key, 28);
  state[12] = counter & 0xffffffff;
  state[13] = fourLittleEndianBytesToNumber(nonce, 0);
  state[14] = fourLittleEndianBytesToNumber(nonce, 4);
  state[15] = fourLittleEndianBytesToNumber(nonce, 8);

  return state;
}
