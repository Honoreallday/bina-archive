# Development Roadmap

Ordered by dependency and proximity to the immediate need (video upload endpoint).

---

## Phase 1 — Backend Foundation

Everything else depends on this.

1. **Express server skeleton** — `apps/backend/src/index.js`: basic server, env loading, CORS, health check route
2. **PostgreSQL connection** — `src/db/client.js`: pool setup, test connection on startup
3. **Films table migration** — schema: `id`, `title`, `year`, `director`, `description`, `genre`, `duration_seconds`, `hls_manifest_url`, `thumbnail_url`, `created_at`

---

## Phase 2 — Upload Endpoint (immediate priority)

4. **AWS SDK setup** — install `@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`, configure with env vars
5. **Presigned URL endpoint** — `POST /api/admin/upload-url`: generates a presigned S3 PUT URL for a given filename; returns the URL and the final S3 key
6. **MediaConvert trigger** — either an S3 event notification that triggers a Lambda → MediaConvert job, or a `POST /api/admin/transcode` endpoint the admin calls manually after upload confirms; the latter is simpler to start
7. **Film metadata endpoint** — `POST /api/admin/films`: saves title, director, description, and the resulting CloudFront HLS URL to the database after transcoding completes

At this point the upload pipeline is functional end-to-end, even without a UI.

---

## Phase 3 — Admin Auth

8. **bcrypt + JWT** — install `bcryptjs` and `jsonwebtoken`; implement `POST /api/admin/login`
9. **Auth middleware** — JWT verification middleware applied to all `/api/admin/*` routes
10. Lock the upload and film endpoints behind this middleware

Auth is placed after the upload endpoint is working so you can develop and test the pipeline without auth friction, then secure it before any UI is built.


---

## Phase 4 — Public API

11. **Film listing** — `GET /api/films`: returns all published films with metadata (no HLS URL — that comes separately)
12. **Single film + signed URL** — `GET /api/films/:id`: returns metadata + a fresh CloudFront signed URL valid for ~2 hours
13. **CloudFront signing** — install `@aws-sdk/cloudfront-signer`; generate signed URLs server-side on every film page request

---

## Phase 5 — Frontend Migration & Public UI

14. **Migrate to Next.js** — replace CRA with a Next.js app in `apps/frontend/`; do this before building any real frontend so you don't migrate half-built pages
15. **Film index page** — grid/list of films from `GET /api/films`
16. **Film detail page** — metadata display + video player; fetches signed HLS URL from `GET /api/films/:id`
17. **HLS player** — integrate Video.js or HLS.js to consume the `.m3u8` signed URL

---

## Phase 6 — Admin CMS UI

18. **Login page** — simple form, stores JWT in memory or httpOnly cookie
19. **Upload page** — form for metadata + file picker; calls presigned URL endpoint, uploads directly to S3, then posts metadata
20. **Film management** — list of uploaded films with remove/unpublish actions

---

## Phase 7 — Infrastructure & Hardening

21. **Infrastructure as code** — define S3 buckets, CloudFront distribution, RDS instance, MediaConvert presets in `infrasturcture/` using Terraform or AWS CDK (fix directory typo when setting this up)
22. **Environment separation** — dev/staging/prod env configs
23. **CloudFront signed URL enforcement** — ensure the S3 bucket is not publicly accessible; all access goes through CloudFront
