# Infomap Online Modernization V1 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Modernize `infomap-online` to a current static-export Next.js baseline, reduce runtime coupling in the interactive app shell, and add layered tests around the Infomap flow without changing the public UX.

**Architecture:** Keep the current pages router and Chakra/MobX stack, but move the app toward clearer boundaries. The first pass upgrades the build/runtime configuration, removes stale integrations, extracts a typed app shell and runtime controller around the large `Infomap` component, and introduces testable browser adapters for storage, file loading, location, and vibration.

**Tech Stack:** Next.js, React, TypeScript, MobX, Chakra UI, Playwright, Vitest, Testing Library

---

### Task 1: Modernize the platform baseline

**Files:**
- Modify: `package.json`
- Modify: `package-lock.json`
- Modify: `next.config.js`
- Modify: `tsconfig.json`

**Steps:**
1. Upgrade Next.js, React, TypeScript, ESLint and related typings to a current supported baseline that keeps Chakra 2 and `chakra-react-select` compatible.
2. Switch static export to modern Next configuration via `output: "export"` instead of `next export`.
3. Keep `/infomap` as `basePath` and preserve deploy compatibility with the existing exported `out/` directory.
4. Add a dedicated unit/integration test command so verification is layered instead of smoke-only.

### Task 2: Thin the page shell and remove stale integrations

**Files:**
- Modify: `src/pages/index.tsx`
- Create: `src/features/home/HomePage.tsx`
- Create: `src/features/home/ContentsDrawer.tsx`

**Steps:**
1. Remove the legacy Universal Analytics snippet.
2. Move layout orchestration for the header, drawer, runtime surface, network preview, documentation, and footer into a dedicated page-shell component.
3. Keep current layout, content order, and error boundaries intact.

### Task 3: Break up the Infomap runtime surface

**Files:**
- Modify: `src/components/Infomap/Infomap.js`
- Create: `src/components/Infomap/Infomap.tsx`
- Create: `src/components/Infomap/InfomapSteps.tsx`
- Create: `src/components/Infomap/InfomapInputPanel.tsx`
- Create: `src/components/Infomap/InfomapRunPanel.tsx`
- Create: `src/components/Infomap/InfomapOutputPanel.tsx`
- Create: `src/components/Infomap/useInfomapController.ts`
- Create: `src/components/Infomap/browser.ts`

**Steps:**
1. Extract browser-side effects behind helpers for query args, file reading, local persistence, scrolling, and vibration.
2. Move runtime state and `@mapequation/infomap` event wiring into a controller hook.
3. Split the large JSX tree into focused sections for steps, input, run state, and outputs.
4. Preserve the visible UI and existing controls so the smoke flow remains valid.

### Task 4: Tighten core store typing and testability

**Files:**
- Modify: `src/store/index.js`
- Create: `src/store/index.tsx`
- Modify: `src/store/Store.js`
- Create: `src/store/Store.ts`
- Modify: `src/store/ParameterStore/ParameterStore.js`
- Create: `src/store/ParameterStore/ParameterStore.ts`
- Modify: `src/store/OutputStore/OutputStore.js`
- Create: `src/store/OutputStore/OutputStore.ts`
- Create: `src/store/types.ts`

**Steps:**
1. Convert the core store entrypoints and runtime-facing stores to TypeScript.
2. Introduce a `createStore()` API and provider-friendly context so unit and integration tests can mount isolated store instances.
3. Preserve MobX semantics and current data flow.

### Task 5: Expand tests around the runtime flow

**Files:**
- Modify: `package.json`
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `tests/unit/parameter-store.test.ts`
- Create: `tests/unit/output-store.test.ts`
- Create: `tests/integration/infomap-runtime.test.tsx`
- Modify: `tests/smoke.spec.ts`

**Steps:**
1. Add Vitest and Testing Library for unit and integration tests.
2. Cover parameter rebuilding, file-parameter handling, output-file derivation, and module parsing.
3. Add an integration test for the “load example -> run Infomap -> outputs enabled” flow using a mocked Infomap runtime.
4. Keep the existing browser smoke for the exported site.

### Task 6: Verification and cleanup

**Files:**
- Modify: `README.md`

**Steps:**
1. Update the README so the modernized dev/build/test workflow is documented.
2. Run `npm run lint`, `npm run typecheck`, unit/integration tests, build, and smoke.
3. Fix regressions before finalizing the branch.
