import { Env, EventContext, Request } from "@cloudflare/workers-types";
import { handle } from "./handle";

export default {
	async fetch(request: Request, env: Env, ctx: EventContext) {
		const [response, ...promises] = handle(request);

		promises.forEach((promise) => ctx.waitUntil(promise));
		return response;
	},
};
