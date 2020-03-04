import { assertEquals, encode } from "./../test_deps.ts";
import { chacha20Block } from "./chacha20_block.ts";

const {
  readFileSync,
  build: { os }
} = Deno;

const DIRNAME = (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  key: Uint8Array;
  nonce: Uint8Array;
  counter: number;
  expected: Uint8Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/chacha20_block_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: any; }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      counter: testVector.counter,
      expected: encode(testVector.expected, "hex")
    })
  );
}

// See https://tools.ietf.org/html/rfc8439
const testVectors: TestVector[] = loadTestVectors();

testVectors.forEach(
  ({ key, nonce, counter, expected }: TestVector, i: number): void => {
    Deno.test({
      name: `chacha20Block [${i}]`,
      fn(): void {
        const actual: Uint8Array = new Uint8Array(64);

        chacha20Block(actual, key, nonce, counter);

        assertEquals(actual, expected);
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, counter, expected }: TestVector, i: number): void => {
    Deno.test({
      name: `chacha20Block accepts external state [${i}]`,
      fn(): void {
        const actual: Uint8Array = new Uint8Array(64);
        const state: Uint32Array = new Uint32Array(16);
        let initialState: Uint32Array;

        chacha20Block(actual, key, nonce, counter, state, initialState!);

        assertEquals(actual, expected);
      }
    });
  }
);
