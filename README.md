# DropShadow Launch Site

Next.js landing page for DropShadow.

## Development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Production Checks

```bash
npm run lint
npm run typecheck
npm run build
```

## Environment

Copy `.env.example` to `.env.local` and configure:

```bash
BREVO_API_KEY=
BREVO_LIST_ID=
NEXT_PUBLIC_SITE_URL=https://dropshadow.it
```

Vercel Web Analytics is enabled from the root layout with `@vercel/analytics`.
Enable Web Analytics in the Vercel project dashboard and redeploy production.
