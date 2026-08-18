import { registerApi } from './api/index.js';
import { registerUi } from './api/ui.js';

const FLOW = {
  id: 'showcase-items',
  description: 'Let modules enrich showcase items without direct imports.',
  stages: ['validate', 'enrich', 'present'],
};

export function bootstrapModule(ctx) {
  registerUi(ctx);
  const service = registerApi(ctx.router, ctx);

  if (!ctx.flow.exists(FLOW.id)) ctx.registerFlow(FLOW);
  ctx.flow.extend(
    FLOW.id,
    'enrich',
    { id: 'module-template:add-source' },
    ({ input }) => ({ ...input, source: 'module-template' }),
  );
  ctx.contributePublicCapability('showcase:listItems', service.listItems);

  ctx.log?.('info', 'Module template enabled.', {
    component: 'module-template',
    operation: 'bootstrap',
  });
}
