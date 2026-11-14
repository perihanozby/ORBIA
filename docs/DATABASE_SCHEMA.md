# Database schema — implemented SQLite version 3

Authoritative executable statements and migration: src/data/repository.ts. Runtime adapter: src/data/nativeDatabase.ts using Nitro SQLite. Production storage is app-private orbia.sqlite; no custom encryption. WAL and foreign_keys enabled. Initialization errors never delete storage. Versions newer than 3 are rejected.

Version 1: goals, milestones, tasks, selections, habits, occurrences, notes, preferences. Version 2 adds focusSessions transactionally and preserves version-one records. Tests exercise initialization, migration, FK behavior, rollback, constraints and actual file close/reopen. Native Android process-restart verification remains outstanding.

- tasks: stable text ID, nonempty title, description, nullable local YYYY-MM-DD dueDate, priority 0..2, nullable goal FK (SET NULL), nullable UTC completedAt, UTC createdAt. Indexes on due/completion and goal relationship.
- goals: ID/title/description, archived 0/1 and createdAt. Milestones reference goal with cascade; completion 0/1. Progress derives only from milestones.
- selections: local date, task FK cascade, slot 1..3. Unique date/task and date/slot. Repository selection toggles in a transaction; a completed task retains its slot.
- habits: ID/title/description, validated comma-separated unique weekday numbers 0..6, archived flag and createdAt. Occurrences unique by habit/local-date; complete/skipped enum; FK cascade and date index. No fixed 24-hour local-calendar arithmetic.
- notes: ID/title/body/UTC updatedAt. Debounced editor autosave retains the same ID.
- preferences: string key/value for settings; never used as primary task storage.
- focusSessions: ID, planned duration 60..14400 seconds, verified seconds bounded by duration, running/paused/finished/cancelled state, UTC creation/update times. Restart recovers paused and excludes unverified time. Only finished verified sessions count toward focus history.

Version 3 adds task recurrence and nullable successorOf self-FK (SET NULL) with a unique successor index; subtasks have task FK CASCADE, title, completion and position. Migration preserves existing tasks and defaults them to non-repeating. No tags, task time, reminder-per-item or life-area tables yet. No implicit hidden integration or schema claims beyond source. Backup includes relational data and focus sessions, checks links/uniqueness/types/dates before restore, and replaces all records in one transaction after UI preview/confirmation.

