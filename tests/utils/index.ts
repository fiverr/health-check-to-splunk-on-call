import { promises } from "node:fs";

/**
 * Mocked function to be restored after the tests.
 */
let fetch: typeof globalThis.fetch;

/**
 * Store JSON fixtures for tested procedures
 * @type {Map<string, string>}
 */
export const store = new Map();

/**
 * Set up testing environment.
 * - Override "fetch" with a mock function.
 * - Populate the "store" with test fixturtes: Cloudflare health check payloads
 * @returns {Promise<void>}
 */
export async function setup() {
	fetch = globalThis.fetch;
	globalThis.fetch = function (...args) {
		store.set("fetch", args);
	} as typeof globalThis.fetch;
	await Promise.all(
		["health-check-failure", "health-check-okay"].map(async (name) => {
			const file = await promises.readFile(`./tests/fixtures/${name}.json`);
			store.set(name, file.toString());
		}),
	);
}

/**
 * Tear down testing environment.
 * - Restore original "fetch" function.
 * - Clear the "store" of test fixturtes.
 * @returns {Promise<void>}
 */
export async function teardown() {
	globalThis.fetch = fetch;
	store.clear();
	store.keys().forEach((key) => {
		store.delete(key);
	});
}

/**
 * Create a fake worker thread context for testing.
 * @property {function} waitUntil
 * @property {function} get
 */
export class Context implements ExecutionContext {
	#store = new Map();
	props = {};
	waitUntil(promise) {
		this.#store.set("waitUntil", promise);
	}
	get(key) {
		return this.#store.get(key);
	}
	passThroughOnException() {}
}
