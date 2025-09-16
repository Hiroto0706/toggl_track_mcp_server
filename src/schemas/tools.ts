import { z } from "zod";

export const getTimeEntriesForDateParams = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/u, "YYYY-MM-DD")
		.describe(
			"Target date (YYYY-MM-DD). Interpreted in the provided timezone.",
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
