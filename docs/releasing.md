# Release checklist

1. Update user and contributor documentation and all four locale bundles.
2. Add tests for behavior, contracts, authorization failures, invalid input, and cleanup.
3. Synchronize `manifest.json`, `package.json`, and `package-lock.json` versions.
4. Run `npm install`, `npm test`, and any browser/integration tests.
5. Run `npm run manifest:hashes` after the final content change.
6. Run `npm run check:manifest` and `git diff --check`.
7. Review manifest capabilities, dependencies, assets, repository links, and every shipped file.
8. Commit, tag the exact version, and publish from a clean checkout.

`manifest.json` is intentionally excluded from its own file inventory because including its digest would be self-referential.
