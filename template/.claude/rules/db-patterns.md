---
paths: ["prisma/**", "drizzle/**", "supabase/**", "src/db/**", "src/lib/db/**", "db/**"]
---

# Database Patterns

## General Rules
- Always create migrations for schema changes — never modify the database directly
- Use transactions for multi-step operations
- Validate inputs with Zod before database writes
- Handle connection pooling appropriately for serverless environments

## Prisma
- Schema lives in `prisma/schema.prisma`
- Run `npx prisma migrate dev --name <description>` after schema changes
- Use `npx prisma generate` to regenerate the client after schema changes
- Use `prisma.$transaction()` for atomic operations
- Import from `@prisma/client`, use singleton pattern for the client instance

## Drizzle
- Schema lives in `src/db/schema.ts` (or project-configured location)
- Run `npx drizzle-kit push` (dev) or `npx drizzle-kit migrate` (prod) after changes
- Use `db.transaction()` for atomic operations
- Prefer `drizzle-orm` query builder over raw SQL

## Supabase
- Migrations in `supabase/migrations/`
- Always define RLS (Row Level Security) policies for tables
- Use `supabase.from('table')` client, not raw SQL in application code
- Test RLS policies: verify that unauthenticated users cannot access protected data

## Seed Data
- Place seed scripts in `prisma/seed.ts` or `src/db/seed.ts`
- Seed data should be idempotent (safe to run multiple times)
- Use `upsert` or `ON CONFLICT` patterns
