import { test, runIfMain } from "https://deno.land/std/testing/mod.ts";
import { assertEquals } from "https://deno.land/std/testing/asserts.ts";
import { encode } from "https://denopkg.com/chiefbiiko/std-encoding/mod.ts";
import { chacha20 } from "./mod.ts";

import "./chacha20_init_state/chacha20_init_state_test.ts";
import "./chacha20_block/chacha20_block_test.ts";
import "./chacha20_quarter_round/chacha20_quarter_round_test.ts";

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  plaintext: Uint8Array;
  ciphertext: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(Deno.readFileSync(`./test_vectors.json`))
  ).map(
    (testVector: { [key: string]: any }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      counter: testVector.counter,
      plaintext: encode(testVector.plaintext, "hex"),
      ciphertext: encode(testVector.ciphertext, "hex")
    })
  );
}

// See https://tools.ietf.org/html/rfc8439
const testVectors: TestVector[] = loadTestVectors();

testVectors.forEach(
  (
    { key, nonce, counter, plaintext, ciphertext: expected }: TestVector,
    i: number
  ): void => {
    test({
      name: `chacha20 encryption [${i}]`,
      fn(): void {
        const ciphertext: Uint8Array = new Uint8Array(plaintext.byteLength);

        chacha20(ciphertext, key, nonce, counter, plaintext);

        assertEquals(ciphertext, expected);
      }
    });
  }
);

testVectors.forEach(
  (
    { key, nonce, counter, plaintext: expected, ciphertext }: TestVector,
    i: number
  ): void => {
    test({
      name: `chacha20 decryption [${i}]`,
      fn(): void {
        const plaintext: Uint8Array = new Uint8Array(ciphertext.byteLength);

        chacha20(plaintext, key, nonce, counter, ciphertext);

        assertEquals(plaintext, expected);
      }
    });
  }
);

runIfMain(import.meta, { parallel: true });
