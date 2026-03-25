import { z } from "zod";

export const getTimeEntriesForDateParams = z.object({
	date: z
		.string()
		.optional()
		.describe(
			"Target date. Accepts YYYY-MM-DD, YYYY/MM/DD, 今日, 昨日, 一昨日. If omitted, uses today in the resolved timezone.",
		),
	timezone: z
		.string()
		.optional()
		.describe(
			"IANA timezone, e.g. 'Asia/Tokyo'. If omitted, uses account timezone; fallback 'UTC'.",
		),
	apiToken: z
		.string()
		.optional()
		.describe("Override TOGGL_API_TOKEN from env (useful for testing)."),
});

export const checkAuthParams = z.object({
	apiToken: z.string().optional(),
});
