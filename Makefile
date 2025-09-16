# Default target
.DEFAULT_GOAL := help

# Help
.PHONY: help
help: ## Show this help message
	@echo "Available commands:"
	@echo ""
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | \
		awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

# Build
.PHONY: build
build: ## Build TypeScript to dist
	npm run build

# Format
.PHONY: format
format: ## Format source with Biome
	npx @biomejs/biome format --write ./src

# Lint
.PHONY: lint
lint: ## Lint source with Biome (apply fixes)
	npx @biomejs/biome lint --write ./src

# MCP Inspector
.PHONY: inspector
inspector: ## Launch MCP Inspector (stdio)
	npx @modelcontextprotocol/inspector node /Users/hirotokadota/Documents/monta_projects/toggl-track-mcp-server/dist/index.js --transport stdio