import assert from "node:assert/strict";
import test from "node:test";

import { contributeModuleCapability } from "../api/reuse/capability-registration.js";

test("cross-module capabilities prefer public registration", () => {
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
        ["legacy", "whiteboard:fetchBoardData", "provider"],
    ]);
});

test("module capabilities fall back to the scoped registry", () => {
    const calls = [];
    contributeModuleCapability(
        {
            capabilities: {
                contribute(capabilityId, value) {
                    calls.push([capabilityId, value]);
                },
            },
        },
        "whiteboard:fetchBoardData",
        "provider",
    );

    assert.deepEqual(calls, [["whiteboard:fetchBoardData", "provider"]]);
});
