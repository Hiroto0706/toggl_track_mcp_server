import type { z } from "zod";
import type { ContentResult } from "fastmcp";
import { loadEnv } from "../utils/config.js";
import { fetchMe } from "../toggl/get.js";
import { checkAuthParams } from "../schemas/tools.js";

export const checkAuthTool = {
	name: "check_auth",
	description: "Verify Toggl API token by calling /api/v9/me.",
	annotations: {
		readOnlyHint: true,
		idempotentHint: true,
		title: "Check Auth",
	},
	parameters: checkAuthParams as unknown as z.ZodTypeAny,
	async execute(args: z.infer<typeof checkAuthParams>) {
		const env = loadEnv();
		const apiToken = (args.apiToken ?? env.TOGGL_API_TOKEN)?.trim();
		if (!apiToken) {
			return {
				content: [{ type: "text", text: "Missing TOGGL_API_TOKEN." }],
				isError: true,
			} as ContentResult;
		}

		const me = await fetchMe(apiToken);
		const masked = `${apiToken.slice(0, 4)}...${apiToken.slice(-4)} (${apiToken.length})`;
		const summary = {
			token: masked,
			me: {
				email: me?.email,
				fullname: me?.fullname,
				default_workspace_id: me?.default_workspace_id,
				timezone: me?.timezone,
			},
		};
		return {
			content: [{ type: "text", text: JSON.stringify(summary, null, 2) }],
		} as ContentResult;
	},
};
