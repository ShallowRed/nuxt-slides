# nuxt-slides — Architecture Analysis & Refactoring Plan

> Living document. Update task status as work progresses.
> Sections: [Workflow](#0-workflow--repo-setup) · [Parsing](#1-parsing-pipeline) · [Components](#2-components) · [CodiMD sync](#3-codimd-extension-sync) · [New components](#4-new-components)

---

## 0. Workflow & repo setup

### Current state (problems)

The project actually spans **two codebases** that must stay in sync:

| Repo | Role | Location |
|------|------|----------|
| `ShallowRed/nuxt-slides` | Presentation renderer (Nuxt) | `~/Projects/nuxt-slides` |
| CodiMD fork | Live markdown editor (CodiMD) | ❌ `/tmp/codimd` — **lost on reboot** |

The CodiMD fork has remotes:
- `origin` → upstream `hackmdio/codimd` (for pulling upstream fixes)
- `scalingo` → `shallowred-codimd` (Scalingo deployment)

Our custom commits are 6 commits **ahead of `origin/develop`** and have never been pushed to a personal fork — so if `/tmp` is cleared they are gone.

The Makefile's `codimd-push` target hard-codes `/tmp/codimd`, confirming the assumption that this is a permanent location, which it is not.

### Recommended setup

1. **Create a GitHub fork** of `hackmdio/codimd` under `ShallowRed` → `ShallowRed/codimd`
2. **Clone it permanently**: `~/Projects/codimd`
3. **Update remotes**:
   ```
   origin  → https://github.com/ShallowRed/codimd.git (our fork)
   upstream → https://github.com/hackmdio/codimd.git (upstream)
   scalingo → git@ssh.osc-fr1.scalingo.com:shallowred-codimd.git
   ```
4. **Branch strategy**: work in `develop`, deploy to Scalingo from `develop:master`
5. **Update Makefile** — replace hardcoded `/tmp/codimd` with `../codimd` (sibling directory)
6. **VS Code multi-root workspace** — create `nuxt-slides.code-workspace` that includes both `nuxt-slides/` and `codimd/` so they're edited and searched together

### Recommended Makefile additions

```makefile
CODIMD_DIR := ../codimd   # replaces /tmp/codimd

codimd-push:   ## Push CodiMD changes to Scalingo
    cd $(CODIMD_DIR) && git push scalingo develop:master

codimd-status: ## Show CodiMD diff vs. upstream
    cd $(CODIMD_DIR) && git log upstream/develop..HEAD --oneline
```

---

## Tasks — workflow

| # | Task | Status | Notes |
|---|------|--------|-------|
| W1 | Fork `hackmdio/codimd` → `ShallowRed/codimd` on GitHub | ✅ | Done — `ShallowRed/codimd` exists |
| W2 | Clone to `~/Projects/codimd`, set remotes | ✅ | 6 commits cherry-picked + pushed to origin |
| W3 | Update Makefile: `CODIMD_DIR := ../codimd` + add `codimd-status` | ✅ | `codimd-push` also now pushes to origin |
| W4 | Create `nuxt-slides.code-workspace` multi-root VS Code workspace | ✅ | `~/Projects/nuxt-slides.code-workspace` |
| W5 | Add `README` note documenting the two-repo setup | ⬜ | |

---

## 1. Parsing pipeline

### Issues found

#### 1a. `SplitSlide` is the only layout-aware component in the parser — undocumented contract
`getSlideLayout()` in [useSlideParser.ts](src/composables/useSlideParser.ts) walks the AST to detect `SplitSlide` and, when found, puts the entire slide in `body` (bypassing header/article separation). This is the right behaviour but it is:
- The only component with special parser treatment
- Not documented anywhere
- Not extensible — a future full-slide component (e.g. `FullScreenImage` used alone) will silently break

**Fix**: make `getSlideLayout` driven by a explicit allowlist in `presentation.ts`, alongside the component registration.

#### 1b. Subtitle detection is implicit and fragile
The first *italic paragraph* after a heading (`*text*`) becomes `<hgroup>` subtitle. A legitimate warning paragraph written in italics becomes invisible metadata. This will surprise authors.

**Fix**: replace with explicit `:subtitle{text="..."}` inline marker, identical to `:slide-background`. Keep italic-paragraph as a fallback with a deprecation note in the docs.

#### 1c. `slide-background` not registered in `MDC_COMPONENTS` — silent gap
`:slide-background{image="..."}` works because it is extracted and filtered before `MDCRenderer` sees it. But it's invisible as a "component" to any tooling or documentation. Should be documented in `presentation.ts` with a comment block explaining why it is not registered.

#### 1d. `usePresentation.ts` returns `data` but the naming is asymmetrical
The composable returns `{ data, error, status, refresh }` but the `[slug].vue` pages destructure it as `const { data: presentationData }`. Minor but inconsistent — returning `presentationData` directly would be cleaner.

### Tasks — parsing

| # | Task | Status | Notes |
|---|------|--------|-------|
| P1 | Move `SplitSlide` layout detection to a config list in `presentation.ts` | ✅ | `FULL_SLIDE_COMPONENTS = ['SplitSlide', 'split-slide', 'FullScreenImage', ...]` |
| P2 | Add explicit `:subtitle` and `:pretitle` inline components; keep italic para as subtitle fallback | ✅ | Both extracted/filtered before MDCRenderer; pretitle renders above heading in `<hgroup>` |
| P3 | Add explanatory comment in `presentation.ts` for `slide-background` non-registration | ✅ | Docs only |
| P4 | Rename `usePresentation` return value from `data` to `presentationData` | ✅ | Minor refactor |

---

## 2. Components

### 2a. Redundant image components

Three components do overlapping things:

| Component | Has `caption` | Has `lightbox` | Has `fit/position` | Has `rounded/shadow` |
|-----------|:---:|:---:|:---:|:---:|
| `Image` | ✅ (slot) | ✅ (`data-preview-image`) | ✅ | ✅ |
| `ImageWithCaption` | ✅ (slot) | ❌ | ❌ | hardcoded |
| `Lightbox` | ✅ (slot or prop) | ✅ (Reveal.js preview) | ✅ | ✅ |

`ImageWithCaption` is a strict subset of `Image`. `Lightbox` adds a `preview` thumbnail option and explicit Reveal.js `data-preview-image` binding — but `Image` already sets `data-preview-image` unconditionally.

**Fix**: delete `ImageWithCaption` and `Lightbox`; add `preview` prop to `Image` for the thumbnail-vs-full case.

### 2b. Duplicated columns logic

`TwoColumns` and `ThreeColumns` have identical:
- `onMounted` DOM manipulation (H3/H4 auto-split + manual column wrapping)
- Size variant CSS (`.size-xs/sm/md/lg`)
- Responsive breakpoints

`ThreeColumns` additionally has a `count` prop that goes unused in the template (always renders 3 columns via flex).

**Fix**: merge into a single `Columns` component. Props: `count` (default 2), `size`. Supports both explicit `::column` children and H3/H4 auto-split.

### 2c. Size system inconsistency

Size classes exist on:
- `Column.vue` — `.size-xs/sm/md/lg/xl` on individual columns
- `TwoColumns.vue` / `ThreeColumns.vue` — `.size-xs/sm/md/lg` on the container
- `ThreeColumns` has a typed `size` prop; `TwoColumns` applies size via CSS class from MDC

After the merge, the size system should be unified: the `Columns` wrapper exposes `size`, children can optionally override via class.

### 2d. `onMounted` DOM mutation is un-Vue

Both column components mutate `innerHTML` after mount. This:
- Breaks hot-module reload (the slot content is disposed then reconstructed)
- Is invisible to Vue devtools
- Creates a race if `MDCRenderer` re-renders the slot

The fix depends on the approach chosen:
- **Short-term**: guard with a `watch` refactor so mutation only runs once
- **Medium-term**: use CSS-only auto-splitting via `:nth-child` + a sentinel attribute, bypassing the need for DOM manipulation entirely when `::column` wrappers are explicitly used

### 2e. `Quote` has hardcoded purple gradient

`Quote.vue` has a hardcoded `background: linear-gradient(135deg, #667eea 0%, #764ba2 100%)` rather than using theme tokens. It will look out of place on the DSFR or minimal theme.

**Fix**: use CSS custom properties so themes can override.

### Tasks — components

| # | Task | Status | Notes |
|---|------|--------|-------|
| C1 | Delete `ImageWithCaption`, delete `Lightbox` | ✅ | After C2 |
| C2 | Add `preview` prop to `Image`; make `data-preview-image` conditional | ✅ | Backward compat |
| C3 | Create `Columns.vue` merging `TwoColumns` + `ThreeColumns` logic | ✅ | Props: `count`, `size` |
| C4 | Delete `TwoColumns.vue`, `ThreeColumns.vue` | ✅ | After C3 |
| C5 | Register `Columns` in `MDC_COMPONENTS` with aliases `TwoColumns`, `ThreeColumns` | ✅ | Backward compat |
| C6 | Make `Quote` background use CSS custom properties | ✅ | |

---

## 3. CodiMD extension sync

### Component list mismatch

The CodiMD preview (`extra.js` + `mdc-components.css`) is out of sync with nuxt-slides on both sides:

**Missing from CodiMD preview** (nuxt-slides has these, CodiMD shows raw text):

| Component | Fix needed |
|-----------|------------|
| `Quote` | Add CSS class + JS registration |
| `Iframe` | Add CSS class + JS registration |
| `PreviewLink` | Add CSS class + JS registration |
| `FullScreenImage` | Add CSS class + JS registration |
| `ImageWithCaption` | Add if kept, or drop after C1 |

**Ghost components in CodiMD** (no Vue implementation, content silently renders as plain text in nuxt-slides):

| Component | Decision |
|-----------|----------|
| `Callout` | ❌ Drop — removed from project; replaced with blockquotes in presentations |
| `Centered` | ❌ Drop — removed; content unwrapped in presentations |
| `ComparisonTable` | ❌ Drop — too app-like, use a regular table |
| `Timeline` | ❌ Drop — too complex for minimal palette |
| `StepsList` | ❌ Drop — a styled `<ol>` suffices |

### Icon name format mismatch

| Stack | Expected format | Example |
|-------|----------------|---------|
| nuxt-slides (`IconInline`) | Iconify: `ri:home-line` | `:i{name="ri:home-line"}` |
| CodiMD preview (`mdc_icon` rule) | Remix CSS class: `ri-home-line` | Same syntax, different format |

A note authored in CodiMD using `:i{name="ri:home-line"}` renders correctly in nuxt-slides but shows a broken icon in CodiMD (the CSS class `ri:home-line` is invalid). The reverse is also true.

**Fix**: standardise on `ri-home-line` format everywhere. Update `IconInline.vue` to translate `ri-name` → `ri:name` for Iconify, or switch the Nuxt Icon usage to accept both.

### `::Image` self-closing vs closing `::` mismatch

Documented as self-closing in nuxt-slides (`::Image{src="..."}` — no closing `::`), but the CodiMD 2-colon block rule requires a matching `::` closer. In CodiMD the author must write `::Image{src="..."}↵::`.

**Fix** (either):
- Make the CodiMD block rule treat `Image` as optionally self-closing
- Or document that `Image` in CodiMD always needs `::` closer (and accept the minor friction)

### Tasks — CodiMD sync

| # | Task | Status | Notes |
|---|------|--------|-------|
| S1 | Add `Quote`, `Iframe`, `PreviewLink`, `FullScreenImage` to `mdcComponents` array in `extra.js` | ✅ | + `Columns` |
| S2 | Add matching CSS rules in `mdc-components.css` for those components | ✅ | Full rewrite of CSS file |
| S3 | Remove `ComparisonTable`, `Timeline`, `StepsList`, `Callout`, `Centered`, `Lightbox` from CodiMD | ✅ | All ghost/deleted components |
| S4 | ~~Add `Callout` CSS + JS rule in CodiMD~~ | N/A | Callout removed from project |
| S5 | Add `Columns` to CodiMD list (alias for `TwoColumns`/`ThreeColumns`) | ✅ | With aliases |
| S6 | Standardize icon format: update `IconInline.vue` to accept `ri-name` → translate to `ri:name` | ✅ | |
| S7 | Update `mdc_icon` renderer in CodiMD: normalise `ri:name` → `ri-name` | ✅ | |
| S8 | Self-closing `Image` in CodiMD: accepted as-is (always needs `::` closer) | ✅ | Convention documented |
| S9 | Add `slide-background`/`pretitle`/`subtitle` inline hints to CodiMD preview | ✅ | `mdc_annotation` rule |

---

## 4. New components

Kept minimal: only components that address real recurring needs in slide decks and cannot be approximated by existing primitives + markdown.

### N1 — `Callout` (high priority)

Already referenced in CodiMD preview, no Vue implementation. One of the most used presentation patterns.

```markdown
::Callout{type="info"}
This is an informational note.
::
```

Types: `info`, `tip`, `warning`, `danger`. Style via theme tokens (DSFR: use official DSFR notice colors).

### N2 — `Steps` (medium priority)

A visually distinguished ordered list for process/roadmap slides. Distinct from a plain `<ol>` — large numbered circles, better vertical rhythm.

```markdown
::Steps
1. First step description
2. Second step
3. Third step
::
```

### N3 — `Badge` inline (low priority)

Inline tag/chip for status labels. Simple CSS, often needed for feature matrices or roadmap slides.

```markdown
Feature X :badge[Stable] vs. Feature Y :badge[Beta]{type="warning"}
```

### Tasks — new components

| # | Task | Status | Notes |
|---|------|--------|-------|
| N1 | ~~Create `Callout.vue`~~ | ❌ Dropped | User removed Callout from project |
| N2 | ~~Create `Steps.vue`~~ | ❌ Dropped | User: "nevermind the new components" |
| N3 | ~~Create `Badge.vue`~~ | ❌ Dropped | Same |

---

## Orchestration order

Dependencies flow as:

```
W1 → W2 → W3, W4        (unblock CodiMD workflow first)

C3 → C4 → C5            (merge columns)
C2 → C1                 (clean up images)

N1 → S4                 (Callout: Vue first, then CodiMD CSS)
C3 → S5                 (Columns: Vue first, then CodiMD)
S6 → S7                 (icon format: nuxt-slides first, then CodiMD)

P1, P2, P3, P4          (parser: independent, can be batched)
S1, S2, S3, S8, S9      (CodiMD sync: mostly additive, can be batched)
```

**Suggested sprint order for subagent work:**
1. **W1–W5** — fix the repo setup (manual, owner does this)
2. **P1, P3, P4** — parser cleanup (one subagent, low risk)
3. **C3, C4, C5** + **C2, C1** — component consolidation (one subagent per group)
4. **N1, N2** — new components (one subagent)
5. **S1–S9** — CodiMD sync (one subagent, separate workspace)
6. **C6, P2, S6, S7, N3** — polish pass
