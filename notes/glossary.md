# Glossary — quick lookup

Plain-English definitions only. For real code examples, see [bearer-token-auth.md](bearer-token-auth.md) and [html-css-and-build-tasks.md](html-css-and-build-tasks.md).

## HTTP / API

- **API** — a set of doors ("endpoints") a program exposes so other programs can talk to it.
- **Endpoint** — one specific URL + method combination, e.g. `POST /api/auth/login`.
- **Header** — metadata *about* a request/response (who's asking, what format, credentials) — the label on a package.
- **Body** — the actual data being sent — the contents inside the package. Only present when something is being submitted.
- **GET** — retrieves data. No body. Must not create/change anything on the server ("safe").
- **POST** — submits data that causes the server to create or change something.
- **Query parameter** — extra info tacked onto a URL after `?`, e.g. `?page=2`. Fine for non-sensitive data (page numbers); never for passwords, since URLs get logged/cached/saved in history.
- **JWT (JSON Web Token)** — a token made of three dot-separated parts (header.payload.signature). The first two are just *encoded* (readable by anyone, not secret) — the third is *signed*, proving it wasn't tampered with. Signed ≠ encrypted.
- **Bearer token** — a credential sent in an `Authorization: Bearer <token>` header, proving who's making a request. Unlike a cookie, nothing attaches it automatically — the client has to do it explicitly on every request.

## Storage

- **`localStorage`** — browser storage that survives refresh, tab close, and browser restart. Plain-text, readable by any JS on the page (XSS risk).
- **`sessionStorage`** — same as `localStorage` but cleared when the tab closes; survives a refresh.
- **App state** (React state) — lives only in memory; wiped on every refresh. Not persisted anywhere.
- **Cookie** — small piece of data the *browser* stores and attaches automatically to matching requests.
- **`httpOnly` cookie** — a cookie JavaScript is blocked from reading at all, even on the same page. Immune to XSS theft; still vulnerable to CSRF.

## HTML

- **`<script>`** — loads and runs JavaScript. Without it, a page is just static structure with no behavior.
- **`<form>`** — container for collecting/submitting user input.
- **`<head>`** — invisible page setup (title, metadata).
- **`<body>`** — everything actually visible on the page.
- **`<input>`** — a field for user input; `type` attribute changes its behavior.
- **`<label>`** — describes what a nearby input is for; `htmlFor` links it to that input's `id`.
- **`<button>`** — `type="submit"` triggers a form's submission; `type="button"` does nothing without an explicit `onClick`.
- **`<select>`** — a dropdown for picking one value from a fixed list of `<option>`s.
- **Attribute** — extra info inside an opening tag, written `name="value"`.
- **Semantic tag** — a tag that describes the *meaning* of its content (`<main>`, `<section>`, `<footer>`), not just a generic box like `<div>`.

## CSS

- **Box model** — every element = content → padding → border → margin, from inside out.
- **Selector** — the part of a CSS rule that decides *which* elements it targets (element, class, or ID).
- **Specificity** — the tiebreaker when multiple rules target the same element: ID beats class, class beats element. Only when specificity is *tied* does the later rule in the file win.
- **Inheritance** — a *different* mechanism from specificity: an element with no explicit style for a property (like `color`) falls back to whatever its parent has.
- **Flexbox** — `display: flex` arranges children in a row/column; `justify-content` spaces along the main direction, `align-items` aligns along the cross direction.
- **Positioning** — `static` (default flow) / `relative` (nudgeable, keeps its space) / `absolute` (removed from flow, anchored to nearest positioned ancestor) / `fixed` (anchored to the viewport) / `z-index` (stacking order on overlap).
- **Responsive design** — adapting layout to screen size, usually via breakpoint prefixes (`md:`, `lg:`, etc. in Tailwind) that only apply past a certain width.
- **`@` rule (at-rule)** — a meta-instruction to the CSS engine, not a style declaration — `@import`, `@media`, `@font-face`, `@keyframes`.
- **`:` (pseudo-class)** — part of a selector targeting a special state/location (`:hover`, `:focus`, `:root`, `:disabled`) — different from the `:` used to separate a property from its value (`color: red;`).

## JavaScript / TypeScript syntax

- **Destructuring** — pulling named values out of an object/array in one line: `const { email, password } = data;`
- **Shorthand property** — `{ email }` as a shortcut for `{ email: email }`, when the variable name matches the property name you want.
- **Template literal** — backtick strings with `${...}` for embedding values, e.g. `` `Bearer ${token}` ``. Same idea as Python's f-strings.
- **Ternary** — `condition ? ifTrue : ifFalse`, a compact inline if/else.
- **`===`** — strict equality: exact match, no type conversion. Always prefer over `==` (which silently converts types).
- **`!`** — logical NOT, same as Python's `not`.
- **`async` / `await`** — marks a function as asynchronous; `await` pauses until a Promise resolves.
- **Dependency array** (`useEffect(fn, [a, b])`) — tells React to re-run the effect whenever any listed value changes.

## React / Next.js

- **Server Component** — the default in Next.js's App Router; runs once on the server, sends plain HTML. Can't use state, event handlers, or browser-only APIs.
- **Client Component** (`"use client"`) — runs in the browser too, not just the server. Required for anything interactive: `useState`, `onClick`, `localStorage`, etc.
- **JSX** — the HTML-like syntax written inside `.tsx` files. Looks like HTML but is genuinely JavaScript — proof: `{}` for embedded expressions, `className` instead of `class`, event handlers taking real function references instead of strings.
- **`page.tsx`** — a reserved filename; Next.js turns its folder path directly into a URL (file-based routing).
- **`route.ts`** — a reserved filename for a backend API endpoint, not a visible page.
