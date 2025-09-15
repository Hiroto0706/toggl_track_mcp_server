import { z } from "zod";

const EnvSchema = z.object({
	TOGGL_API_TOKEN: z.string().optional(),
	TOGGL_WORKSPACE_ID: z.string().optional(),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export function loadEnv(): AppEnv {
	const parsed = EnvSchema.safeParse(process.env);
	if (!parsed.success) return {} as AppEnv;
	const raw = parsed.data as Partial<Record<string, string>>;
	const env = {
		TOGGL_API_TOKEN: raw.TOGGL_API_TOKEN?.trim(),
		TOGGL_WORKSPACE_ID: raw.TOGGL_WORKSPACE_ID?.trim(),
	} as { TOGGL_API_TOKEN?: string; TOGGL_WORKSPACE_ID?: string };
	return {
		env,
	} as AppEnv;
}
