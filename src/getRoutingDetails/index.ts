import { SECRET_HEADER } from "../constants";

export function getRoutingDetails(request: Request): [string, string] {
	const url = new URL(request.url);
	const secret = request.headers.get(SECRET_HEADER);
	const routingKey = url.pathname.split("/").filter(Boolean).pop();
	return [secret, routingKey];
}
