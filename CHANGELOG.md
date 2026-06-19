# Changelog

## 0.4.1

Aligned with the Glide 0.4.1 compiler.

- Expanded the TextMate grammar to the current language: full keyword set
  (`trait`, `dyn`, `defer_err`, `spawn_thread`, `in`, `macro`, `naked`,
  `sizeof`, `c_raw`/`c_include`/`c_link`, `asm`/`volatile`, …), the 128/256-bit
  integer types (`i128`/`u128`/`i256`/`u256`), `@attribute` tags, `name!` macro
  calls, and function-call highlighting so constructor/method names like
  `new(` / `send(` read as functions.
- The bundled LSP now classifies the contextual `new` keyword (and method
  names) as functions in semantic tokens, so `fn new` / `Vector::new()` no
  longer render as a control keyword or type.

## 0.3.2

First Marketplace release, aligned with the Glide 0.3.2 compiler.

- Syntax highlighting for `.glide` (TextMate grammar).
- Language server integration via `glide lsp`: diagnostics, hover,
  go-to-definition, find references, completion, signature help, rename,
  document/workspace symbols, semantic tokens, inlay hints, code actions
  (including "Add dep to glide.glide" and "Fetch missing dep"),
  formatting, and call/type hierarchy.
- `glide.path` setting to point at a non-PATH `glide` binary.
- `glide.trace.server` setting for LSP message tracing.
