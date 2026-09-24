# Grand CMS — Cloudflare edition
Same app, rebuilt for Cloudflare: GitHub (code) + Cloudflare D1 (database) + workers.dev (publish).

## What changed vs the Netlify/Postgres version
- Prisma: postgres -> sqlite via `@prisma/adapter-d1` (D1 binding, works only on Cloudflare Workers)
- argon2 removed -> Web Crypto PBKDF2 (`src/lib/password.ts`), works on Workers
- Money fields are Float (SQLite has no Decimal)
- Visiting card scan (front+back OCR) included: Clients + Suppliers pages

## Step by step (first deploy)
1. **GitHub**: push this folder to a repo.
2. **D1 database**: dash.cloudflare.com -> Workers & Pages -> D1 SQL Database -> Create database -> name it `grand-cms-db`. Copy the Database ID.
3. Paste that ID into `wrangler.jsonc` (replace `PASTE_YOUR_D1_DATABASE_ID_HERE`).
4. Locally, in the project folder:
   ```
   npm install
   npx prisma migrate diff --from-empty --to-schema-datamodel prisma/schema.prisma --script > init.sql
   npx wrangler login
   npx wrangler d1 execute grand-cms-db --remote --file=./init.sql
   npx wrangler d1 execute grand-cms-db --remote --file=./prisma/seed.sql
   npx wrangler secret put OPENAI_API_KEY
   ```
5. Deploy: `npm run deploy` -> live at https://grand-cms.<your-subdomain>.workers.dev

## Local dev
1. `npx wrangler d1 execute grand-cms-db --local --file=./init.sql` (after generating init.sql)
2. `npx wrangler d1 execute grand-cms-db --local --file=./prisma/seed.sql`
3. `cp .dev.vars.example .dev.vars` and put your OpenAI key
4. `npm run dev` -> http://localhost:3000

## Login
`admin@grandcms.local` / `ChangeMe!12345` — change it right away.
