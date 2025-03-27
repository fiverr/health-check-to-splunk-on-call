import type { MessageType, StatusName } from "../types.d.ts";

const HealthyStatusName: StatusName = "Healthy";
const UnhealthyStatusName: StatusName = "Unhealthy";
const HealthyMessageType: MessageType = "RECOVERY";
const UnhealthyMessageType: MessageType = "CRITICAL";

const dictionary = new Map([
	[HealthyStatusName, HealthyMessageType],
	[UnhealthyStatusName, UnhealthyMessageType],
]);

const defaultMessageType: MessageType = "INFO";

export function statusDictionary(status: StatusName): MessageType {
	const messageType: MessageType = dictionary.get(status) || defaultMessageType;
	return messageType;
}
