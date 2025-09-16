import { describe, it, expect, vi, beforeEach } from "vitest";
import { fetchTimeEntriesForDateV9 } from "../../src/toggl/time-entries.js";

beforeEach(() => {
	vi.restoreAllMocks();
});

describe("fetchTimeEntriesForDateV9", () => {
	it("calls /api/v9/me/time_entries with correct query and auth", async () => {
		const calls: { url: string; init?: RequestInit }[] = [];
		const mockFetch = vi.fn(async (url: string, init?: RequestInit) => {
			calls.push({ url, init });
			return new Response(JSON.stringify([]), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		});
		vi.stubGlobal("fetch", mockFetch);

		const apiToken = "test_token_123";
		const { meta } = await fetchTimeEntriesForDateV9({
			apiToken,
			date: "2025-09-14",
			timezone: "UTC",
		});
		expect(new Date(meta.startUTC).toISOString()).toBe(
			"2025-09-14T00:00:00.000Z",
		);
		expect(new Date(meta.endUTC).toISOString()).toBe(
			"2025-09-15T00:00:00.000Z",
		);

		expect(mockFetch).toHaveBeenCalledTimes(1);
		const { url, init } = calls[0];
		expect(url).toContain("/api/v9/me/time_entries");
		const u = new URL(url);
		const startParam = u.searchParams.get("start_date");
		const endParam = u.searchParams.get("end_date");
		expect(new Date(String(startParam)).toISOString()).toBe(
			"2025-09-14T00:00:00.000Z",
		);
		expect(new Date(String(endParam)).toISOString()).toBe(
			"2025-09-15T00:00:00.000Z",
		);
		expect(init?.method).toBe("GET");
		const auth = (init?.headers as Record<string, string>)?.Authorization;
		expect(String(auth)).toMatch(/^Basic\s+/);
	});
});
