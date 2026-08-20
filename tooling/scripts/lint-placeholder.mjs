import { execFileSync } from "node:child_process";

try {
    execFileSync("npx", ["prettier", "--check", "."], { stdio: "inherit" });
} catch {
    process.exit(1);
}
