import { z } from "zod";

const EnvSchema = z.object({
	TOGGL_API_TOKEN: z.string().optional(),
});

export type AppEnv = z.infer<typeof EnvSchema>;

export const loadEnv = (): AppEnv => {
	const parsed = EnvSchema.safeParse(process.env);
	if (!parsed.success) return {} as AppEnv;
	const raw = parsed.data as Partial<Record<string, string>>;
	const env = {
		TOGGL_API_TOKEN: raw.TOGGL_API_TOKEN?.trim(),
	};
	return env;
};
