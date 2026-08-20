# HTML/CSS Fundamentals + Build Tasks — Notes

## HTML vocabulary — quick-reference (general idea first, detail after)

- **`<script>`** — plain HTML by itself is just structure/content, it can't *do* anything on its own. `<script>` is the tag that loads and runs JavaScript, which is what actually makes a page interactive (buttons that respond, live updates, etc.). Never written by hand in this app — Next.js auto-generates and injects these when it bundles `.tsx` files. Confirmed for real in DevTools → Elements: several auto-injected `<script>` tags showed up there that were never typed anywhere in the source (React hydration data, the dev-only Hot Module Reload client, the dev-only error overlay).
- **`<form>`** — container that lets a user submit input (e.g. a login). Default behavior on submit: the browser reloads the page — `event.preventDefault()` (first line of every `handleSubmit`) stops that. A `<button type="submit">` inside a `<form>` doesn't need its own `onClick` — clicking it, or pressing Enter in any field, both trigger the browser's native "submit" event, which `<form onSubmit={...}>` catches. `onSubmit` doesn't "allow" clicking vs. Enter — it's just the listener; the button's `type="submit"` + native browser behavior is what generates the event either way.
- **`<head>` / `<body>`** — invisible page setup (title, metadata) vs. everything actually visible. `layout.tsx`'s `export const metadata` fills `<head>`; everything else renders inside `<body>`.
- **Form elements**:
  - `<input>` — `type` attribute changes behavior (`email`, `password`).
  - `<label>` — `htmlFor` takes the matching input's `id`; clicking the label text moves focus into that input.
  - `<button>` — `type="submit"` triggers the form's `onSubmit`; `type="button"` does nothing on its own without an explicit `onClick` (e.g. Sign out, pager buttons).
  - `<select>` — **not used anywhere in this app.** A dropdown for picking one value from a fixed list of `<option>` children, instead of free typing:
    ```tsx
    <select>
      <option value="admin">Admin</option>
      <option value="member">Member</option>
    </select>
    ```
- **Attribute** — extra info in an opening tag (`name="value"`). Used constantly: `type`, `required`, `id`, `href`, `disabled`, `className`, etc.
- **Semantic tags** — `<main>` used (primary page content, covers this whole app's usage). `<section>` and `<footer>` — **not used anywhere.** `<section>` groups a distinct, thematically-related chunk of content (often with its own heading) — contrast with `<div>`, which carries no meaning at all. `<footer>` is the bottom area of a page/section, usually copyright/links/contact info:
  ```html
  <main>
    <section>
      <h2>Recent activity</h2>
    </section>
    <footer>© 2026 Onboarding App</footer>
  </main>
  ```

**Important distinction, confirmed with real pasted code from `users-list.tsx`:** the `return (...)` block in a component isn't actually HTML, even though it looks like it — it's JSX, still genuinely JavaScript/TypeScript. Proof: `{error && <p>...}` (a real JS expression embedded via `{}` — plain HTML can't do conditionals), `className` instead of `class` (renamed to avoid colliding with JS's own `class` keyword), and `onClick={handleLogout}` (a real function reference, not a string like HTML's `onclick="..."`). The whole `.tsx` file is JavaScript, top to bottom — JSX only *becomes* real HTML once it's rendered and sent to the browser.

## CSS, tied to real code (all via Tailwind utility classes)

- **Box model (padding/margin)** — every element is a rectangle made of layers: content → padding (space inside the border) → border → margin (space outside the border, between it and neighbors). Used throughout: `p-4` (card padding), `px-4 py-2` (table cell padding), `mt-2`, `gap-2`/`gap-4` (spacing between flex children).
- **Selectors & specificity** — Tailwind mostly sidesteps competing-rule conflicts in this app since utility classes are applied directly rather than writing separate CSS rules. The one real bug we hit (invisible table header text in dark mode) was actually **inheritance**, not specificity — a related but different mechanism: an element with no explicit `color` falls back to whatever its parent (`body`) has, rather than two competing explicit rules fighting for priority.

  Ran two live browser exercises (raw CSS, not Tailwind) to demonstrate specificity for real:
  - `p.specificity-test { blue }` vs `.specificity-test.highlight { green }` vs `#special-test { red }` on one element → **ID wins** regardless of order or how many classes compete against it.
  - `.tie-test { purple }` vs `.tie-test { orange }` (same selector, same specificity) → **the one written later wins.** This is the actual mechanical meaning of "cascading" — order is only the tiebreaker when specificity is equal, never the primary rule.
- **Flexbox** — `flex` turns a container into a row/column layout; `justify-content` spaces children along the main direction, `align-items` aligns them along the cross direction. Used throughout: `flex items-center justify-between` (header row), `flex flex-col gap-2` (stacked mobile cards).
- **Positioning (static/relative/absolute/fixed/z-index)** — **not used anywhere in this app.** `static` = default flow. `relative` = can be nudged with `top`/`left`/etc., but keeps its original space reserved. `absolute` = removed from flow, positioned against the nearest ancestor that has `relative`/`absolute`/`fixed` set. `fixed` = positioned against the viewport, ignores scrolling. `z-index` = which element wins when things overlap. Classic example — a notification badge on an avatar, where the avatar wrapper needs `position: relative` so the badge's `position: absolute` has something correct to anchor to:
  ```html
  <div style="position: relative; width: 60px; height: 60px;">
    <img src="avatar.png" />
    <span style="position: absolute; top: -4px; right: -4px;
                 background: red; border-radius: 50%; width: 16px; height: 16px;"></span>
  </div>
  ```
- **Responsive basics** — `hidden md:block` / `md:hidden` pair used to switch between the desktop table and mobile card layout at the 768px breakpoint.

## CSS syntax: `@` vs `:` (from globals.css)

`@` and `:` look similar but do completely different jobs — worth being precise about both.

**`@` — "at-rules"**, meta-instructions to the CSS engine, not styling:
- `@import "tailwindcss";` — pulls in Tailwind's entire utility-class system.
- `@theme inline { ... }` — Tailwind v4 syntax mapping custom CSS variables into Tailwind's design-token system.
- `@media (prefers-color-scheme: dark) { ... }` — a media query: everything inside only applies when a condition about the visitor's device is true. This is the exact mechanism behind the invisible-header-text bug found and fixed earlier in the session.
- Other common ones: `@font-face` (load a custom font), `@keyframes` (define an animation), `@supports` (feature-detect a CSS capability before using it).

**`:` — two unrelated meanings depending on where it appears:**
1. **Part of a selector** (a "pseudo-class") — targets a special *state or location*, not a tag/class/id. `:root` = the top of the document (practically `<html>`), which is why global CSS variables get defined there. Already used without being named: Tailwind's `hover:bg-neutral-50` and `disabled:opacity-40` generate real `:hover` / `:disabled` CSS underneath. Others: `:focus`, `:active`, `:first-child`, `:checked`.
2. **The property/value separator** inside a declaration — `background: var(--background);` — same character, nothing to do with selectors at all. Same role as `color: red;`.
- Related but distinct: **pseudo-elements** use a double colon (`::before`, `::after`, `::placeholder`) and target a generated part of an element rather than a state.

## Build task 1 — create-user form

- New page at `/users/form` (folder = URL, Next.js's routing convention).
- POST `/api/users` (same URL as the existing GET, different method — REST convention: URL identifies the resource, method identifies the action).
- Requires the *caller* to already be logged in (reuses the same bearer-token check as GET), then uses the admin client to `createUser()`.

## Build task 2 — responsive list

- Chose a full stacked-card layout for mobile over just hiding columns — more code (two parallel layouts instead of one), but a more realistic pattern and better learning value.
- Desktop: existing `<table>`, wrapped in `hidden md:block`.
- Mobile: a separate `.map()` over the same `users` data, rendered as bordered cards (`md:hidden`), each field individually labeled since there's no column header for context anymore.

## Build task 3 — pagination

- `GET /api/users?page=N` — reads `page` off the URL via `new URL(request.url).searchParams`.
- Passes `page`/`perPage` directly to Supabase's `listUsers()` — true server-side pagination, not fetch-everything-then-slice.
- **Tradeoff accepted**: dropped the alphabetical `.sort()` — sorting a single page locally wouldn't stay consistent across page boundaries once each page is fetched separately. List is now in creation order instead.
- `hasMore = users.length === PAGE_SIZE` — if a page comes back full, assume there's more; if it's short, it's definitely the last page. Avoids needing a total user count, which the admin API doesn't hand over cleanly.
- Frontend: `page`/`hasMore` state, `page` added to the `useEffect` dependency array so changing it auto-refetches, Previous/Next buttons disabled at each boundary.
