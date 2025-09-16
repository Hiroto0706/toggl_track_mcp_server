import type { FetchByDateInput, FetchByDateResult } from "../schemas/toggl.js";
import { createAuthHeader } from "../utils/util.js";
import { dayRange } from "../utils/date.js";
import { BASE_URL } from "./index.js";

export async function fetchTimeEntriesForDateV9(
	input: FetchByDateInput,
): Promise<FetchByDateResult> {
	const { apiToken, date, timezone = "UTC" } = input;

	const { start, end } = dayRange(date, timezone);
	const url = new URL("/api/v9/me/time_entries", BASE_URL);
	url.searchParams.set("start_date", start);
	url.searchParams.set("end_date", end);

	const res = await fetch(url.toString(), {
		method: "GET",
		headers: { Authorization: createAuthHeader(apiToken) },
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(
			`Toggl v9 request failed: ${res.status} ${res.statusText} GET ${url.toString()} ${text}`,
		);
	}
	const entries = await res.json();
	return {
		meta: {
			source: "v9",
			date,
			timezone,
			startUTC: start,
			endUTC: end,
			count: entries.length,
		},
		entries: entries,
	};
}
