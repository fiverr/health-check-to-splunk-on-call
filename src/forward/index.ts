import { Request } from "@cloudflare/workers-types";
import { IncomingPayload } from "../types";
import { REST_ENDPOINT } from "../constants";
import { transformMessage } from "../transformMessage";
import { post } from "../post";

export async function forward(
	request: Request,
	routingKey: string,
	secret: string
): Promise<Response> {
	const payload: IncomingPayload = await request.json();
	const body = transformMessage(payload);
	const url = [REST_ENDPOINT, secret, routingKey].join("/");
	return post(url, body);
}
