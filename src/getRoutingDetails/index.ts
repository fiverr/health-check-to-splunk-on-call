import { SECRET_HEADER } from "../constants/index.ts";

export function getRoutingDetails(request: Request): [string, string] {
	const secret = request.headers.get(SECRET_HEADER);
	const routingKey = new URLPattern({ pathname: "/:routingKey" }).exec(
		request.url,
	)?.pathname?.groups?.routingKey;
	return [secret, routingKey];
}
