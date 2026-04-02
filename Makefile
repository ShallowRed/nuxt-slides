# Nuxt Slides — Deploy & Development Commands
# Usage: make <target>

PRIVATE_REPO_DIR := ../nuxt-slides-content
PRESENTATIONS_DIR := presentations
CODIMD_DIR := ../codimd

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

# ─── Content sync ────────────────────────────────────────────

.PHONY: sync-content sync-to-private sync-from-private

sync-to-private: ## Sync local presentations → private repo (nuxt-slides-content)
	@echo "📦 Syncing presentations to private repo..."
	@if [ ! -d "$(PRIVATE_REPO_DIR)" ]; then \
		echo "📥 Cloning private repo..."; \
		cd .. && gh repo clone ShallowRed/nuxt-slides-content; \
	fi
	@cd "$(PRIVATE_REPO_DIR)" && git pull origin main
	@# Copy all content folders
	@for folder in public semi-private private draft; do \
		if [ -d "$(PRESENTATIONS_DIR)/$$folder" ]; then \
			count=$$(find "$(PRESENTATIONS_DIR)/$$folder" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' '); \
			if [ "$$count" -gt 0 ]; then \
				echo "  → $$folder: $$count file(s)"; \
				mkdir -p "$(PRIVATE_REPO_DIR)/presentations/$$folder"; \
				cp $(PRESENTATIONS_DIR)/$$folder/*.md "$(PRIVATE_REPO_DIR)/presentations/$$folder/"; \
			fi; \
		fi; \
	done
	@echo ""
	@cd "$(PRIVATE_REPO_DIR)" && \
		if git status --porcelain | grep -q "^"; then \
			git add presentations/ && \
			git commit -m "Sync presentations $$(date +%Y-%m-%d)" && \
			echo "✅ Changes committed. Run 'make push-private' to push."; \
		else \
			echo "ℹ️  No changes — already in sync"; \
		fi

push-private: ## Push private repo to GitHub (triggers Vercel rebuild)
	@echo "📤 Pushing private repo..."
	@cd "$(PRIVATE_REPO_DIR)" && git push origin main
	@echo "✅ Pushed. Vercel will rebuild."

sync-from-private: ## Fetch private content locally (same as prebuild)
	node scripts/fetch-presentations.js

# ─── Deploy ──────────────────────────────────────────────────

.PHONY: deploy deploy-app deploy-content deploy-all

deploy-app: ## Push app code to GitHub (triggers Vercel deploy)
	@echo "🚀 Deploying app..."
	@git add -A
	@if git diff --cached --quiet; then \
		echo "ℹ️  No app changes to deploy"; \
	else \
		read -p "Commit message: " msg; \
		git commit -m "$$msg"; \
		echo "✅ Committed. Run 'make push-app' to push."; \
	fi

push-app: ## Push app to GitHub
	git push origin main
	@echo "✅ App pushed. Vercel will deploy."

deploy-content: sync-to-private push-private ## Sync content + push private repo
	@echo "✅ Content deployed."

deploy-all: deploy-content ## Deploy content then app
	@echo ""
	@$(MAKE) deploy-app

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

status: ## Show status of app repo, private repo, and local content
	@echo "═══ App repo (nuxt-slides) ═══"
	@git status --short
	@echo ""
	@echo "═══ Private repo (nuxt-slides-content) ═══"
	@if [ -d "$(PRIVATE_REPO_DIR)" ]; then \
		cd "$(PRIVATE_REPO_DIR)" && git status --short; \
	else \
		echo "  Not cloned. Run 'make sync-to-private' first."; \
	fi
	@echo ""
	@echo "═══ Local presentations ═══"
	@for folder in public semi-private private draft; do \
		count=$$(find "$(PRESENTATIONS_DIR)/$$folder" -name "*.md" -type f 2>/dev/null | wc -l | tr -d ' '); \
		echo "  $$folder: $$count file(s)"; \
	done

help: ## Show this help
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "  \033[36m%-20s\033[0m %s\n", $$1, $$2}'

.DEFAULT_GOAL := help
