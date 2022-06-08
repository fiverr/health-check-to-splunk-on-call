import test from "node:test";
import { strict as assert } from "node:assert";
import { setup, teardown, store, Context } from "./utils/index.js";
import { REST_ENDPOINT } from "../src/constants/index.js";
import worker from "../index.js";

export const SECRET = "2A756502-81B1-4CCC-A662-E9DFBC77C876";

test("healthy", async (suite) => {
	async function test(description, callback) {
		await setup();
		await suite.test(description, callback);
		await teardown();
	}

	await test("healthy check resolves the incident", async (t) => {
		const context = new Context();
		const routingKey = "devops";
		const request = new Request(`https://apiendpoint.net/${routingKey}`, {
			method: "POST",
			body: store.get("health-check-okay"),
		});
		request.headers.set("cf-webhook-auth", SECRET);
		const result = await worker.fetch(request, null, context);
		await context.get("waitUntil");
		const [url, options] = store.get("fetch");

		assert.equal(url, `${REST_ENDPOINT}/${SECRET}/${routingKey}`);
		assert.equal(
			options.body,
			JSON.stringify({
				entity_display_name: "test_health_check",
				entity_id: "6b8107f6f348c849347af551329e2eac",
				message_type: "RECOVERY",
				state_message: [
					"Health Check Name: test_health_check",
					"Health Check ID: 6b8107f6f348c849347af551329e2eac",
					"Time : 2022-05-06 11:41:26 +0000 UTC",
					"Status: Healthy",
				].join("\n"),
				state_start_time: 1651837292,
			})
		);
		assert.equal(result.status, 202);
	});

	await test("unhealthy check creates an incident", async (t) => {
		const context = new Context();
		const routingKey = "devops";
		const request = new Request(`https://apiendpoint.net/${routingKey}`, {
			method: "POST",
			body: store.get("health-check-failure"),
		});
		request.headers.set("cf-webhook-auth", SECRET);
		const result = await worker.fetch(request, null, context);
		await context.get("waitUntil");
		const [url, options] = store.get("fetch");

		assert.equal(url, `${REST_ENDPOINT}/${SECRET}/${routingKey}`);
		assert.equal(
			options.body,
			JSON.stringify({
				entity_display_name: "test_health_check",
				entity_id: "6b8107f6f348c849347af551329e2eac",
				message_type: "CRITICAL",
				state_message: [
					"Health Check Name: test_health_check",
					"Health Check ID: 6b8107f6f348c849347af551329e2eac",
					"Time : 2022-05-04 12:49:20 +0000 UTC",
					"Status: Unhealthy",
					"Failure reason: Response code mismatch error ",
					"Expected codes: [200]",
					"Received code: 403",
				].join("\n"),
				state_start_time: 1651668563,
			})
		);
		assert.equal(result.status, 202);
	});

	await test("missing secret aborts the process", async (t) => {
		const context = new Context();
		const routingKey = "devops";
		const request = new Request(`https://apiendpoint.net/${routingKey}`, {
			method: "POST",
			body: store.get("health-check-failure"),
		});
		const result = await worker.fetch(request, null, context);
		assert.equal(store.get("fetch"), undefined);
		assert.equal(context.get("waitUntil"), undefined);
		assert.equal(result.status, 401);
	});

	await test("missing routing key aborts the request", async (t) => {
		const context = new Context();
		const routingKey = "devops";
		const request = new Request(`https://apiendpoint.net/`, {
			method: "POST",
			body: store.get("health-check-failure"),
		});
		request.headers.set("cf-webhook-auth", SECRET);
		const result = await worker.fetch(request, null, context);
		assert.equal(store.get("fetch"), undefined);
		assert.equal(context.get("waitUntil"), undefined);
		assert.equal(result.status, 404);
	});
});
