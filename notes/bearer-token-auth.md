# Bearer Token Auth — Notes

## Headers vs. Body

- **Header** = metadata *about* the request (the label on a package) — who's asking, what format, credentials.
- **Body** = the actual data being submitted (the contents inside) — only present when something is being submitted.

## POST — used to submit data that changes state

- Contains **both** a header and a body.
- The body carries the data being submitted — here, `{ email, password }`.
- Semantically: POST is for requests that cause the server to **create or change something**.

**In this app:** the frontend POSTs `email`/`password` to `/api/auth/login`. The backend validates them via Supabase, and on success **creates a new session** — something that didn't exist before this request. It responds with the resulting `access_token` / `refresh_token`, which the frontend then stores in `localStorage`.

## GET — used to retrieve data without changing anything

- Contains a header, but **no body** — nothing is being submitted, only requested.
- Semantically: GET is "safe" — it must not create, modify, or delete anything server-side, no matter how many times it's called.

**In this app:** the frontend GETs `/api/users`, attaching the stored token as an `Authorization: Bearer <token>` header (not a body, since nothing is being submitted). The backend validates that token and, if valid, returns the list of users — data that **already existed** in the database beforehand. The request itself creates nothing new; it only reads and confirms access.

## The core distinction (general rule, not just this app)

It's not about whether a response contains data (both POST and GET responses do). It's about **whether the request causes the server to create/change something**:

- POST → causes a change (new session created)
- GET → causes no change (existing data read back)

## Token storage — pros & cons

All storage/reading/deleting of `localStorage` and app state happens **only in frontend code** — the backend has no access to either. It only ever sees the token when the frontend hands it over in a header. The `httpOnly` cookie is the one case the backend *does* handle directly (via `@supabase/ssr`'s `setAll`/`getAll`), just automatically rather than by hand — only its automatic *attachment* to requests is purely a browser behavior.

| Option | Pro | Con |
|---|---|---|
| **localStorage** *(chosen)* | Survives refresh, tab close, and browser restart. Only cleared by explicit `removeItem` (sign-out) | Plain, script-readable — any JS on the page (including an XSS payload) can read it with one line, and it persists until explicitly cleared |
| App state (React Context) | Nothing written to disk — no standing copy once the tab closes; not a predictable one-line target the way `localStorage` is | Wiped on every refresh (logs the user out) unless paired with a refresh-token flow. Not immune to a script running *while* the token is in memory — just a shorter, less convenient target |
| `httpOnly` cookie *(original)* | Genuinely invisible to JavaScript — even an XSS payload can't read it, not just "hard to find" | Vulnerable to CSRF instead (mitigated with `SameSite`); doesn't work for non-browser clients (mobile apps, third-party API consumers) |

### Other storage options

- **`sessionStorage`** — same API/risk profile as `localStorage`, but scoped to one tab and cleared when it closes. Middle ground between `localStorage` and app state: survives refresh, doesn't survive closing the tab.
- **IndexedDB** — a more powerful structured browser database; same script-readability/XSS exposure as `localStorage`. Used for storing larger/offline data, not really a security upgrade for tokens specifically.
- **Web Worker / Service Worker isolation** — token lives in a separate JS execution context the main page can't directly read; the worker attaches it to outgoing requests itself. Raises the bar against XSS theft significantly, but meaningfully more complex to build.
- **Server-side sessions** — the browser only holds a random opaque ID (in a cookie); the real token/session data lives in a database on the server. Even if the ID leaks it's useless without server-side data, and it can be instantly revoked (unlike a JWT, which stays valid until it expires). The traditional approach, still very common.

### When to use which (practical guide)

- **`localStorage`** — browser-only app, security isn't top priority, want simple persistence across sessions. Most common real-world default for smaller apps/dashboards/internal tools.
- **App state** — higher-stakes apps (banking, admin panels), but in practice always paired with an `httpOnly` refresh-token cookie underneath, since in-memory-only alone means logging out on every refresh.
- **`httpOnly` cookie holding the whole session** — best default when there's genuinely only one client (a browser talking to your own backend, no separate mobile app or third parties). Strong XSS protection, least code.
- **Bearer tokens (what this app now uses) become necessary** once that "only one client" assumption breaks — a mobile app, third-party integrations, or multiple separate domains all needing to call the same backend, where a browser-only cookie can't reach.
