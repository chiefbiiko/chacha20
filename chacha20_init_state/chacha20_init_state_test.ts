import { assertEquals, encode } from "./../test_deps.ts";
import { chacha20InitState } from "./chacha20_init_state.ts";

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
  expected: Uint32Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/chacha20_init_state_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: any; }): TestVector => ({
      key: encode(testVector.key, "hex"),
      nonce: encode(testVector.nonce, "hex"),
      counter: testVector.counter,
      expected: Uint32Array.from(testVector.expected)
    })
  );
}

// See https://tools.ietf.org/html/rfc8439
const testVectors: TestVector[] = loadTestVectors();

const constants: Uint32Array = Uint32Array.from([
  0x61707865,
  0x3320646e,
  0x79622d32,
  0x6b206574
]);

testVectors.forEach(
  ({ key, nonce, counter }: TestVector, i: number): void => {
    Deno.test({
      name: `chacha20InitState constants [${i}]`,
      fn(): void {
        const initialState: Uint32Array = chacha20InitState(
          key,
          nonce,
          counter
        );

        assertEquals(initialState.length, 16);
        assertEquals(initialState.subarray(0, 4), constants);
      }
    });
  }
);

testVectors.forEach(
  ({ key, nonce, counter, expected }: TestVector, i: number): void => {
    Deno.test({
      name: `chacha20InitState [${i}]`,
      fn(): void {
        assertEquals(chacha20InitState(key, nonce, counter), expected);
      }
    });
  }
);
