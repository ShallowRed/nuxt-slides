# Nuxt Slides — Deploy & Development Commands
# Usage: make <target>

PRESENTATIONS_DIR := presentations
CODIMD_DIR := ../codimd

# Standalone bundle config — override on the command line if needed:
#   make bundle-standalone BUNDLE_SLUG=other-presentation STORYBOOK_DIR=/other/path
BUNDLE_SLUG     ?= pistes-vitrine-t3-2026
STORYBOOK_DIR   ?= ../les-entreprises-s-engagent/apps/storybook/storybook-static
STORYBOOK_URL   ?= /_storybook
BUNDLE_OUT      ?= dist-standalone
# Base URL the bundle is served under. `/nuxt-slides/` = GitHub project pages
# (deploy-standalone). Override to `/` for a bundle served at its own origin
# (e.g. `make bundle-frozen` previewed locally) so root-absolute asset URLs
# hardcoded in the app (themes, backgrounds) resolve.
BUNDLE_BASE_URL ?= /nuxt-slides/
# Reduced Storybook built for a frozen deck (DDR-017, mécanisme C).
STORYBOOK_ROOT  ?= $(dir $(STORYBOOK_DIR))
STORYBOOK_REDUCED ?= /tmp/storybook-reduced-$(BUNDLE_SLUG)
DECK_PATH       ?= presentations/public/$(BUNDLE_SLUG).md
# A frozen bundle is served at its own origin → base `/` (override to `/nuxt-slides/`
# only when deploying it as a GitHub project page).
FROZEN_BASE_URL ?= /
# Élagage (DDR-017 §2.a) : prune the reduced Storybook's static assets down to the
# set the embedded stories actually reference (frees ~80 Mo of dead photos/fonts).
# Set PRUNE_ASSETS=0 to keep the full staticDir (debugging a missing-asset case).
PRUNE_ASSETS    ?= 1
# Theme of the deck being frozen — drives the reduced public/ (which backgrounds to
# keep) and the Reveal-only deck's injected theme stylesheet. Default 'lee'; the
# freeze-presentation target should pass the deck's actual theme.
BUNDLE_THEME    ?= lee
# StaticDir top-level asset names host-frozen mirrors to the origin root, which
# `nuxt generate` then re-aspirates into the next bundle. Stripped from each
# bundle's output (cp step). EXCLUDES backgrounds/ and themes/ — those are legit
# tracked repo source, never mirrored, never stripped.
MIRROR_ASSET_DIRS ?= vitrine fonts images geojson icons documents manifests

# ─── Development ──────────────────────────────────────────────

.PHONY: dev preview build generate

dev: ## Start dev server
	pnpm dev

preview: ## Preview production build locally
	pnpm preview

build: ## Build for production (SSR)
	pnpm build

generate: ## Generate static site (SSG)
	pnpm generate

themes: ## Build themes
	pnpm build:themes

themes-watch: ## Build themes in watch mode
	pnpm dev:theme

# ─── Presentation lifecycle (DDR-018) ─────────────────────────
# ALIAS = stable alias from presentations/registry.yml
ALIAS ?= atelier-mecenes

.PHONY: pull-note freeze-presentation host-frozen

# Where frozen bundles are hosted (quick-win): static under nuxt-slides public/,
# served by Nitro at /frozen/<alias>/. The stable alias /p/<alias> redirects here.
# Frozen-presentation hosting lives OUTSIDE public/ (served by Nitro via
# nuxt.config publicAssets) so `nuxt generate` never aspirates already-frozen
# bundles into the next build. `.frozen/<alias>/` → /frozen/<alias>/ ;
# `.frozen-mirror/` → / (origin-root asset safety net, bundles don't depend on it).
FROZEN_HOST_DIR   ?= .frozen
FROZEN_MIRROR_DIR ?= .frozen-mirror
# Skip the CodiMD rapatriation step (PULL=0) when the repo stub is already authoritative.
PULL ?= 1

pull-note: ## Pull a registry alias's live CodiMD body into its repo stub (keeps frontmatter)
	@node scripts/pull-note.js "$(ALIAS)" $(if $(NUXT_CODIMD_URL),--codimd-url "$(NUXT_CODIMD_URL)",)

host-frozen: ## Host the built bundle under .frozen/<alias>/ (served by Nitro at /frozen/<alias>/, outside public/)
	@rm -rf "$(FROZEN_HOST_DIR)/$(ALIAS)"
	@mkdir -p "$(FROZEN_HOST_DIR)"
	@cp -r "$(BUNDLE_OUT)" "$(FROZEN_HOST_DIR)/$(ALIAS)"
	@echo "▶  Mirroring the deck's referenced assets to the origin-root safety net (.frozen-mirror/)"
	@echo "   (The bundle is self-contained — its stories' asset URLs are rebased to"
	@echo "    relative, so this mirror is a future-proof net for any non-rebased"
	@echo "    consumer, NOT a dependency. It lives outside public/ so nuxt generate"
	@echo "    never aspirates it into the next bundle.)"
	@mkdir -p "$(FROZEN_MIRROR_DIR)"
	@node scripts/mirror-storybook-assets.js "$(BUNDLE_OUT)/_storybook" "$(FROZEN_MIRROR_DIR)"
	@echo "▶  Writing provenance snapshot (alias, slug, theme, commit, registry entry)"
	@mkdir -p "$(FROZEN_HOST_DIR)/$(ALIAS)/source"
	@slug=$$(node scripts/registry-get.js "$(ALIAS)" slug); theme=$$(node scripts/registry-get.js "$(ALIAS)" theme); \
	printf '{\n  "alias": "%s",\n  "slug": "%s",\n  "theme": "%s",\n  "frozenAt": "%s",\n  "gitCommit": "%s"\n}\n' \
		"$(ALIAS)" "$$slug" "$$theme" "$$(date -u +%Y-%m-%dT%H:%M:%SZ)" "$$(git rev-parse --short HEAD 2>/dev/null || echo unknown)" \
		> "$(FROZEN_HOST_DIR)/$(ALIAS)/source/provenance.json"
	@node scripts/registry-get.js "$(ALIAS)" --entry-yaml > "$(FROZEN_HOST_DIR)/$(ALIAS)/source/registry-entry.yml" 2>/dev/null || true
	@echo "✅ Hosted at $(FROZEN_HOST_DIR)/$(ALIAS) → served at /frozen/$(ALIAS)/ (+ source/ markdown & provenance)"

freeze-presentation: ## Rapatriate + freeze + host a presentation, then remind to flip lifecycle (DDR-018)
	@slug=$$(node scripts/registry-get.js "$(ALIAS)" slug) || { echo "❌ Alias '$(ALIAS)' not in registry"; exit 1; }; \
	theme=$$(node scripts/registry-get.js "$(ALIAS)" theme); theme=$${theme:-lee}; \
	echo "▶  Alias '$(ALIAS)' → stub slug '$$slug' (theme '$$theme' from frontmatter)"; \
	if [ "$(PULL)" = "1" ]; then \
		echo "▶  [1/4] Rapatriate live note → repo stub"; \
		$(MAKE) --no-print-directory pull-note ALIAS="$(ALIAS)"; \
	else echo "▶  [1/4] Skipping rapatriation (PULL=0) — repo stub is authoritative"; fi; \
	echo "▶  [2/4] Freeze the deck into a self-contained Reveal-only bundle (theme '$$theme')"; \
	$(MAKE) --no-print-directory bundle-frozen BUNDLE_SLUG="$$slug" BUNDLE_THEME="$$theme" FROZEN_BASE_URL="/frozen/$(ALIAS)/"; \
	echo "▶  [3/4] Host the bundle under $(FROZEN_HOST_DIR)/$(ALIAS)/"; \
	$(MAKE) --no-print-directory host-frozen ALIAS="$(ALIAS)"
	@echo "▶  [4/4] Flip lifecycle in the registry"
	@echo "   → Set 'lifecycle: frozen' (+ frozenBundle: $(ALIAS)) for '$(ALIAS)' in presentations/registry.yml"
	@echo "   /p/$(ALIAS) then redirects to /frozen/$(ALIAS)/ — CodiMD no longer needed, URL unchanged."

# ─── Standalone bundle ────────────────────────────────────────

.PHONY: bundle-standalone bundle-storybook bundle-frozen freeze-check

bundle-storybook: ## (Re)build Storybook static output
	cd $(STORYBOOK_DIR)/.. && pnpm build-storybook

freeze-check: ## Report which stories a deck embeds + flag broken refs (no build)
	@node scripts/freeze-deck.js "$(DECK_PATH)" "$(abspath $(STORYBOOK_DIR))"

bundle-frozen: ## Freeze a deck into a self-contained bundle with a REDUCED Storybook (DDR-017)
	@echo "▶  Resolving stories embedded by '$(BUNDLE_SLUG)'"
	@test -f "$(abspath $(STORYBOOK_DIR))/index.json" || { \
		echo "❌ Need a built Storybook index at $(STORYBOOK_DIR)/index.json — run 'make bundle-storybook' first"; exit 1; }
	@globs=$$(node scripts/freeze-deck.js "$(DECK_PATH)" "$(abspath $(STORYBOOK_DIR))" --globs-only) || { \
		echo "❌ Freeze aborted: deck references stories absent from Storybook (see above)"; exit 1; }; \
	echo "▶  Building reduced Storybook → $(STORYBOOK_REDUCED)"; \
	rm -rf "$(STORYBOOK_REDUCED)"; \
	( cd "$(abspath $(STORYBOOK_ROOT))" && STORYBOOK_STORIES_GLOBS="$$globs" pnpm build-storybook --quiet -o "$(STORYBOOK_REDUCED)" )
ifeq ($(PRUNE_ASSETS),1)
	@echo "▶  Pruning unreferenced static assets from the reduced Storybook (élagage, DDR-017 §2.a)"
	@node scripts/prune-storybook-assets.js "$(STORYBOOK_REDUCED)"
endif
	@echo "▶  Bundling deck with the reduced Storybook"
	@$(MAKE) --no-print-directory bundle-standalone STORYBOOK_DIR="$(STORYBOOK_REDUCED)" BUNDLE_BASE_URL="$(FROZEN_BASE_URL)" BUNDLE_THEME="$(BUNDLE_THEME)"
	@echo "✅ Frozen bundle ready (base $(FROZEN_BASE_URL)) — embeds only the deck's screens."
	@echo "   Preview: cd $(BUNDLE_OUT) && python3 -m http.server 8099  →  http://localhost:8099/slides/$(BUNDLE_SLUG)--standalone/"

deploy-standalone: bundle-standalone ## Build + deploy standalone bundle to GitHub Pages
	@echo "▶  Pushing dist-standalone to gh-pages branch"
	@cd dist-standalone && git init -b gh-pages && printf '_storybook/images/\n_storybook/documents/\n' > .gitignore && git add -A && git commit -m "Deploy standalone bundle" && git push --force $(shell git remote get-url origin) gh-pages
	@echo "✅ Deployed to GitHub Pages"

bundle-standalone: ## Build a self-contained static site (Nuxt + Storybook at same origin)
	@echo "▶  Setting up standalone bundle for '$(BUNDLE_SLUG)' (base $(BUNDLE_BASE_URL))"
	@NUXT_APP_BASE_URL="$(BUNDLE_BASE_URL)" node scripts/bundle-standalone.js "$(BUNDLE_SLUG)" "$(abspath $(STORYBOOK_DIR))" "$(STORYBOOK_URL)" setup
	@echo "▶  Building reduced public/ (theme '$(BUNDLE_THEME)' assets only, not the whole repo public/)"
	@node scripts/build-reduced-public.js "$(BUNDLE_THEME)" "/tmp/bundle-public-$(BUNDLE_SLUG)"
	@echo "▶  Generating Nuxt static site (slug only: $(BUNDLE_SLUG)--standalone)"
	@BUNDLE_ONLY_SLUG="$(BUNDLE_SLUG)--standalone" BUNDLE_PUBLIC_DIR="/tmp/bundle-public-$(BUNDLE_SLUG)" BUNDLE_THEME="$(BUNDLE_THEME)" NUXT_APP_BASE_URL="$(BUNDLE_BASE_URL)" pnpm generate
	@echo "▶  Injecting Storybook into output"
	@rm -rf "$(BUNDLE_OUT)"
	@cp -r .output/public "$(BUNDLE_OUT)"
	@# `nuxt generate` copies the WHOLE public/ into the bundle. That public/ is
	@# polluted by host-frozen's origin-root asset mirror (public/frozen/<alias>/,
	@# public/vitrine/, public/fonts/…), so every new bundle aspirates the previous
	@# bundles AND their mirrored assets (a vitrine-only photo ending up in the
	@# atelier bundle). Strip these aspirated artefacts — nitro.ignore governs only
	@# routes, not the public/ copy, so the cleanup belongs here at the cp step.
	@rm -rf "$(BUNDLE_OUT)/frozen" "$(BUNDLE_OUT)/.frozen-mirror"
	@for d in $(MIRROR_ASSET_DIRS); do rm -rf "$(BUNDLE_OUT)/$$d"; done
	@cp -r "$(abspath $(STORYBOOK_DIR))/." "$(BUNDLE_OUT)/_storybook"
	@echo "▶  Rebasing embedded stories' root-absolute asset URLs → relative (bundle autoportant, DDR-017 §2.a-ter)"
	@node scripts/rebase-storybook-assets.js "$(BUNDLE_OUT)/_storybook"
	@echo "▶  Copying standalone Reveal.js dist (Reveal-only deck, no Nuxt runtime)"
	@mkdir -p "$(BUNDLE_OUT)/reveal"
	@cp node_modules/reveal.js/dist/reveal.js "$(BUNDLE_OUT)/reveal/reveal.js"
	@cp node_modules/reveal.js/dist/reveal.css "$(BUNDLE_OUT)/reveal/reveal.css"
	@echo "▶  Pruning orphaned Nuxt JS runtime (deck is Reveal-only via noScripts; keep _nuxt CSS)"
	@# noScripts means no JS is referenced, so delete the JS chunks. Keep any _nuxt
	@# CSS: a composable-level import (RevealPresentation imports reveal.css) emits a
	@# linked _nuxt/*.css that inlineStyles doesn't fold in, so the link must resolve.
	@find "$(BUNDLE_OUT)/_nuxt" -type f -name '*.js' -delete 2>/dev/null || true
	@rm -f "$(BUNDLE_OUT)/slides/$(BUNDLE_SLUG)--standalone/_payload.json"
	@echo "▶  Linking MDC component CSS chunks into the deck (inlineStyles misses MDC-rendered components)"
	@node scripts/link-deck-css.js "$(BUNDLE_OUT)" "$(BUNDLE_SLUG)--standalone"
	@echo "▶  Embedding the deck's source markdown (regenerate/re-diffuse later, 'au cas où')"
	@# Both the repo-faithful source (storybook: localhost) and the build-patched
	@# --standalone variant (storybook: /_storybook, = exactly what produced this
	@# bundle). Copied BEFORE teardown, which deletes the temp --standalone.md.
	@mkdir -p "$(BUNDLE_OUT)/source"
	@cp "presentations/public/$(BUNDLE_SLUG).md" "$(BUNDLE_OUT)/source/$(BUNDLE_SLUG).md" 2>/dev/null || true
	@cp "presentations/public/$(BUNDLE_SLUG)--standalone.md" "$(BUNDLE_OUT)/source/$(BUNDLE_SLUG)--standalone.md" 2>/dev/null || true
	@echo "▶  Cleaning up temp files"
	@node scripts/bundle-standalone.js "$(BUNDLE_SLUG)" "$(abspath $(STORYBOOK_DIR))" "$(STORYBOOK_URL)" "" teardown
	@echo ""
	@echo "✅ Standalone bundle ready in ./$(BUNDLE_OUT)/"
	@echo "   Presentation : $(BUNDLE_OUT)/slides/$(BUNDLE_SLUG)--standalone"
	@echo "   Storybook    : $(BUNDLE_OUT)/_storybook/"

# ─── Content (submodule) ─────────────────────────────────────

.PHONY: content-init content-pull content-status content-commit content-push

content-init: ## Initialize presentations submodule (first time setup)
	git submodule update --init --recursive

content-pull: ## Pull latest content from private repo
	cd $(PRESENTATIONS_DIR) && git pull origin main

content-status: ## Show git status of presentations submodule
	@echo "═══ Presentations (submodule) ═══"
	@cd $(PRESENTATIONS_DIR) && git status --short
	@echo ""
	@for folder in public semi-private private draft; do \
		count=$$(find "$(PRESENTATIONS_DIR)/$$folder" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' '); \
		echo "  $$folder: $$count file(s)"; \
	done

content-commit: ## Commit content changes in submodule
	@cd $(PRESENTATIONS_DIR) && \
		if git status --porcelain | grep -q "^"; then \
			git add -A && \
			read -p "Commit message: " msg && \
			git commit -m "$$msg" && \
			echo "✅ Committed in submodule. Run 'make content-push' to push."; \
		else \
			echo "ℹ️  No content changes"; \
		fi

content-push: ## Push content submodule to GitHub (triggers Vercel rebuild)
	@echo "📤 Pushing content..."
	@cd $(PRESENTATIONS_DIR) && git push origin main
	@echo "✅ Content pushed. Vercel will rebuild."

# ─── Deploy ──────────────────────────────────────────────────

.PHONY: deploy-app push-app deploy-content deploy-all

deploy-app: ## Commit app changes
	@echo "🚀 Deploying app..."
	@git add -A
	@if git diff --cached --quiet; then \
		echo "ℹ️  No app changes to deploy"; \
	else \
		read -p "Commit message: " msg; \
		git commit -m "$$msg"; \
		echo "✅ Committed. Run 'make push-app' to push."; \
	fi

push-app: ## Push app to GitHub (triggers Vercel deploy)
	git push origin main
	@echo "✅ App pushed. Vercel will deploy."

deploy-content: content-commit content-push ## Commit + push content
	@echo "✅ Content deployed."
	@echo "   Updating submodule ref in app repo..."
	@git add $(PRESENTATIONS_DIR)
	@git commit -m "Update presentations submodule" 2>/dev/null || true

deploy-all: deploy-content deploy-app push-app ## Deploy content then app

# ─── CodiMD ──────────────────────────────────────────────────

.PHONY: codimd-push codimd-status

codimd-push: ## Push CodiMD changes to Scalingo
	@if [ ! -d "$(CODIMD_DIR)" ]; then \
		echo "❌ $(CODIMD_DIR) not found — clone ShallowRed/codimd there first"; \
		exit 1; \
	fi
	cd $(CODIMD_DIR) && git push origin develop && git push scalingo develop:master

codimd-status: ## Show our custom commits vs upstream hackmdio/codimd
	@if [ ! -d "$(CODIMD_DIR)" ]; then \
		echo "❌ $(CODIMD_DIR) not found"; \
		exit 1; \
	fi
	@echo "═══ Custom commits ahead of upstream ═══"
	@cd $(CODIMD_DIR) && git fetch upstream --quiet 2>/dev/null; git log upstream/develop..develop --oneline

# ─── Utilities ───────────────────────────────────────────────

.PHONY: hash-password status help

hash-password: ## Generate a bcrypt password hash for semi-private presentations
	pnpm hash-password

status: ## Show status of app and content
	@echo "═══ App repo (nuxt-slides) ═══"
	@git status --short
	@echo ""
	@$(MAKE) --no-print-directory content-status

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
