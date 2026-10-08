# Nook NMIT — Campus Marketplace

A full-stack peer-to-peer marketplace for NMIT students to buy and sell textbooks, electronics, lab gear, and campus essentials.

**Live:** https://nook-nmit.vercel.app

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
