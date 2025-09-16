import type { z } from "zod";
import type { ContentResult } from "fastmcp";
import { getTimeEntriesForDateParams } from "../schemas/tools.js";
import { loadEnv } from "../utils/config.js";
import { fetchTimeEntriesForDateV9 } from "../toggl/time-entries.js";
import { fetchMe } from "../toggl/me.js";

const DEFAULT_TIMEZONE = "UTC";

export const getTimeEntriesForDateTool = {
	name: "get_time_entries_for_date",
	description:
		"Fetch Toggl Track v9 time entries for a single date. Timezone accepts any IANA value and defaults to your account timezone (fallback UTC).",
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		title: "Get Time Entries (v9)",
	},
	parameters: getTimeEntriesForDateParams as unknown as z.ZodTypeAny,
	async execute(args: z.infer<typeof getTimeEntriesForDateParams>) {
		const env = loadEnv();
		const apiToken = (args.apiToken ?? env.TOGGL_API_TOKEN)?.trim();
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
		const tz =
			args.timezone ||
			((await fetchMe(apiToken)) as { timezone?: string } | undefined)
				?.timezone ||
			DEFAULT_TIMEZONE;
		const result = await fetchTimeEntriesForDateV9({
			apiToken,
			date: args.date,
			timezone: tz,
		});
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		} as ContentResult;
	},
};
