import { Temporal } from "@js-temporal/polyfill";
import type { ISODateString } from "../schemas/date.js";

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/u;
const SLASH_DATE_PATTERN = /^\d{4}\/\d{2}\/\d{2}$/u;

const relativeDateOffsetMap = {
	今日: 0,
	昨日: 1,
	一昨日: 2,
} as const;

const formatIsoDate = (date: Temporal.PlainDate): ISODateString =>
	`${date.year.toString().padStart(4, "0")}-${date.month.toString().padStart(2, "0")}-${date.day.toString().padStart(2, "0")}`;

export const resolveDateInput = (
	input: string | undefined,
	timeZone: string,
	now: Temporal.Instant = Temporal.Now.instant(),
): ISODateString => {
	if (input == null) {
		return formatIsoDate(now.toZonedDateTimeISO(timeZone).toPlainDate());
	}

	if (ISO_DATE_PATTERN.test(input)) {
		return input;
	}

	if (SLASH_DATE_PATTERN.test(input)) {
		return input.replaceAll("/", "-");
	}

	const relativeDateOffset =
		relativeDateOffsetMap[input as keyof typeof relativeDateOffsetMap];
	if (relativeDateOffset == null) {
		throw new Error(
			`Invalid date format: ${input}. Expected YYYY-MM-DD, YYYY/MM/DD, 今日, 昨日, or 一昨日`,
		);
	}

	const baseDate = now.toZonedDateTimeISO(timeZone).toPlainDate();
	return formatIsoDate(baseDate.subtract({ days: relativeDateOffset }));
};

export const dayRange = (
	date: ISODateString,
	timeZone: string = "UTC",
): { start: string; end: string } => {
	if (!ISO_DATE_PATTERN.test(date)) {
		throw new Error(`Invalid date format: ${date}. Expected YYYY-MM-DD`);
	}
	const plainDate = Temporal.PlainDate.from(date);
	const startZdt = plainDate.toZonedDateTime({
		timeZone,
		plainTime: Temporal.PlainTime.from("00:00"),
	});
	const endZdt = startZdt.add({ days: 1 });
	return {
		start: startZdt.toInstant().toString(),
		end: endZdt.toInstant().toString(),
	};
};
