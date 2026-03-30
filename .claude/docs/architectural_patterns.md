# Architectural Patterns

## Monorepo Structure (npm workspaces)

Defined in `package.json:6-9`. Two workspace globs: `apps/*` and `packages/*`.

- `apps/` — deployable applications (frontend, backend)
- `packages/` — shared code consumed by apps (empty; intended for shared types or utilities)

Cross-app scripts live at the root (`package.json:10-16`) and delegate via `--workspace=<name>`. New apps should get a matching `dev:<name>` root script added to the `concurrently` invocation.

## Frontend/Backend Separation

Fully decoupled — separate `package.json`, separate dev servers, communicate over HTTP. CORS is installed on the backend (`apps/backend/package.json`) to allow the frontend origin.

- Frontend: Next.js dev server (port 3000 by default)
- Backend: Express server (port defined in env)

## Backend Data Access

No ORM. Raw SQL via the `pg` client (`apps/backend/package.json`). Keep queries in dedicated module files (e.g. `src/db/films.js`) rather than inline in route handlers.

## Video Upload Flow (Presigned S3 URLs)

Large video files never route through the Express server. The pattern is:

1. Admin client requests a presigned URL from `POST /api/admin/upload-url` (backend generates it via AWS SDK)
2. Client uploads the file directly from the browser to S3 using the presigned URL
3. S3 event trigger (or backend webhook) kicks off an AWS MediaConvert job
4. MediaConvert outputs HLS segments + manifest back to a separate S3 prefix (e.g. `transcoded/`)
5. Backend stores the CloudFront HLS manifest URL in PostgreSQL alongside film metadata

This keeps the Express server stateless with respect to file bytes.

## Streaming Pipeline (HLS via CloudFront)

Videos are not served as raw files. The pipeline produces HLS:

- MediaConvert transcodes uploads into multi-bitrate HLS (`.m3u8` manifest + `.ts` segments)
- CloudFront serves these from the `transcoded/` S3 prefix
- Frontend player (Video.js or HLS.js) consumes the `.m3u8` URL

Adaptive bitrate is automatic — the player switches quality based on the viewer's connection.

## CloudFront Signed URLs

CloudFront is configured to require signed URLs. This prevents:
- Direct hotlinking to video URLs outside the player
- Download tools from grabbing raw files

The backend generates time-limited signed CloudFront URLs on demand (when a film page is loaded) using the private key stored in env. The frontend never holds a long-lived video URL.

## Admin Authentication

Single admin user. No user account system. Pattern:

- Admin password hash stored in env (`ADMIN_PASSWORD_HASH`)
- `POST /api/admin/login` verifies with bcrypt, returns a signed JWT
- All admin routes (`/api/admin/*`) validate the JWT via middleware
- JWT secret in env (`JWT_SECRET`)

No database table needed for auth at this scale.

## Parallel Dev with concurrently

`package.json:14` runs both dev servers from `npm run dev`. When adding new apps, add a `dev:<name>` root script and extend the `concurrently` command.
