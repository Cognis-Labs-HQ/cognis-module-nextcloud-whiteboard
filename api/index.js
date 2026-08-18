import { readJson, sendJson } from './reuse/http.js';
import { ShowcaseStore } from './store.js';

function requesterId(request) {
  return String(request.auth?.accountId ?? request.auth?.sub ?? '').trim();
}

export function registerApi(router, ctx) {
  const database = ctx.getCapability('db:executor');
  const requireAuth = ctx.getCapability('auth:requireAuth');
  if (!database || typeof requireAuth !== 'function') {
    throw new Error('Module template requires db:executor and auth:requireAuth.');
  }
  const store = new ShowcaseStore(database);
  const ready = store.ensureSchema();
  const listItems = async (ownerId) => {
    await ready;
    return store.list(ownerId);
  };

  router.get('/api/v1/modules/module-template/items', async (request, response) => {
    await requireAuth(request, response);
    if (response.writableEnded) return;
    sendJson(response, 200, { data: await listItems(requesterId(request)) });
  }, { access: { minRole: 'user' } });

  router.post('/api/v1/modules/module-template/items', async (request, response) => {
    await requireAuth(request, response);
    if (response.writableEnded) return;
    try {
      const body = await readJson(request);
      const title = typeof body.title === 'string' ? body.title.trim() : '';
      if (!title || title.length > 120) {
        sendJson(response, 400, { error: { code: 'invalid_title', message: 'Title must contain 1–120 characters.' } });
        return;
      }
      await ready;
      const item = await store.create(requesterId(request), title);
      ctx.log?.('info', 'Showcase item created.', {
        component: 'module-template',
        operation: 'create_item',
        itemId: item.id,
      });
      sendJson(response, 201, { data: item });
    } catch (error) {
      const clientError = ['invalid_json', 'request_too_large'].includes(error.message);
      ctx.log?.('error', 'Showcase item creation failed.', {
        component: 'module-template',
        operation: 'create_item',
        error: error.message,
      });
      sendJson(response, clientError ? 400 : 500, {
        error: {
          code: clientError ? error.message : 'internal_error',
          message: clientError ? 'The request body is invalid.' : 'The item could not be created.',
        },
      });
    }
  }, { access: { minRole: 'user' } });

  return { listItems };
}
