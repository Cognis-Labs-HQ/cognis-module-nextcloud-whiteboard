# Reliable whiteboard database initialization

**Feature Branch:** feature-fix-sql-execution-errors

## Prevent concurrent schema creation

Whiteboard requests now share a single database schema initialization operation, preventing PostgreSQL duplicate type errors when requests arrive simultaneously. A failed initialization remains retryable.

## Commits

- [96d40aa](https://github.com/Cognis-Labs-HQ/cognis-module-nextcloud-whiteboard/commit/96d40aac42fe25c75fa02a0f2bb224896bc3f450)
