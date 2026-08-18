import { randomUUID } from 'node:crypto';

export class ShowcaseStore {
  constructor(database) {
    this.database = database;
  }

  async ensureSchema() {
    await this.database.ensureTable({
      name: 'module_template_items',
      columns: [
        { name: 'id', type: 'text', primaryKey: true },
        { name: 'title', type: 'text', notNull: true },
        { name: 'owner_id', type: 'text', notNull: true },
        { name: 'created_at', type: 'timestamp', notNull: true, default: 'now' },
      ],
    });
  }

  async list(ownerId) {
    const result = await this.database.executeCommand({
      option: 'SELECT',
      table: 'module_template_items',
      columns: ['id', 'title', 'created_at'],
      where: [{ column: 'owner_id', value: ownerId }],
      orderBy: [{ column: 'created_at', direction: 'desc' }],
    });
    return (result.rows ?? []).map((row) => ({
      id: String(row.id),
      title: String(row.title),
      createdAt: row.created_at,
    }));
  }

  async create(ownerId, title) {
    const item = { id: randomUUID(), title, ownerId };
    await this.database.executeCommand({
      option: 'INSERT',
      table: 'module_template_items',
      values: { id: item.id, title, owner_id: ownerId },
    });
    return item;
  }
}
