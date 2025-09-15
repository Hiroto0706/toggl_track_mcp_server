import { dayRange } from "./date.js";
import type {
  FetchByDateInput,
  FetchByDateResult,
  V9TimeEntry,
} from "./types.js";

export async function fetchTimeEntriesForDateV9(
  input: FetchByDateInput
): Promise<FetchByDateResult> {
  const { apiToken, date, timezone = "UTC" } = input;
  const baseUrl = "https://api.track.toggl.com";

  const { start, end } = dayRange(date, timezone);

  // Listing is per-user. Always use /me/time_entries to avoid 405 on workspace route.
  const url = new URL("/api/v9/me/time_entries", baseUrl);
  url.searchParams.set("start_date", start);
  url.searchParams.set("end_date", end);

  // v9 Basic auth: username=API token, password='api_token'
  const authHeader =
    "Basic " + Buffer.from(`${apiToken}:api_token`).toString("base64");

  const res = await fetch(url.toString(), {
    method: "GET",
    headers: { Authorization: authHeader },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Toggl v9 request failed: ${res.status} ${
        res.statusText
      } GET ${url.toString()} ${text}`
    );
  }

  // Single page: v9 returns an array for this range. For future multi-page, switch to Reports v2 or cursor if added.
  // TODO(pagination): If API adds pagination, iterate until all pages are fetched.
  const entries = (await res.json()) as V9TimeEntry[];

  return {
    meta: {
      source: "v9",
      date,
      timezone,
      startUTC: start,
      endUTC: end,
      count: entries.length,
    },
    entries,
  };
}

export async function fetchMe(apiToken: string) {
  const baseUrl = "https://api.track.toggl.com";
  const authHeader =
    "Basic " + Buffer.from(`${apiToken}:api_token`).toString("base64");
  const url = new URL("/api/v9/me", baseUrl);
  const res = await fetch(url.toString(), { headers: { Authorization: authHeader } });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `Me request failed: ${res.status} ${res.statusText} ${text}`
    );
  }
  return (await res.json()) as unknown;
}
