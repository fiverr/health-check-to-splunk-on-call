import { getRoutingDetails } from "../getRoutingDetails/index.ts";
import { forward } from "../forward/index.ts";
import { createResponse } from "../createResponse/index.ts";

export function handle(request: Request): [Response, Promise<any>?] {
	if (request.method?.toUpperCase() !== "POST") {
		return [createResponse(405)];
	}
	const [secret, routingKey] = getRoutingDetails(request);
	if (!secret) {
		return [createResponse(401)];
	}
	if (!routingKey) {
		return [createResponse(404)];
	}
	return [createResponse(202), forward(request, routingKey, secret)];
}
