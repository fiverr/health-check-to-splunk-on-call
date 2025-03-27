import type { OutgoingPayload } from "../types.d.ts";

export const post = (url: string, data: OutgoingPayload): Promise<Response> =>
	fetch(url, {
		method: "POST",
		headers: new Headers([
			[
				"User-Agent",
				"HealthCheckToSplunkOnCall/1.0 (bot; platform:cloudflare-worker; https://github.com/fiverr/health-check-to-splunk-on-call)",
			],
			["Content-Type", "application/json"],
			["Connection", "close"],
		]),
		body: JSON.stringify(data),
	});
