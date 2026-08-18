export function registerCommands({ register, apiGet, apiPost }) {
  register('module-template:list', async ({ apiBaseUrl, getApiToken }) =>
    apiGet(apiBaseUrl, '/api/v1/modules/module-template/items', await getApiToken()), {
    usage: 'cognisctl module-template:list',
    description: 'List your module-template showcase items.',
  });
  register('module-template:create', async ({ args, apiBaseUrl, getApiToken }) => {
    const title = args.join(' ').trim();
    if (!title) throw new Error('Usage: cognisctl module-template:create <title>');
    return apiPost(
      apiBaseUrl,
      '/api/v1/modules/module-template/items',
      await getApiToken(),
      { title },
    );
  }, {
    usage: 'cognisctl module-template:create <title>',
    description: 'Create a showcase item.',
  });
}
