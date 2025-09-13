# ADR 0001: Adopt Shared API SDK Package (`@bhq/api`)

**Status**: Accepted  
**Date**: 2025-09-13  
**Decision Makers**: Aaron, PE (ChatGPT)

## Context
We have multiple apps (`apps/contacts`, `apps/animals`, `apps/breeding`) that call the same backend. Previously, each app embedded its own fetch helpers, causing drift, copy/paste bugs, and duplicated types. We’re standardizing on a single shared SDK in `packages/api` that apps import as `@bhq/api`.

## Decision
Create a workspace package `@bhq/api` that:
- Exposes typed clients per domain (`contacts.ts`, `animals.ts`, `breeding.ts`, …).
- Ships a single entry (`dist/index.js`) with exported modules and types.
- Is built **before** app builds locally and in CI/CD (Vercel).

Apps import only from `@bhq/api` and **must not** deep-import its internal files.

## Consequences
### Pros
- One source of truth for API contracts and types.
- Safer refactors; fewer breaking diffs across apps.
- Predictable Vercel/CI builds once monorepo is configured.

### Cons / Risks
- Monorepo and Vercel must install from the repo root so the workspace is visible.
- Any change to `@bhq/api` requires a rebuild of dependent apps (acceptable).

## Alternatives Considered
1. **Per-app fetchers** — fastest initially but leads to divergence and duplicated fixes.
2. **Git submodule SDK** — heavier dev ergonomics, worse DX than workspaces.
3. **Inline aliasing** — OK for emergencies; not a long-term contract.

## Implementation
**Monorepo root `/package.json`:**
```json
{
  "name": "breederhq",
  "private": true,
  "workspaces": ["apps/*", "packages/*"]
}
