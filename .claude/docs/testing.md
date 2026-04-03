# Testing

## Philosophy

Tests are split into two categories that serve different purposes:

**Unit tests** (`tests/unit/`) test a single function or module in complete isolation. All external dependencies (database, AWS, other modules) are mocked. They run in milliseconds and are the first line of defence — they catch logic errors in individual pieces of code without needing any infrastructure.

**Integration tests** (`tests/integration/`) test a full HTTP route from request to response using Supertest. External services (AWS S3, CloudFront, PostgreSQL) are mocked, but the full Express middleware stack runs — routing, auth middleware, request parsing, and the route handler all execute for real. These catch wiring errors: wrong status codes, missing auth on a route, incorrect response shape.

The guiding principle: **unit tests catch broken logic, integration tests catch broken connections.**

## Tech Stack

| Tool | Purpose |
|---|---|
| [Jest](https://jestjs.io/) | Test runner, assertions, mocking |
| [Supertest](https://github.com/ladjs/supertest) | HTTP request simulation for Express |

## Folder Structure

```
apps/backend/
  jest.config.js                          — Jest configuration
  tests/
    setup.js                              — Env vars injected before every test file
    helpers/
      auth.js                             — Generates valid admin JWT headers for tests
    unit/
      middleware/
        auth.test.js                      — requireAuth middleware logic
      lib/
        cloudfront.test.js                — signUrl CloudFront signing helper
    integration/
      routes/
        auth.test.js                      — POST /api/admin/login
        films.test.js                     — GET /api/films, GET /api/films/:id
        admin.test.js                     — POST /api/admin/upload-url, POST /api/admin/films
```

## How to Run

Run from `apps/backend/` or the monorepo root:

```bash
# Run all tests
npm test --workspace=backend

# Unit tests only
npm run test:unit --workspace=backend

# Integration tests only
npm run test:integration --workspace=backend

# Watch mode — re-runs on file save (useful during development)
npm run test:watch --workspace=backend

# Coverage report
npm run test:coverage --workspace=backend
```

## What Each Test File Covers

### `tests/setup.js`
Runs before every test file. Sets all `process.env` variables the app needs so tests never read from `.env`. Also computes a real bcrypt hash of `'testpassword'` at low cost (factor 4) so auth tests run fast. Any new env var used by the app should be added here.

### `tests/helpers/auth.js`
Exports `authHeader()` — generates a signed JWT and returns the full `Authorization: Bearer <token>` string. Import this in any integration test that hits a protected admin route.

### `tests/unit/middleware/auth.test.js`
Tests `requireAuth` directly by calling it as a function with mock `req`/`res`/`next` objects. Covers:
- Missing Authorization header
- Non-Bearer format
- Invalid token string
- Expired token
- Token signed with wrong secret
- Valid token — calls `next()` and sets `req.admin`

### `tests/unit/lib/cloudfront.test.js`
Tests `signUrl` with `@aws-sdk/cloudfront-signer` mocked. Covers:
- Correct URL and key pair ID passed to the signer
- Expiry is set ~2 hours in the future
- Returns the signed URL from the signer

### `tests/integration/routes/auth.test.js`
Full HTTP test of the login endpoint. `db/client` is not needed here — bcrypt and JWT work with env vars alone. Covers:
- Correct password returns 200 + token
- Wrong password returns 401
- Missing password returns 400

### `tests/integration/routes/films.test.js`
`db/films` and `lib/cloudfront` are both mocked. Covers:
- Film listing returns array of metadata
- Film listing does NOT include `hls_manifest_url`
- Single film returns metadata + signed `hls_url`
- Single film does NOT expose raw `hls_manifest_url`
- Unpublished / missing film returns 404

### `tests/integration/routes/admin.test.js`
`@aws-sdk/s3-request-presigner`, `lib/s3`, and `db/client` are mocked. Covers:
- Upload URL endpoint blocks unauthenticated requests (401)
- Upload URL endpoint returns presigned S3 URL with valid token
- Upload URL endpoint validates required fields (400)
- Film creation blocks unauthenticated requests (401)
- Film creation inserts record and returns 201
- Film creation validates required fields (400)

## Adding New Tests

**New unit test:** Create `tests/unit/<src-path>/<module>.test.js` mirroring the location of the file under `src/`. Mock any imports that reach outside the module being tested.

**New integration test:** Add cases to the relevant file in `tests/integration/routes/`, or create a new file if adding a new route file. Always mock AWS SDKs and `db/client` (or `db/<query-file>`). Import `authHeader()` from `tests/helpers/auth.js` for any request to a protected route.

**New env var:** Add it to `tests/setup.js` with a safe test value. Never use real credentials in tests.

## What's Not Tested Here (Yet)

- **Database queries** (`src/db/films.js`) — these are mocked in integration tests. As the project matures, a dedicated test database with seeded data would allow these to be tested against real SQL.
- **Lambda function** (`lambda/transcode/`) — the MediaConvert trigger runs in AWS Lambda and is tested via the upload pipeline manually.
- **Frontend** — no frontend tests exist yet. When Next.js is set up, React Testing Library + Jest is the standard choice.
