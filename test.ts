import { readFileSync } from "deno";
import { test, assert, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { ChaCha20 } from "./mod.ts";

interface TestVector {
  key: Uint8Array;
  iv: Uint8Array;
  ct: Uint8Array;
  pt?: Uint8Array;
  ibc?: number;
}

function hex2bin(hex: string): Uint8Array {
  if (!/^[0-9a-fA-F]+$/ || hex.length % 2) {
    throw new Error("Invalid hex string");
  }
  let bin: Uint8Array = new Uint8Array(hex.length / 2);
  for (let i: number = hex.length / 2 - 1; i !== -1; i--) {
    bin[i] = parseInt(hex.substr(2 * i, 2), 16);
  }
  return bin;
}

const testVectors: Array<TestVector> = JSON.parse(
  new TextDecoder().decode(readFileSync("./test_vectors.json"))
).map(function parseTestVector(v: {
  key: string;
  iv: string;
  ct: string;
  pt?: string;
  ibc?: number;
}): TestVector {
  return {
    key: hex2bin(v.key),
    iv: hex2bin(v.iv),
    ct: hex2bin(v.ct),
    pt: v.pt ? hex2bin(v.pt) : new Uint8Array(v.ct.length / 2),
    ibc: v.ibc ? v.ibc : null
  };
});

test(function encryption() {
  const chacha20: ChaCha20 = new ChaCha20();
  for (const { key, iv, ct, pt, ibc } of testVectors) {
    const actual: Uint8Array = chacha20.encrypt(key, pt, iv, ibc);
    assert.equal(actual, ct);
  }
});

test(function decryption() {
  const chacha20: ChaCha20 = new ChaCha20();
  for (const { key, iv, ct, pt, ibc } of testVectors) {
    const actual: Uint8Array = chacha20.decrypt(key, ct, iv, ibc);
    assert.equal(actual, pt);
  }
});

runIfMain(import.meta, { parallel: true });
