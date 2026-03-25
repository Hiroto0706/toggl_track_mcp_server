import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { getTimeEntriesForDateTool } from "../../src/tools/get_time_entries_for_date.js";

describe("getTimeEntriesForDateTool", () => {
	beforeEach(() => {
		vi.useFakeTimers();
	});

	afterEach(() => {
		vi.useRealTimers();
		vi.restoreAllMocks();
	});

	it("uses account timezone and today when date is omitted", async () => {
		vi.setSystemTime(new Date("2026-03-25T00:30:00Z"));

		const calls: { url: string; init?: RequestInit }[] = [];
		const mockFetch = vi.fn(async (url: string, init?: RequestInit) => {
			calls.push({ url, init });

			if (url.includes("/api/v9/me")) {
				return new Response(JSON.stringify({ timezone: "Asia/Tokyo" }), {
					status: 200,
					headers: { "Content-Type": "application/json" },
				});
			}

			return new Response(JSON.stringify([]), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		});
		vi.stubGlobal("fetch", mockFetch);

		const result = await getTimeEntriesForDateTool.execute({
			apiToken: "test_token_123",
		});

		expect(mockFetch).toHaveBeenCalledTimes(2);

		const timeEntriesRequest = calls[1];
		const url = new URL(timeEntriesRequest.url);
		expect(url.searchParams.get("start_date")).toBe("2026-03-24T15:00:00Z");
		expect(url.searchParams.get("end_date")).toBe("2026-03-25T15:00:00Z");

		const content = result.content?.[0];
		expect(content?.type).toBe("text");
		expect(JSON.parse(content?.text ?? "")).toMatchObject({
			meta: {
				date: "2026-03-25",
				timezone: "Asia/Tokyo",
			},
		});
	});
});
