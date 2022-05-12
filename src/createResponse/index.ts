const statusDictionary = new Map([
	[202, "Accepted"],
	[401, "Unauthorized"],
	[404, "Not Found"],
	[405, "Not Allowed"],
	[500, "Internal Server Error"],
]);

export function createResponse(status: number): Response {
	const statusText = statusDictionary.get(status) || "Unknown";

	return new Response(statusText, { status, statusText });
}
