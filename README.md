# Nook NMIT — Campus Marketplace

A full-stack peer-to-peer marketplace for NMIT students to buy and sell textbooks, electronics, lab gear, and campus essentials.

**Live:** https://nook-nmit-xit4.vercel.app

## Features

- Register and login with bcrypt + JWT in an httpOnly cookie
- Create listings with title, description, price, category, image (upload or URL)
- Browse with search, category filter, and sort
- Detail page with seller contact info
- Edit and delete own listings — enforced server-side (403 for non-owners)
- Mark as sold with distinct red SOLD badge
- Dashboard with All / Active / Sold filters
- Open Library external API integration for book autofill
- Client + server validation (HTML5 + Zod)
- Loading skeletons, empty states, error banners

## Stack

Next.js 14 · TypeScript · Tailwind · Prisma 6 · PostgreSQL (Neon) · bcryptjs · jose · Zod · Open Library · Vercel

## Setup

1. Clone:

```bash
git clone https://github.com/Sachin-1221/Nook-NMIT.git
cd Nook-NMIT
npm install
```

Create `.env`:

```
DATABASE_URL="postgresql://..."
JWT_SECRET="long-random-string"
```

Run:

```bash
npx prisma migrate deploy
npx prisma generate
npm run dev
```

Open http://localhost:3000.

## API Routes

| Route | Methods |
|---|---|
| `/api/auth/register` | POST |
| `/api/auth/login` | POST |
| `/api/auth/logout` | POST |
| `/api/auth/me` | GET |
| `/api/listings` | GET, POST |
| `/api/listings/[id]` | GET, PATCH, DELETE |
| `/api/listings/[id]/sold` | PATCH |
| `/api/external/books` | GET |
| `/api/stats` | GET |

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md).

## AI Usage

See [AI_USAGE.md](./AI_USAGE.md).
## Database Schema

**User** — id, email (unique), name, passwordHash, createdAt, listings[]

**Listing** — id, title, description, price, category, imageUrl, status (ACTIVE | SOLD), pickupLocation?, contact?, sellerId (FK → User, cascade), createdAt, updatedAt

Indexes: `status`, `category`. One User → many Listings.

## Backend Architecture
src/app/api/
├── auth/{register,login,logout,me}
├── listings/route.ts GET (search/filter/sort), POST
├── listings/[id]/route.ts GET, PATCH, DELETE (owner)
├── listings/[id]/sold/route.ts PATCH (owner)
├── external/books/route.ts GET — proxy Open Library
└── stats/route.ts GET

Auth: bcryptjs → JWT (jose) → httpOnly SameSite=Lax cookie → verified on every protected route. Zod validation on every request body. Server-side ownership: `listing.sellerId === session.userId`, else 401/403.

## External API

`GET /api/external/books?q=...` proxies `openlibrary.org/search.json`. Normalized to `{ title, author, year, coverUrl }`. Cached 1 hour. Returns 502 on upstream failure.

## Seed Data

Populate the database with sample users and listings:

```bash
npx prisma db seed
```

Sample login: `aarav@nmit.ac.in` / `password123`

## Screenshots

- Landing page
- Browse page with filters
- Listing detail with seller contact
- Dashboard with owner actions
