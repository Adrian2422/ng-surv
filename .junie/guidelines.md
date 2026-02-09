### Project Overview

This is a monorepo containing a NestJS backend (`apps/api`) and an Angular frontend (`apps/web`). It uses `pnpm` for package management and workspace orchestration.

### Build/Configuration Instructions

#### Prerequisites
- **Node.js**: Version specified in `.nvmrc` or latest LTS.
- **pnpm**: Version 10.x (as specified in `package.json`).

#### Setup
1. Install dependencies from the root:
   ```bash
   pnpm install
   ```

2. **API Configuration**:
   - Navigate to `apps/api`.
   - Copy `.env.example` to `.env`:
     ```bash
     cp .env.example .env
     ```
   - Ensure `DATABASE_URL` is correctly set for Prisma.
   - Run Prisma generation (if not automatically done):
     ```bash
     pnpm --filter api exec prisma generate
     ```

#### Running the Project
- **Full Stack**: Run from root using a workspace-aware command or start separately.
- **API**: `pnpm --filter api start:dev`
- **Web**: `pnpm --filter web start`

---

### Testing Information

#### Backend (NestJS - Jest)
- **Run all tests**: `pnpm --filter api test`
- **Watch mode**: `pnpm --filter api run test:watch`
- **E2E tests**: `pnpm --filter api run test:e2e`

**Adding Backend Tests**:
Create files with `.spec.ts` suffix in `apps/api/src`. Use NestJS `Test` utility for DI-aware tests.
Example:
```typescript
describe('Simple Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
```

#### Frontend (Angular - Vitest)
- **Run all tests**: `pnpm --filter web test --watch=false`
- **Watch mode**: `pnpm --filter web test`

**Adding Frontend Tests**:
Create files with `.spec.ts` suffix in `apps/web/src/app`. Use `TestBed` for Angular component tests or standard Vitest for pure logic.
Example:
```typescript
import { describe, it, expect } from 'vitest';

describe('Simple Web Test', () => {
  it('should pass', () => {
    expect(1 + 1).toBe(2);
  });
});
```

---

### Additional Development Information

#### Code Style
- **Prettier**: Consistent formatting is enforced via Prettier.
  - `apps/api`: Configured in `apps/api/.prettierrc`.
  - `apps/web`: Configured in `apps/web/package.json`.
- **Linting**:
  - API uses ESLint with `typescript-eslint`.
  - Rules of note: `@typescript-eslint/no-explicit-any` is `off`, but `@typescript-eslint/no-floating-promises` is `warn`.

#### Database (Prisma)
- Prisma schema is located at `apps/api/prisma/schema.prisma`.
- Configuration is handled in `apps/api/prisma.config.ts`.
- Environment variables for Prisma must be in `apps/api/.env`.

#### Angular v21
- The web app uses Angular v21 features (Signals, etc., are likely encouraged).
- Unit testing is powered by Vitest instead of Karma/Jasmine, integrated via `@angular/build:unit-test`.

---

### AI Agent Skills & Architecture

#### Agent Skills Directory
The `.junie/skills` directory contains specialized guidance for AI agents. These files define the project's architecture, domain rules, and implementation patterns.

- **`project-context`**: This is the core skill defining the **Event-Driven Architecture (EDA)** and **CQRS** patterns used in the project. It outlines the domain model for the survey application and strict rules for Commands, Events, and Queries.
- **Technology-Specific Skills**: Other directories (e.g., `angular-*`, `nestjs-*`) provide best practices for specific frameworks used in this monorepo.

#### Architectural Principles
When developing, ensure alignment with the principles defined in `.junie/skills/project-context/SKILL.md`:
- **Command**: Changes state, can be rejected.
- **Event**: Immutable fact that already occurred.
- **Query**: Pure read, no side effects.
- **Read Model**: Optimized for reading, updated asynchronously via events.
