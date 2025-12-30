# Keyring Backend

Cloudflare Workers API for Keyring, built with Hono, D1, KV, and Drizzle.

## Requirements

- Node.js 18+
- Wrangler

## Setup

```bash
npm install
```

## Development

```bash
npm run dev
```

## Deploy

```bash
npm run deploy
```

## Configuration

Bindings and vars are defined in `keyring-be/wrangler.toml`:

- `DB` (D1 database)
- `SESSIONS` (Durable Object)
- `ALLOWED_ORIGINS`
- `NODE_ENV`
