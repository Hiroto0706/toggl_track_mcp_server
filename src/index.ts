import "dotenv/config";
import { FastMCP } from "fastmcp";
import { z } from "zod";
import { fetchTimeEntriesForDateV9 } from "./toggl.js";
import { loadEnv } from "./config.js";
import { fetchMe } from "./toggl.js";

const server = new FastMCP({
  name: "toggl-track-mcp-server",
  version: "1.0.0",
  instructions:
    "MCP server for Toggl Track. Initially provides a simple ping tool. Future steps: JST date helpers and Toggl v9 time entries.",
});

server.addTool({
  name: "ping",
  description: 'Health check tool. Returns "ok".',
  annotations: { readOnlyHint: true, idempotentHint: true, title: "Ping" },
  async execute() {
    return "ok";
  },
});

server.addTool({
  name: "get_time_entries_for_date",
  description:
    "Fetch Toggl Track v9 time entries for a single date. Defaults to UTC; timezone can be Asia/Tokyo.",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    title: "Get Time Entries (v9)",
  },
  parameters: z.object({
    date: z
      .string()
      .regex(/^\d{4}-\d{2}-\d{2}$/u, "YYYY-MM-DD")
      .describe(
        "Target date (YYYY-MM-DD). Interpreted in the provided timezone."
      ),
    timezone: z
      .enum(["UTC", "Asia/Tokyo"])
      .optional()
      .describe("Time zone for 'date'. Defaults to 'UTC'."),
    apiToken: z
      .string()
      .optional()
      .describe("Override TOGGL_API_TOKEN from env (useful for testing)."),
    workspaceId: z
      .number()
      .int()
      .positive()
      .optional()
      .describe("Override TOGGL_WORKSPACE_ID from env."),
  }),
  async execute(rawArgs) {
    const args = rawArgs as {
      date: string;
      timezone?: "UTC" | "Asia/Tokyo";
      apiToken?: string;
      workspaceId?: number;
      baseUrl?: string;
    };
    const env = loadEnv();
    const apiToken = (args.apiToken ?? env.TOGGL_API_TOKEN)?.trim();

    if (!apiToken) {
      return {
        content: [
          {
            type: "text",
            text: "Missing TOGGL_API_TOKEN in environment. Set it in .env for development or via env in production.",
          },
        ],
        isError: true,
      } as const;
    }

    const input = {
      apiToken,
      date: args.date,
      timezone: args.timezone ?? "UTC",
    } as const;

    const result = await fetchTimeEntriesForDateV9(input);

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    } as const;
  },
});

// Diagnostic tool: verify token by calling /api/v9/me (returns masked summary)
server.addTool({
  name: "check_auth",
  description: "Verify Toggl API token by calling /api/v9/me.",
  annotations: {
    readOnlyHint: true,
    idempotentHint: true,
    title: "Check Auth",
  },
  parameters: z.object({ apiToken: z.string().optional() }),
  async execute(rawArgs) {
    const args = (rawArgs ?? {}) as { apiToken?: string };
    const env = loadEnv();
    const apiToken = (args.apiToken ?? env.TOGGL_API_TOKEN)?.trim();
    if (!apiToken) {
      return {
        content: [{ type: "text", text: "Missing TOGGL_API_TOKEN." }],
        isError: true,
      } as const;
    }
    const me = (await fetchMe(apiToken)) as Record<string, unknown>;
    const masked = `${apiToken.slice(0, 4)}...${apiToken.slice(-4)} (${
      apiToken.length
    })`;
    const summary = {
      token: masked,
      me: {
        email: me?.email,
        fullname: me?.fullname,
        default_workspace_id: me?.default_workspace_id,
        timezone: me?.timezone,
      },
    };
    return {
      content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
    } as const;
  },
});

server.start({ transportType: "stdio" }).catch((err) => {
  console.error("[server error]", err?.message || err);
  process.exitCode = 1;
});
