# bina-archive

## Project Overview

A streaming platform and media archive for midwest films. Visitors browse and stream films; only the client/developer can upload or remove content. No general user accounts. A lightweight admin CMS (upload/remove) is planned.

## Tech Stack

| Layer | Tech |
|---|---|
| Frontend | Next.js (migrating from CRA boilerplate) |
| Video Player | Video.js or HLS.js (HLS stream consumption) |
| Backend | Express 5, Node.js |
| Database | PostgreSQL (via `pg`, hosted on AWS RDS) |
| Video Storage | AWS S3 |
| Video Transcoding | AWS MediaConvert (raw upload → HLS) |
| Streaming CDN | AWS CloudFront (signed URLs) |
| Admin Auth | JWT (single admin user, credentials in env) |
| Monorepo | npm workspaces + `concurrently` |

## Key Directories

```
apps/frontend/     Next.js app (currently CRA boilerplate — migration pending)
apps/backend/      Express server (not yet implemented)
packages/          Shared libraries between apps (empty)
infrasturcture/    Infrastructure config — Terraform or AWS CDK (empty, typo in name)
```

- `apps/backend/src/index.js` — Express entry point (empty, implement here first)
- `apps/frontend/src/App.js` — current CRA root component (will move to Next.js pages/)
- `package.json` — root workspace scripts

## Commands

```bash
# Run both apps in parallel
npm run dev

# Run individually
npm run dev:frontend
npm run dev:backend

# Frontend
npm run build --workspace=frontend
npm test --workspace=frontend
```

Backend has no test command yet (`apps/backend/package.json:8`).

## Environment Variables

`apps/backend/` reads from `.env` via dotenv. Required vars (to be defined):

```
DATABASE_URL
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
AWS_REGION
S3_BUCKET_NAME
CLOUDFRONT_DOMAIN
CLOUDFRONT_KEY_PAIR_ID
CLOUDFRONT_PRIVATE_KEY
JWT_SECRET
ADMIN_PASSWORD_HASH
```

## Additional Documentation

Check these when relevant:

- `.claude/docs/architectural_patterns.md` — monorepo layout, streaming pipeline, presigned upload flow, admin auth, CloudFront signing
- `.claude/docs/development_roadmap.md` — recommended build order and rationale
- `.claude/docs/page-inventory.md` — MVP → Almanac restyle tracker, page by page, with prototype-vs-real-page status
- `.claude/docs/almanac-design-system.md` — the almanac design language spec (colors, type, component patterns) extracted from `app/examples/almanac/`
- `.claude/docs/almanac-vs-mvp-functionality-audit.md` — page-by-page functionality gap analysis between the almanac prototypes and the current MVP pages they'll replace
