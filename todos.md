# Transpiler Reboot – High-Level Plan

## Phase 0 – Scope & Foundations
- [ ] Capture requirements: Ruby subset, target environments (CLI, browser), performance KPIs
- [ ] Design architecture: pipeline (tokenizer → parser → IR → optimizer → emitter), runtime layering
- [ ] Define testing strategy: snapshot suite, perf benchmarks, compatibility corpus

## Phase 1 – Infrastructure
- [ ] Build IR scaffolding enabling data-flow/type analysis
- [ ] Implement module for incremental analysis (basic type inference, constant propagation)
- [ ] Establish plugin system for runtime helpers (lazy inclusion/tree-shaking)

## Phase 2 – Incremental Transpiler Core
- [ ] Rewrite tokenizer with full Ruby literal coverage (regex, heredocs, encodings)
- [ ] Rebuild parser with annotated AST (types, mutability, purity flags)
- [ ] Introduce baseline emitter that mirrors Ruby semantics using new runtime hooks

## Phase 3 – Optimizations for “Fast” Mode
- [ ] Develop heuristics for safe direct calls/field access (method_missing detection, class sealing)
- [ ] Implement numeric/string specialization (inline ops, literal folding, bang-method SSA)
- [ ] Add block/lambda lowering to idiomatic JS (arrow conversion when capture-free)

## Phase 4 – Runtime Specialization
- [ ] Factor runtime helpers into granular modules (strings, enumerables, control flow)
- [ ] Provide strict vs fast variants per helper, selectable at emit time
- [ ] Integrate lazy-loading/tree-shaking for browser bundle

## Phase 5 – Validation & Tooling
- [ ] Port existing examples (full_test.rb, DOM) to new pipeline, compare outputs/perf
- [ ] Create regression harness comparing strict vs fast behavior
- [ ] Update CLI/GUI tooling (watch mode, diagnostics, source maps)

## Phase 6 – Stretch Goals
- [ ] Investigate optional “unsafe” mode sacrificing semantics for more JS-native output
- [ ] Explore WASM/JIT backends for hotspot sections
- [ ] Document migration guide, developer API, contribution guidelines
