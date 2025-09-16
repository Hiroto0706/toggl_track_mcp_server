import type { ISODateString, Timezone } from "../schemas/date.js";

export type FetchByDateInput = {
	apiToken: string;
	date: ISODateString; // YYYY-MM-DD
	timezone?: Timezone; // default UTC
};

export type V9TimeEntry = {
	id: number;
	description: string | null;
	project_id?: number | null;
	task_id?: number | null;
	workspace_id?: number;
	start: string; // ISO8601
	stop: string | null; // ISO8601 or null when running
	duration: number; // seconds (running negative per Toggl semantics)
	tags?: string[];
	billable?: boolean;
	user_id?: number;
	at?: string; // updated at
	server_deleted_at?: string | null;
	[k: string]: unknown;
};

export type FetchByDateResult = {
	meta: {
		source: "v9";
		date: ISODateString;
		timezone: Timezone;
		startUTC: string;
		endUTC: string;
		count: number;
	};
	entries: V9TimeEntry[];
};
