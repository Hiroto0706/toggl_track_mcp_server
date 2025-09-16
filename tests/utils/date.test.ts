import { describe, it, expect } from "vitest";
import { dayRange } from "../../src/utils/date.js";

describe("dayRange (Temporal)", () => {
	it("computes UTC range for Asia/Tokyo", () => {
		const { start, end } = dayRange("2025-09-14", "Asia/Tokyo");
		// JST(UTC+9) 2025-09-14 00:00 → 2025-09-13 15:00 UTC
		expect(new Date(start).toISOString()).toBe("2025-09-13T15:00:00.000Z");
		// JST 2025-09-15 00:00 → 2025-09-14 15:00 UTC
		expect(new Date(end).toISOString()).toBe("2025-09-14T15:00:00.000Z");
	});

	it("computes UTC range for America/New_York (DST aware)", () => {
		const { start, end } = dayRange("2025-06-01", "America/New_York");
		// 00:00 local = 04:00 UTC during DST (EDT)
		expect(new Date(start).toISOString()).toBe("2025-06-01T04:00:00.000Z");
		expect(new Date(end).toISOString()).toBe("2025-06-02T04:00:00.000Z");
	});

	it("throws when date format is invalid", () => {
		// Our helper validates YYYY-MM-DD and throws a friendly error first.
		expect(() => dayRange("2025/09/14", "UTC")).toThrow(/Invalid date format/);
	});

	it("throws when timezone is invalid (unknown IANA id)", () => {
		// Temporal will throw for an unknown IANA time zone name.
		expect(() => dayRange("2025-09-14", "Not/AZone")).toThrow();
	});
});
