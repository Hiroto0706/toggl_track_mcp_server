import type { FetchByDateInput, FetchByDateResult } from "../schemas/toggl.js";
import { dayRange } from "../utils/date.js";

const BASE_URL = "https://api.track.toggl.com";

export async function fetchTimeEntriesForDateV9(
	input: FetchByDateInput,
): Promise<FetchByDateResult> {
	const { apiToken, date, timezone = "UTC" } = input;

	const { start, end } = dayRange(date, timezone);
	const url = new URL("/api/v9/me/time_entries", BASE_URL);
	url.searchParams.set("start_date", start);
	url.searchParams.set("end_date", end);

	const authHeader = `Basic ${Buffer.from(`${apiToken}:api_token`).toString("base64")}`;
	const res = await fetch(url.toString(), {
		method: "GET",
		headers: { Authorization: authHeader },
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
		// keep as unknown[] to avoid over-coupling here; TS will treat via type in consumers
		entries: entries,
	};
}

export async function fetchMe(apiToken: string) {
	const url = new URL("/api/v9/me", BASE_URL);
	const authHeader = `Basic ${Buffer.from(`${apiToken}:api_token`).toString("base64")}`;
	const res = await fetch(url.toString(), {
		headers: { Authorization: authHeader },
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(
			`Me request failed: ${res.status} ${res.statusText} ${text}`,
		);
	}
	return await res.json();
}
