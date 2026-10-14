import assert from "node:assert/strict";

export function createFlowRuntime() {
    const flows = new Map();
    const executions = [];
    return {
        flows,
        executions,
        registerFlow(flow) {
            assert.ok(flow.id.startsWith("nextcloud-whiteboard:"));
            assert.equal(flows.has(flow.id), false);
            flows.set(flow.id, flow);
        },
        flow: {
            exists: (flowId) => flows.has(flowId),
            async run(flowId, input, { handlers }) {
                const flow = flows.get(flowId);
                assert.ok(flow, `Unregistered flow ${flowId}`);
                const stageResults = {};
                for (const stageId of flow.stages) {
                    executions.push(`${flowId}:${stageId}`);
                    stageResults[stageId] = [
                        await handlers[stageId]({ input, stageResults }),
                    ];
                }
                return { flowId, stageResults };
            },
        },
    };
}

export function withFlowRuntime(context) {
    if (!context.registerDisposer) {
        context.disposers = [];
        context.registerDisposer = (dispose) => context.disposers.push(dispose);
        context.dispose = () =>
            context.disposers
                .splice(0)
                .reverse()
                .forEach((dispose) => dispose());
    }
    if (context.registerFlow) return context;
    const runtime = createFlowRuntime();
    const hostFlow = context.flow;
    context.registerFlow = runtime.registerFlow;
    context.flow = {
        ...hostFlow,
        exists: (flowId) =>
            runtime.flow.exists(flowId) || hostFlow?.exists?.(flowId) === true,
        run: (flowId, ...parameters) =>
            runtime.flows.has(flowId)
                ? runtime.flow.run(flowId, ...parameters)
                : hostFlow.run(flowId, ...parameters),
    };
    return context;
}
