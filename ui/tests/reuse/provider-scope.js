import assert from "node:assert/strict";

export function createProviderScope(capabilities) {
    const controller = new AbortController();
    const flows = new Map();
    const hooks = new Map();
    const owned = new Map();
    return {
        signal: controller.signal,
        flows,
        capabilities: {
            get: (id) => capabilities.get(id),
            contribute(id, value) {
                assert.equal(capabilities.has(id), false);
                capabilities.set(id, value);
                owned.set(id, value);
                return true;
            },
        },
        registerFlow(id, stages) {
            assert.equal(flows.has(id), false);
            flows.set(id, stages);
        },
        extendFlow(id, stageId, options, handler) {
            assert.ok(flows.get(id).includes(stageId));
            hooks.set(`${id}:${stageId}`, handler);
        },
        async runFlow(id, input) {
            controller.signal.throwIfAborted();
            const stage = { input, data: {} };
            for (const stageId of flows.get(id))
                await hooks.get(`${id}:${stageId}`)(stage);
            return stage;
        },
        dispose() {
            controller.abort();
            for (const [id, value] of owned)
                if (capabilities.get(id) === value) capabilities.delete(id);
            owned.clear();
            flows.clear();
            hooks.clear();
        },
    };
}

export function registerScopedUiActions(ctx, namespace, actions) {
    const published = {};
    for (const [action, execute] of Object.entries(actions)) {
        const flowId = `${namespace}:${action}`;
        ctx.registerFlow(flowId, ["execute"]);
        ctx.extendFlow(flowId, "execute", { id: flowId }, async (stage) => {
            stage.data.result = await execute(stage.input);
        });
        published[action] = async (input) =>
            (await ctx.runFlow(flowId, input)).data.result;
    }
    return published;
}
