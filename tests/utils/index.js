import { promises } from "fs";

const originals = new Map();
export const store = new Map();

export async function setup() {
	originals.set("fetch", global.fetch);
	originals.fetch = global.fetch;
	global.fetch = function (...args) {
		store.set("fetch", args);
	};
	await Promise.all(
		["health-check-failure", "health-check-okay"].map(async (name) => {
			const file = await promises.readFile(`./fixtures/${name}.json`);
			store.set(name, file.toString());
		})
	);
}

export async function teardown() {
	global.fetch = originals.get("fetch");
	store.clear();
}

export class Context {
	#store = new Map();
	waitUntil(promise) {
		this.#store.set("waitUntil", promise);
	}
	get(key) {
		return this.#store.get(key);
	}
}
