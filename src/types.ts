export type Timezone = "UTC" | "Asia/Tokyo";

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

export type FetchByDateInput = {
  apiToken: string;
  date: string; // YYYY-MM-DD
  timezone?: Timezone; // default UTC
  workspaceId?: number; // optional: if omitted, uses /me/time_entries
};

export type FetchByDateResult = {
  meta: {
    source: "v9";
    date: string;
    timezone: Timezone;
    startUTC: string;
    endUTC: string;
    count: number;
  };
  entries: V9TimeEntry[];
};
