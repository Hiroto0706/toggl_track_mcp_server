export const pingTool = {
	name: "ping",
	description: 'Health check tool. Returns "ok".',
	annotations: { readOnlyHint: true, idempotentHint: true, title: "Ping" },
	async execute() {
		return "ok";
	},
};
