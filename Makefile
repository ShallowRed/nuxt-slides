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

# ─── Standalone bundle ────────────────────────────────────────

.PHONY: bundle-standalone bundle-storybook

bundle-storybook: ## (Re)build Storybook static output
	cd $(STORYBOOK_DIR)/.. && pnpm build-storybook

deploy-standalone: bundle-standalone ## Build + deploy standalone bundle to GitHub Pages
	@echo "▶  Pushing dist-standalone to gh-pages branch"
	@cd dist-standalone && git init -b gh-pages && git add -A && git commit -m "Deploy standalone bundle" && git push --force $(shell git remote get-url origin) gh-pages
	@echo "✅ Deployed to GitHub Pages"

bundle-standalone: ## Build a self-contained static site (Nuxt + Storybook at same origin)
	@echo "▶  Setting up standalone bundle for '$(BUNDLE_SLUG)'"
	@NUXT_APP_BASE_URL="/nuxt-slides/" node scripts/bundle-standalone.js "$(BUNDLE_SLUG)" "$(abspath $(STORYBOOK_DIR))" "$(STORYBOOK_URL)" setup
	@echo "▶  Generating Nuxt static site (slug only: $(BUNDLE_SLUG)--standalone)"
	@BUNDLE_ONLY_SLUG="$(BUNDLE_SLUG)--standalone" NUXT_APP_BASE_URL="/nuxt-slides/" pnpm generate
	@echo "▶  Injecting Storybook into output"
	@rm -rf "$(BUNDLE_OUT)"
	@cp -r .output/public "$(BUNDLE_OUT)"
	@cp -r "$(abspath $(STORYBOOK_DIR))/." "$(BUNDLE_OUT)/_storybook"
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
