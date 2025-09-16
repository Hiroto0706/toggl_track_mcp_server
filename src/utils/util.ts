export const createAuthHeader = (apiToken: string): string => {
	return `Basic ${Buffer.from(`${apiToken}:api_token`).toString("base64")}`;
};
