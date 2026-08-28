# Reliable whiteboard database initialization

**Feature Branch:** feature-fix-sql-execution-errors

## Prevent concurrent schema creation

Whiteboard requests now share a single database schema initialization operation, preventing PostgreSQL duplicate type errors when requests arrive simultaneously. A failed initialization remains retryable.

## Package only installable repository files

The module manifest no longer advertises repository symlinks as downloadable files, preventing installation failures when the repository file API cannot provide a symlink path.

## Commits

- [96d40aa](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96d40aac42fe25c75fa02a0f2bb224896bc3f450)
- [cf6e6b1](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/cf6e6b10f2c61e7757d9513db88a84a9a0a65f7f)
