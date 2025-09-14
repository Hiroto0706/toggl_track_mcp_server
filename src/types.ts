export type IsoString = string;

export type DayRange = {
  /** Inclusive start in ISO8601 (UTC). */
  start: IsoString;
  /** Exclusive end in ISO8601 (UTC). */
  end: IsoString;
};

export type FetchTimeEntriesParams = {
  apiToken: string;
  /** ISO8601 string for start (UTC). */
  start: IsoString;
  /** ISO8601 string for end (UTC). */
  end: IsoString;
};

export type TogglTimeEntry = {
  id: number;
  description: string | null;
  wid?: number; // workspace id
  pid?: number | null; // project id
  tid?: number | null; // task id
  start: string; // ISO
  stop: string | null; // ISO or null for running
  duration: number; // seconds (running negative per Toggl semantics)
  tags?: string[];
  billable?: boolean;
  uid?: number; // user id
  at?: string; // updated at
  server_deleted_at?: string | null;
  [k: string]: unknown;
};

export type DatedEntries = {
  date: string; // YYYY-MM-DD (JST)
  entries: TogglTimeEntry[];
};
