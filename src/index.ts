import "dotenv/config";
import { FastMCP } from "fastmcp";
import { pingTool } from "./tools/ping.js";
import { getTimeEntriesForDateTool } from "./tools/get_time_entries_for_date.js";
import { checkAuthTool } from "./tools/check_auth.js";

const server = new FastMCP({
	name: "toggl-track-mcp-server",
	version: "1.0.0",
	instructions:
		"MCP server for Toggl Track. Exposes tools to fetch Toggl v9 time entries.",
});

server.addTool(pingTool);
server.addTool(getTimeEntriesForDateTool);
server.addTool(checkAuthTool);

server.start({ transportType: "stdio" }).catch((err) => {
	console.error("[server error]", err?.message || err);
	process.exitCode = 1;
});
