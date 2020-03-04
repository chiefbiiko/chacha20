import { assertEquals } from "./../test_deps.ts";
import { chacha20QuarterRound } from "./chacha20_quarter_round.ts";

const {
  readFileSync,
  build: { os }
} = Deno;

const DIRNAME = (os !== "win" ? "/" : "") +
  import.meta.url.replace(/^file:\/+|\/[^/]+$/g, "");

interface TestVector {
  initialState: Uint32Array;
  quarterRoundParameters: number[];
  expectedState: Uint32Array;
}

function loadTestVectors(): TestVector[] {
  return JSON.parse(
    new TextDecoder().decode(
      readFileSync(`${DIRNAME}/chacha20_quarter_round_test_vectors.json`)
    )
  ).map(
    (testVector: { [key: string]: any; }): TestVector => ({
      initialState: Uint32Array.from(testVector.initialState),
      quarterRoundParameters: testVector.quarterRoundParameters,
      expectedState: Uint32Array.from(testVector.expectedState)
    })
  );
}

// See https://tools.ietf.org/html/rfc8439
const testVectors: TestVector[] = loadTestVectors();

testVectors.forEach(
  (
    {
      initialState,
      quarterRoundParameters: [a, b, c, d],
      expectedState
    }: TestVector,
    i: number
  ): void => {
    Deno.test({
      name: `chacha20QuarterRound [${i}]`,
      fn(): void {
        const state = Uint32Array.from(initialState);

        chacha20QuarterRound(state, a, b, c, d);

        assertEquals(state, expectedState);
      }
    });
  }
);
