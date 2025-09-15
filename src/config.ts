import { z } from "zod";

const EnvSchema = z.object({
  TOGGL_API_TOKEN: z.string().optional(),
  TOGGL_WORKSPACE_ID: z.string().optional(),
});

export type AppEnv = z.infer<typeof EnvSchema> & {
  workspaceIdNumber?: number;
};

export function loadEnv(): AppEnv {
  const parsed = EnvSchema.safeParse(process.env);
  if (!parsed.success) {
    // Non-fatal: we validate again at tool call time as needed
    return {} as AppEnv;
  }
  const raw = parsed.data as Partial<Record<string, string>>;
  const env = {
    TOGGL_API_TOKEN: raw.TOGGL_API_TOKEN?.trim(),
    TOGGL_WORKSPACE_ID: raw.TOGGL_WORKSPACE_ID?.trim(),
  } as {
    TOGGL_API_TOKEN?: string;
    TOGGL_WORKSPACE_ID?: string;
  };
  const ws = env.TOGGL_WORKSPACE_ID;
  const workspaceIdNumber = ws && ws !== "" ? Number(ws) : undefined;
  return {
    ...env,
    ...(workspaceIdNumber !== undefined ? { workspaceIdNumber } : {}),
  } as AppEnv;
}
