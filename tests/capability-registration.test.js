import assert from "node:assert/strict";
import test from "node:test";

import { contributeModuleCapability } from "../api/reuse/capability-registration.js";

test("module capabilities prefer the scoped registry", () => {
    const calls = [];
    contributeModuleCapability(
        {
            capabilities: {
                contribute(capabilityId, value) {
                    calls.push(["scoped", capabilityId, value]);
                },
            },
            contributePublicCapability(capabilityId, value) {
                calls.push(["legacy", capabilityId, value]);
            },
        },
        "whiteboard:fetchBoardData",
        "provider",
    );

    assert.deepEqual(calls, [
        ["scoped", "whiteboard:fetchBoardData", "provider"],
    ]);
});

test("module capabilities retain the legacy registration fallback", () => {
    const calls = [];
    contributeModuleCapability(
        {
            contributePublicCapability(capabilityId, value) {
                calls.push([capabilityId, value]);
            },
        },
        "whiteboard:fetchBoardData",
        "provider",
    );

    assert.deepEqual(calls, [["whiteboard:fetchBoardData", "provider"]]);
});
