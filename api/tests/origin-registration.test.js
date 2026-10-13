import assert from "node:assert/strict";
import test from "node:test";
import { createOriginRegistrar } from "../reuse/origin-registration.js";

test("origin registrations are removed on disable and late work cannot restore them", () => {
    const origins = new Map();
    const removers = [];
    const ctx = {
        getCapability: () => (owner, values) => {
            origins.set(owner, values);
            return values;
        },
        registerDisposer: (remove) => removers.push(remove),
    };
    const first = createOriginRegistrar(ctx);
    first("module:nextcloud-whiteboard", ["https://whiteboard.test"]);
    removers.splice(0).forEach((remove) => remove());
    assert.deepEqual(origins.get("module:nextcloud-whiteboard"), []);
    const second = createOriginRegistrar(ctx);
    second("module:nextcloud-whiteboard", ["https://current.test"]);
    first("module:nextcloud-whiteboard", ["https://stale.test"]);
    assert.deepEqual(origins.get("module:nextcloud-whiteboard"), [
        "https://current.test",
    ]);
    removers.splice(0).forEach((remove) => remove());
});
