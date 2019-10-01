# chacha20

![ci](https://github.com/chiefbiiko/chacha20/workflows/ci/badge.svg)

ChaCha20 as defined by [RFC 8439](https://tools.ietf.org/html/rfc8439)

## API

``` ts
export const KEY_BYTES: number = 32;
export const NONCE_BYTES: number = 12;

export function chacha20(
  out: Uint8Array,
  key: Uint8Array,
  nonce: Uint8Array,
  counter: number,
  text: Uint8Array
): void;
```

`chacha20` does not do any input validation. Make sure `key` and `nonce` have correct sizes and that `counter` is an `uint32`. Also, guarantee that `out.byteLength === text.byteLength`.

## License

[MIT](./LICENSE)