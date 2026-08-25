import assert from "node:assert/strict";
import test from "node:test";
import { NextcloudWhiteboardStore } from "../api/store.js";

function createMemoryDb() {
    const tables = new Map();
    const primaryKeys = new Map();
    const applyWhere = (rows, where = []) =>
        rows.filter((row) =>
            where.every((clause) => row[clause.column] === clause.value),
        );
    const db = {
        async ensureTable(definition) {
            if (!tables.has(definition.name)) tables.set(definition.name, []);
            const explicitPrimaryKey = Array.isArray(definition.primaryKey)
                ? definition.primaryKey
                : [];
            const columnPrimaryKey = (definition.columns ?? [])
                .filter((column) => column.primaryKey)
                .map((column) => column.name);
            primaryKeys.set(definition.name, [
                ...explicitPrimaryKey,
                ...columnPrimaryKey,
            ]);
        },
        async executeCommand(command) {
            const rows = tables.get(command.table) ?? [];
            if (command.option === "SELECT") {
                const selected = applyWhere(rows, command.where).slice(
                    0,
                    command.limit ?? rows.length,
                );
                return { rows: selected.map((row) => ({ ...row })) };
            }
            if (command.option === "UPDATE") {
                const selected = applyWhere(rows, command.where);
                for (const row of selected)
                    Object.assign(row, command.set ?? command.values);
                return { rows: [] };
            }
            if (command.option === "INSERT") {
                const values = { ...command.values };
                const conflictColumns =
                    command.conflict?.target ??
                    command.onConflict?.columns ??
                    [];
                const existing = rows.find(
                    (row) =>
                        conflictColumns.length > 0 &&
                        conflictColumns.every(
                            (column) => row[column] === values[column],
                        ),
                );
                if (existing && command.conflict?.action === "update") {
                    Object.assign(existing, command.conflict.update ?? values);
                } else if (existing && command.onConflict) {
                    for (const column of command.onConflict.merge ?? []) {
                        existing[column] = values[column];
                    }
                } else {
                    const primaryKey = primaryKeys.get(command.table) ?? [];
                    const duplicatePrimary = rows.some(
                        (row) =>
                            primaryKey.length > 0 &&
                            primaryKey.every(
                                (column) => row[column] === values[column],
                            ),
                    );
                    if (duplicatePrimary)
                        throw new Error("duplicate key value");
                    rows.push(values);
                }
                tables.set(command.table, rows);
                return { rows: [] };
            }
            if (command.option === "DELETE") {
                tables.set(
                    command.table,
                    command.where
                        ? rows.filter(
                              (row) => !applyWhere([row], command.where).length,
                          )
                        : [],
                );
                return { rows: [] };
            }
            return { rows: [] };
        },
        async transaction(callback) {
            await callback(db);
        },
    };
    return db;
}

test("merged snapshot reads and writes through one transaction", async () => {
    const commands = [];
    const executor = {
        async executeCommand(command) {
            commands.push(command);
            if (command.option === "SELECT") {
                return {
                    rows: [
                        {
                            elements_json: JSON.stringify([
                                { id: "existing", version: 1 },
                            ]),
                        },
                    ],
                };
            }
            return { rows: [] };
        },
    };
    const db = {
        async executeCommand() {
            throw new Error("snapshot command escaped transaction");
        },
        async transaction(callback) {
            await callback(executor);
        },
    };
    const store = new NextcloudWhiteboardStore({ db });

    const saved = await store.saveMergedElementsSnapshot("board", [
        { id: "incoming", version: 1 },
    ]);

    assert.deepEqual(
        saved.elements.map((element) => element.id),
        ["existing", "incoming"],
    );
    assert.deepEqual(
        commands.map((command) => command.option),
        ["SELECT", "INSERT", "UPDATE"],
    );
});

test("nextcloud whiteboard store persists normalized configuration", async () => {
    const store = new NextcloudWhiteboardStore({ db: createMemoryDb() });
    await store.ensureSchema();
    const saved = await store.saveConfig({
        serverUrl: "https://whiteboard.example.test:3002",
        apiKey: "secret-api-key-minimum-16-chars",
        imageUploadMaxBytes: 2097152,
    });

    assert.equal(saved.serverUrl, "https://whiteboard.example.test:3002");
    assert.equal(saved.apiKeyConfigured, true);
    assert.equal(saved.apiKey, "secret-api-key-minimum-16-chars");
    assert.equal(saved.imageUploadMaxBytes, 2097152);
});

test("nextcloud whiteboard store deletes configuration", async () => {
    const store = new NextcloudWhiteboardStore({ db: createMemoryDb() });
    await store.ensureSchema();
    await store.saveConfig({
        serverUrl: "https://whiteboard.example.test",
        apiKey: "secret-api-key-minimum-16-chars",
        imageUploadMaxBytes: 4096,
    });
    await store.deleteConfig();

    assert.deepEqual(await store.getConfig(), {
        serverUrl: "",
        apiKeyConfigured: false,
        apiKey: "",
        imageUploadMaxBytes: 1048576,
        updatedAt: null,
    });
});

test("nextcloud whiteboard store enforces allow-list access", async () => {
    const store = new NextcloudWhiteboardStore({ db: createMemoryDb() });
    await store.ensureSchema();
    const board = await store.createWhiteboard({
        title: "Planning",
        createdBy: "teacher",
        participants: ["student"],
    });

    assert.equal(await store.canAccessWhiteboard(board.id, "teacher"), true);
    assert.equal(await store.canAccessWhiteboard(board.id, "student"), true);
    assert.equal(await store.canAccessWhiteboard(board.id, "outsider"), false);
});

test("nextcloud whiteboard store renames boards", async () => {
    const store = new NextcloudWhiteboardStore({ db: createMemoryDb() });
    await store.ensureSchema();
    const board = await store.createWhiteboard({
        title: "Planning",
        createdBy: "teacher",
        participants: [],
    });

    const renamed = await store.renameWhiteboard(board.id, "Updated planning");

    assert.equal(renamed.title, "Updated planning");
});

test("nextcloud whiteboard store uses structured update payloads", async () => {
    const source = await import("node:fs/promises").then((fs) =>
        fs.readFile(new URL("../api/store.js", import.meta.url), "utf8"),
    );
    assert.doesNotMatch(
        source,
        new RegExp(
            "option:\\s*['\"]UPDATE['\"],\\n\\s*table:[^\\n]+\\n\\s*values:",
        ),
    );
    assert.match(
        source,
        new RegExp(
            "option:\\s*['\"]UPDATE['\"],\\n\\s*table:[^\\n]+\\n\\s*set:",
        ),
    );
});

test("nextcloud whiteboard presence pointer columns use structured text types", async () => {
    const definitions = [];
    const db = {
        async ensureTable(definition) {
            definitions.push(definition);
        },
        async executeCommand() {
            return { rows: [] };
        },
        async transaction(callback) {
            await callback(db);
        },
    };
    const store = new NextcloudWhiteboardStore({ db });
    await store.ensureSchema();
    const presenceTable = definitions.find(
        (definition) => definition.name === "nextcloud_whiteboard_presence",
    );
    const pointerColumns = new Map(
        presenceTable.columns
            .filter((column) => column.name.startsWith("pointer_"))
            .map((column) => [column.name, column.type]),
    );
    assert.equal(pointerColumns.get("pointer_x"), "text");
    assert.equal(pointerColumns.get("pointer_y"), "text");
    assert.equal(pointerColumns.get("pointer_style"), "text");
    assert.equal(pointerColumns.get("pointer_updated_at"), "timestamp");
    assert.equal(
        presenceTable.columns.find(
            (column) => column.name === "selection_payload",
        )?.type,
        "text",
    );
});

test("nextcloud whiteboard presence stores null pointer timestamp when no pointer is available", async () => {
    const commands = [];
    const db = {
        async ensureTable() {},
        async executeCommand(command) {
            commands.push(command);
            return { rows: [] };
        },
        async transaction(callback) {
            await callback(db);
        },
    };
    const store = new NextcloudWhiteboardStore({ db });

    await store.upsertPresence({
        whiteboardId: "board-1",
        username: "alice",
        sessionId: "session-1",
        displayName: "Alice",
        guest: false,
        active: true,
    });

    const insert = commands.find(
        (command) =>
            command.option === "INSERT" &&
            command.table === "nextcloud_whiteboard_presence",
    );
    assert.equal(insert.values.pointer_x, null);
    assert.equal(insert.values.pointer_y, null);
    assert.equal(insert.values.pointer_style, null);
    assert.equal(insert.values.pointer_updated_at, null);
});

test("nextcloud whiteboard store allows configuration before API key is set", async () => {
    const store = new NextcloudWhiteboardStore({ db: createMemoryDb() });
    await store.ensureSchema();
    const saved = await store.saveConfig({
        serverUrl: "https://whiteboard.example.test",
        apiKey: "",
        imageUploadMaxBytes: 4096,
    });

    assert.equal(saved.serverUrl, "https://whiteboard.example.test");
    assert.equal(saved.apiKeyConfigured, false);
    assert.equal(saved.apiKey, "");
    assert.equal(saved.imageUploadMaxBytes, 4096);
});
