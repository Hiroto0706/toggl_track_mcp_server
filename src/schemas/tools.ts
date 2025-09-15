import { z } from "zod";

export const getTimeEntriesForDateParams = z.object({
	date: z
		.string()
		.regex(/^\d{4}-\d{2}-\d{2}$/u, "YYYY-MM-DD")
		.describe(
			"Target date (YYYY-MM-DD). Interpreted in the provided timezone.",
		),
	timezone: z
		.enum(["UTC", "Asia/Tokyo"])
		.optional()
		.describe("Time zone for 'date'. Defaults to 'UTC'."),
});
