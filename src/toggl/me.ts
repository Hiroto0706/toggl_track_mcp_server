import { createAuthHeader } from "../utils/util.js";
import { BASE_URL } from "./index.js";

export async function fetchMe(apiToken: string) {
	const url = new URL("/api/v9/me", BASE_URL);
	const res = await fetch(url.toString(), {
		headers: { Authorization: createAuthHeader(apiToken) },
	});
	if (!res.ok) {
		const text = await res.text().catch(() => "");
		throw new Error(
			`Me request failed: ${res.status} ${res.statusText} ${text}`,
		);
	}
	return await res.json();
}
