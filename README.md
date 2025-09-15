## toggl-track-mcp-server

TypeScript MCP server (stdio) that exposes tools to fetch Toggl Track v9 time entries for a specific date.

### Environment

1) Copy `.env.template` to `.env` and set values:

```
cp .env.template .env
```

Required
- `TOGGL_API_TOKEN`

Optional
- `TOGGL_WORKSPACE_ID` – when set, the server uses `/api/v9/workspaces/{id}/time_entries`; otherwise `/api/v9/me/time_entries`.

The server auto-loads `.env` via `dotenv/config`.

### Build

```
npm i
npm run build
```

### Run (stdio)

```
node dist/index.js --transport stdio
```

### Tools

- `ping` – returns `ok`.
- `get_time_entries_for_date` – fetches v9 time entries for one date.
  - args: `{ "date": "YYYY-MM-DD", "timezone": "UTC" | "Asia/Tokyo" }` (timezone optional, default UTC)
  - returns: `{ meta: { date, timezone, startUTC, endUTC, count, source: "v9" }, entries: [...] }`
