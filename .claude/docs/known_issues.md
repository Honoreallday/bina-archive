# Known Issues & Fixes

A running log of bugs encountered, their root cause, and how they were resolved.

---

## PostgreSQL SSL handshake failure on local dev

**Symptom**
Server crashes on startup (or Postman request fails) with:
```
Error: write EPROTO 16175616:error:100000f7:SSL routines:OPENSSL_internal:WRONG_VERSION_NUMBER
```

**When it appeared**
First attempt to connect to local PostgreSQL after the backend server was stood up.

**Root cause**
The `pg` library attempts an SSL handshake by default when a `DATABASE_URL` connection string is provided. Local PostgreSQL instances typically don't have SSL configured, so the handshake fails with a version mismatch error.

**Fix**
`apps/backend/src/db/client.js` — added conditional `ssl` option to the pool config:

```js
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});
```

- `false` locally — no SSL, matches standard local Postgres setup
- `{ rejectUnauthorized: false }` in production — enables SSL for AWS RDS but skips certificate verification, which is required because RDS uses self-signed certificates

**What to watch for**
When deploying to production, ensure `NODE_ENV=production` is set in the environment. Without it, the pool will connect to RDS without SSL, which may be blocked depending on the RDS parameter group configuration.

---

## Orphaned S3 objects on failed DB insertion

**Symptom**
A raw video file exists in S3 under `raw/` (and a MediaConvert job may have already started) but no corresponding record exists in the `films` table. Upload page shows "Failed to save film record."

**Root cause**
The upload flow is: (1) get presigned URL → (2) PUT file to S3 → (3) POST metadata to Express/DB. Steps 2 and 3 are not atomic. If step 3 fails for any reason (DB error, validation error, network issue), the S3 upload from step 2 is not rolled back. The S3 event also fires on step 2 completion, so MediaConvert may begin transcoding even though no DB record will exist.

**Current state**
No automatic cleanup. Orphaned `raw/` and potentially `hls/` objects accumulate silently. No retry or rollback logic exists in the upload flow.

**To do**
Implement one or both of:
- S3 Lifecycle rule to auto-delete objects in `raw/` that have no corresponding `hls/` output after N days
- On failed step 3, issue a `DELETE` request from the frontend to a backend endpoint that removes the orphaned `raw/` key from S3

---

## Film `status` field never updates after MediaConvert completes

**Symptom**
All films in the DB permanently show `status = 'pending'` regardless of whether MediaConvert has finished transcoding.

**Root cause**
The Lambda at `apps/backend/lambda/transcode/index.js` only creates the MediaConvert job — it does not update the DB. There is no mechanism that listens for MediaConvert job completion and writes back to the `films` table. The `published` toggle (Draft/Published) is a separate, unrelated field that controls public visibility only.

**To do**
Add an EventBridge rule that fires when a MediaConvert job reaches `COMPLETE` or `ERROR` status, triggering a second Lambda that updates `films.status` (and optionally `films.hls_manifest_url`) for the corresponding record. Match the film record via the output S3 key, which encodes the original raw filename.
