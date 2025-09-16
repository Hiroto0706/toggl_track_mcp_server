## toggl-track-mcp-server

TypeScript MCP server (stdio) exposing tools to fetch Toggl Track v9 time entries.

### Features
- Single‑day time entry fetch using Toggl v9 (`/api/v9/me/time_entries`).
- Timezone aware via Temporal polyfill (@js-temporal/polyfill):
  - Accepts any IANA timezone (e.g. `Asia/Tokyo`, `America/New_York`).
  - If `timezone` is omitted, uses your Toggl account timezone (fetched via `/api/v9/me`), with fallback to `UTC`.

### Directory Layout
- `src/index.ts` – MCP server bootstrap (registers tools)
- `src/tools/` – Tool implementations
  - `ping.ts`
  - `get_time_entries_for_date.ts`
  - `check_auth.ts`
- `src/toggl/` – Toggl API client
  - `get.ts` (fetchTimeEntriesForDateV9, fetchMe)
- `src/utils/` – Utilities
  - `config.ts` (env loader)
  - `date.ts` (Temporal‑based dayRange)
- `src/schemas/` – Zod and shared types
  - `date.ts`, `toggl.ts`, `tools.ts`

### Environment
1) Copy `.env.template` to `.env` and set values:

```
cp .env.template .env
```

Required
- `TOGGL_API_TOKEN`

Notes
- `.env` is auto‑loaded via `dotenv/config`.
- You can also pass the token via MCP client env.

### Build

```
npm i
npm run build
```

### Run (stdio)

```
node dist/index.js --transport stdio
```

### Use with Claude Desktop
Add to `~/Library/Application Support/Claude/claude_desktop_config.json` (macOS):

```
{
  "mcpServers": {
    "toggl-track": {
      "command": "/opt/homebrew/bin/node",
      "args": [
        "--enable-source-maps",
        "/Users/yourname/path/to/toggl-track-mcp-server/dist/index.js",
        "--transport",
        "stdio"
      ],
      "env": {
        "TOGGL_API_TOKEN": "YOUR_TOKEN",
        "TZ": "Asia/Tokyo"
      }
    }
  }
}
```

### Use with MCP Inspector

```
npx @modelcontextprotocol/inspector
```
- Add Server → Stdio
  - Command: `node` (or absolute node path)
  - Args: `/path/to/dist/index.js --transport stdio`
  - Env: `TOGGL_API_TOKEN=...`, `TZ=Asia/Tokyo`

### Tools

- `ping`
  - Returns `ok`.

- `check_auth`
  - Verifies token via `/api/v9/me` and returns a masked summary.
  - Params: none (uses `TOGGL_API_TOKEN` from env).

- `get_time_entries_for_date`
  - Fetches v9 time entries for a single date.
  - Params (JSON):
    - `date` (string, `YYYY-MM-DD`)
    - `timezone` (string, IANA; optional → uses account timezone; fallback `UTC`)
    - `apiToken` (string; optional override for env)
  - Returns (JSON):
    - `{ meta: { source: 'v9', date, timezone, startUTC, endUTC, count }, entries: [...] }`

### Notes
- This project uses Node ESM with `module: nodenext`. Write relative imports with `.js` extensions in source.
- Timezone math uses Temporal via `@js-temporal/polyfill`.
