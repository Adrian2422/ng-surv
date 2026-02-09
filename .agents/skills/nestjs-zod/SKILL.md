# Skill: Integrating Zod with NestJS using `nestjs-zod`

## Skill Overview

This skill enables an AI agent to correctly integrate **Zod** with **NestJS** using the `nestjs-zod` package, and to design **strongly validated, type-safe DTO models** based on Zod schemas.

The agent will learn:
- How to configure `nestjs-zod` in a NestJS application
- How to define Zod schemas as the single source of truth
- How to derive DTOs and validation pipes from schemas
- How to use schemas for runtime validation and compile-time typing
- How to structure schemas for maintainability and reuse

This skill assumes familiarity with:
- NestJS fundamentals (modules, controllers, pipes)
- TypeScript
- Basic Zod concepts

---

## Why Zod in NestJS

Zod provides:
- Runtime validation
- Static type inference
- Composability and schema reuse

Using `nestjs-zod` allows:
- Eliminating class-validator + class-transformer boilerplate
- Using schemas as both validation and type definitions
- Consistent validation across controllers, services, and tests

Zod schemas become the **authoritative domain contract**.

---

## Installation

```bash
npm install zod nestjs-zod
```

---

## Global Configuration

### Enable Zod Validation Pipe Globally

In `main.ts`:

```ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ZodValidationPipe } from 'nestjs-zod';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ZodValidationPipe({
      transform: true,
    }),
  );

  await app.listen(3000);
}

bootstrap();
```

This ensures all incoming requests using Zod-based DTOs are validated automatically.

---

## Defining Zod Schemas

### Basic Schema

```ts
import { z } from 'zod';

export const CreateUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  age: z.number().int().positive().optional(),
});
```

Rules:
- Use explicit constraints
- Avoid `any`
- Prefer `.optional()` over unions when possible

---

## Creating DTOs from Schemas

### Using `createZodDto`

```ts
import { createZodDto } from 'nestjs-zod';
import { CreateUserSchema } from './create-user.schema';

export class CreateUserDto extends createZodDto(CreateUserSchema) {}
```

Effects:
- Generates a DTO class compatible with NestJS
- Automatically hooks into `ZodValidationPipe`
- Preserves full type inference

---

## Using DTOs in Controllers

```ts
import { Body, Controller, Post } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';

@Controller('users')
export class UsersController {
  @Post()
  create(@Body() dto: CreateUserDto) {
    return {
      email: dto.email,
      age: dto.age,
    };
  }
}
```

If validation fails:
- HTTP 400 is returned
- Error details come directly from Zod

---

## Schema Composition and Reuse

### Base Schemas

```ts
export const IdSchema = z.object({
  id: z.string().uuid(),
});
```

### Extending Schemas

```ts
export const UpdateUserSchema = CreateUserSchema.partial().extend({
  id: z.string().uuid(),
});
```

Best practices:
- Compose schemas instead of duplicating fields
- Use `.pick()`, `.omit()`, `.partial()`, `.extend()`

---

## Inferring Types from Schemas

Use Zod as the **type source**, not DTOs.

```ts
export type CreateUserInput = z.infer<typeof CreateUserSchema>;
```

Recommended usage:
- Services
- Domain logic
- Tests
- Message queues
- External integrations

---

## Validation Outside Controllers

Zod schemas can be reused for manual validation:

```ts
const result = CreateUserSchema.safeParse(data);

if (!result.success) {
  throw new Error(result.error.message);
}
```

This enables:
- Validation in services
- Validation in workers / cron jobs
- Validation in integration boundaries

---

## Error Handling Strategy

`nestjs-zod` maps Zod errors to NestJS `BadRequestException`.

Recommended:
- Do not catch validation errors in controllers
- Let the global pipe handle them
- Standardize error response format at the API gateway if needed

---

## Folder Structure Recommendation

```
users/
├── schemas/
│   ├── create-user.schema.ts
│   └── update-user.schema.ts
├── dto/
│   ├── create-user.dto.ts
│   └── update-user.dto.ts
├── users.controller.ts
├── users.service.ts
```

Rules:
- Schemas are framework-agnostic
- DTOs are NestJS-specific adapters
- Business logic depends on inferred types, not DTO classes

---

## Design Principles for the Agent

The agent MUST:
1. Treat Zod schemas as the single source of truth
2. Never duplicate validation rules in DTOs
3. Prefer schema composition over inheritance
4. Infer types from schemas, not classes
5. Use `createZodDto` for all request DTOs
6. Avoid mixing `class-validator` with Zod

The agent SHOULD:
- Design schemas that reflect real domain constraints
- Keep schemas small and composable
- Use strict schemas unless explicitly relaxed

---

## Common Anti-Patterns to Avoid

❌ Writing validation logic in services  
❌ Duplicating schemas for create/update without composition  
❌ Using DTO classes as domain models  
❌ Mixing Zod and class-validator in the same project  

---

## Outcome of This Skill

After applying this skill, the agent can:
- Integrate Zod cleanly into any NestJS project
- Produce consistent, validated, type-safe APIs
- Reduce boilerplate and validation drift
- Build maintainable schema-driven backends

This skill is foundational for schema-first API design in NestJS.
