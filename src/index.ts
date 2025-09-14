import "dotenv/config";
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { jstDayRange } from "./date.js";

const server = new FastMCP({
  name: "toggl-track-mcp-server",
  version: "1.0.0",
  instructions:
    "MCP server for Toggl Track. Initially provides a simple ping tool. Future steps: JST date helpers and Toggl v9 time entries.",
});

const pingTool = {
  name: "ping",
  description: 'Health check tool. Returns "ok".',
  annotations: { readOnlyHint: true, idempotentHint: true, title: "Ping" },
  async execute() {
    return "ok";
  },
};

server.addTool(pingTool);

server.addTool({
  name: "preview_date_range",
  description: "Return UTC start/end ISO for a given JST date (YYYY-MM-DD).",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    title: "Preview JST Range",
  },
  parameters: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/u, "YYYY-MM-DD")
      .describe("Target date in JST (YYYY-MM-DD)."),
  }),
  async execute(args) {
    const { date } = args as { date: string };
    const range = jstDayRange(date);
    return JSON.stringify(
      {
        date,
        jst: { start: `${date}T00:00:00+09:00`, end: `${date}T24:00:00+09:00` },
        utc: range,
      },
      null,
      2
    );
  },
});

server.start({ transportType: "stdio" }).catch((err) => {
  console.error("[server error]", err?.message || err);
  process.exitCode = 1;
});
