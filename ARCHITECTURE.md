# Architecture

## Overview

Next.js 14 App Router full-stack app. Frontend pages and backend API routes in one project. Deployed on Vercel with PostgreSQL on Neon.

## Database (Prisma + PostgreSQL)

**User**: id (cuid), email (unique), name, passwordHash, createdAt
**Listing**: id (cuid), title, description, price (Decimal), category, imageUrl, status (ACTIVE | SOLD), pickupLocation?, contact?, sellerId (FK, cascade), createdAt, updatedAt

Indexes on `status` and `category`.

## Backend API

All under `src/app/api/`:

| Route | Purpose |
|---|---|
| `/api/auth/register` | POST — create user, bcrypt hash |
| `/api/auth/login` | POST — verify, set JWT cookie |
| `/api/auth/logout` | POST — clear cookie |
| `/api/auth/me` | GET — return session user |
| `/api/listings` | GET (search/filter/sort), POST (create) |
| `/api/listings/[id]` | GET, PATCH, DELETE (owner only) |
| `/api/listings/[id]/sold` | PATCH — toggle ACTIVE/SOLD (owner only) |
| `/api/external/books` | GET — proxy Open Library |
| `/api/stats` | GET — counts for homepage |

## Authentication

- bcryptjs (10 rounds) for password hashing
- JWT (HS256) signed with `jose`, stored in httpOnly SameSite=Lax cookie `nook_token`
- `getSession()` in `src/lib/auth.ts` verifies on server
- Every mutating route checks `listing.sellerId === session.userId`, returns 401/403 otherwise
- UI hides owner buttons but server is source of truth

## External API

`GET /api/external/books?q=...` proxies Open Library. Browser never calls Open Library directly. Backend normalizes response to `{ title, author, year, coverUrl }[]` and returns 502 on upstream failure.

## Deployment

- App on Vercel (auto-deploy from `main`)
- DB on Neon PostgreSQL
- Vercel env vars: `DATABASE_URL`, `JWT_SECRET`
- `postinstall: prisma generate` runs on build
- Migrations via `prisma migrate deploy`

## Trade-offs

- Next.js over separate Express: no CORS, one deploy
- Postgres over SQLite: indexing + hosted persistence
- Custom JWT auth over provider: rubric requirement
- Base64 uploads (500 KB cap) over S3: keeps deploy simple
