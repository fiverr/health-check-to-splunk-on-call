import type { IncomingPayload } from "../types.d.ts";
import { REST_ENDPOINT } from "../constants/index.ts";
import { transformMessage } from "../transformMessage/index.ts";
import { post } from "../post/index.ts";

export async function forward(
	request: Request,
	routingKey: string,
	secret: string,
): Promise<Response> {
	const payload: IncomingPayload = await request.json();
	const body = transformMessage(payload);
	const url = [REST_ENDPOINT, secret, routingKey].join("/");
	return post(url, body);
}
