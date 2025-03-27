import { handle } from "./handle/index.ts";

type Env = Record<string, string>;

const handler: ExportedHandler<Env> = {
	async fetch(request, env, ctx) {
		const [response, ...promises] = handle(request);

		promises.forEach((promise) => ctx.waitUntil(promise));
		return response;
	},
};

export default handler;
