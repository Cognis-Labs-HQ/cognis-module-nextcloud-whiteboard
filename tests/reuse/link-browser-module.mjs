import { readFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { SourceTextModule } from "node:vm";

const modules = new Map();
async function loadModule(path) {
    if (modules.has(path)) return modules.get(path);
    const module = new SourceTextModule(await readFile(path, "utf8"), {
        identifier: path,
    });
    modules.set(path, module);
    return module;
}

const entry = await loadModule(resolve(process.argv[2]));
await entry.link((specifier, parent) => {
    if (!specifier.startsWith("."))
        throw new Error(
            `Browser entry has an external static import: ${specifier}`,
        );
    return loadModule(resolve(dirname(parent.identifier), specifier));
});
