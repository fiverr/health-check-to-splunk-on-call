export type StatusName = "Healthy" | "Unhealthy";

export interface IncomingPayload {
	text: string;
	data: {
		health_check_id: string;
		name: string;
		status: StatusName;
	};
	ts: number;
}

export type MessageType =
	| "CRITICAL"
	| "WARNING"
	| "ACKNOWLEDGEMENT"
	| "INFO"
	| "RECOVERY";

export interface OutgoingPayload {
	entity_display_name: string;
	entity_id: string;
	message_type: MessageType;
	state_message: string;
	state_start_time: number;
}
