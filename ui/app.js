const API_PATH = '/api/v1/modules/module-template/items';

function escapeHtml(value) {
  const element = document.createElement('span');
  element.textContent = String(value);
  return element.innerHTML;
}

async function mount(root) {
  const response = await fetch(API_PATH, { credentials: 'same-origin' });
  const payload = await response.json();
  const items = response.ok ? payload.data : [];
  root.innerHTML = `
    <main class="showcase card-elevated">
      <h1 data-i18n="module.module_template.title">Module showcase</h1>
      <p data-i18n="module.module_template.intro">A small end-to-end Cognis module.</p>
      <form id="showcase-form">
        <label for="showcase-title" data-i18n="module.module_template.label">Item title</label>
        <input id="showcase-title" name="title" maxlength="120" required>
        <button type="submit" data-i18n="module.module_template.create">Create</button>
      </form>
      <ul>${items.map((item) => `<li>${escapeHtml(item.title)}</li>`).join('')}</ul>
    </main>`;
  root.querySelector('form').addEventListener('submit', async (event) => {
    event.preventDefault();
    const title = new FormData(event.currentTarget).get('title');
    const created = await fetch(API_PATH, {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    if (created.ok) await mount(root);
    else window.dispatchEvent(new CustomEvent('cognis:toast', { detail: { variant: 'error', message: 'Unable to create item.' } }));
  });
}

const root = document.querySelector('#module-template-root') ?? document.querySelector('main');
if (root) void mount(root);
