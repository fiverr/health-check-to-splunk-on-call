import { statusDictionary } from "../statusDictionary";
import { IncomingPayload, OutgoingPayload } from "../types";

export const transformMessage = ({
	text,
	data: { health_check_id: entity_id, name: entity_display_name, status },
	ts: state_start_time,
}: IncomingPayload): OutgoingPayload => ({
	entity_display_name,
	entity_id,
	message_type: statusDictionary(status),
	state_message: text.trim(),
	state_start_time,
});
