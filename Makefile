# Build
.PHONY: build
build:
	npm run build

# Format
.PHONY: format
format:
	npx @biomejs/biome format --write ./src

# Lint
.PHONY: lint
lint:
	npx @biomejs/biome lint --write ./src

# MCP Inspector
.PHONY: inspector
inspector:
	npx @modelcontextprotocol/inspector node /Users/hirotokadota/Documents/monta_projects/toggl-track-mcp-server/dist/index.js --transport stdio