import type { z } from "zod";
import type { ContentResult } from "fastmcp";
import { getTimeEntriesForDateParams } from "../schemas/tools.js";
import { loadEnv } from "../utils/config.js";
import { fetchTimeEntriesForDateV9 } from "../api/toggl.js";

export const getTimeEntriesForDateTool = {
	name: "get_time_entries_for_date",
	description:
		"Fetch Toggl Track v9 time entries for a single date. Defaults to UTC; timezone can be Asia/Tokyo.",
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		title: "Get Time Entries (v9)",
	},
	parameters: getTimeEntriesForDateParams as unknown as z.ZodTypeAny,
	async execute(rawArgs: z.infer<typeof getTimeEntriesForDateParams>) {
		const env = loadEnv();
		const apiToken = (rawArgs.apiToken ?? env.TOGGL_API_TOKEN)?.trim();
		if (!apiToken) {
			return {
				content: [
					{
						type: "text",
						text: "Missing TOGGL_API_TOKEN in environment. Set it in .env or pass apiToken.",
					},
				],
				isError: true,
			} as ContentResult;
		}
		const result = await fetchTimeEntriesForDateV9({
			apiToken,
			date: rawArgs.date,
			timezone: rawArgs.timezone ?? "UTC",
		});
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		} as ContentResult;
	},
};
