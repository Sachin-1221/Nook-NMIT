# AI Usage Declaration

## Tools used

- ChatGPT (architecture discussion, debugging, code review)
- Claude (boilerplate, error fixing, explanation)

No IDE-integrated AI (Cursor, Copilot, Windsurf). All code was written and edited directly in the terminal using `micro`, and all commits were made with the `git` CLI.

## How AI was used

AI as an assistant, not a wholesale replacement:

- Initial `create-next-app` scaffolding, Prisma init, Tailwind config
- Repetitive API route boilerplate and Tailwind class strings
- Debugging build and runtime errors, which I applied and tested myself

## What I did myself

- Designed the database schema and field list
- Chose Open Library and wrote the normalization logic
- Wrote and tested ownership checks (401/403 responses via curl)
- Wired Vercel env vars and Neon migration
- Manually tested every endpoint
- Wrote all documentation
- Made every commit

## What I understand

- httpOnly SameSite=Lax cookie, HS256 JWT signed with server-only secret
- Ownership enforced server-side, not just hidden in UI
- Image uploads are base64 data URLs capped at 500 KB
