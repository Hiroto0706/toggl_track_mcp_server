# Build
.PHONY: build
build:
	npm run build

# MCP Inspector
.PHONY: inspector
inspector:
	npx @modelcontextprotocol/inspector node /Users/hirotokadota/Documents/monta_projects/toggl-track-mcp-server/dist/index.js --transport stdio