# NODE Website — New Sections, IA, and Build Plan
*Combined from two planning docs, saved 2026-09-12. Repo: github.com/franferlopes/node-collective (Node.js/Express/EJS + Neon Postgres, deployed on Render, custom domain nodeengineering.club).*

## Part 1 — Feature / Information Architecture Plan

Proposed site structure:
1. Home — hero, one-line mission, a rotating "right now" banner (NJORD 2026 countdown, latest mission update, or the funding ask)
2. Explore ASKET — interactive 3D hardware + software explorer (new, biggest build)
3. Missions — press releases / news on missions and scopes (NJORD 2026, Namibia + Kelp Forest Foundation, Flying Labs conversations once public)
4. Team — sub-team profiles (Software, Hardware, Fabrication/Design, Strategy, Comms) + a "join us" recruitment call
5. Follow Us — embedded Instagram + LinkedIn feed, click-through to the real platforms
6. Support NODE — the funding/resource ask, kept simple and specific to what's needed right now
7. Partners — existing logo wall + a press kit (logos, photos, one-pager) for sponsors/press
8. Contact — as it exists today

### 1. Explore ASKET — interactive 3D viewer
- Engine: Three.js (via react-three-fiber if the frontend moves toward React, or vanilla Three.js if staying EJS-based) — gives full control over toggling parts, exploded views, and click-to-inspect.
- Model pipeline: export the CAD assembly (hull, battery pack, Jetson, BMS, distribution boards, sensors) to glTF/GLB with each component as a separate named node, Draco-compressed.
- Hardware layer: click-to-inspect via raycasting — click a part, get a label + short description panel. An "exploded view" toggle (animate parts apart along an axis).
- Software layer: a pre-built animated overlay on the same 3D model — LiDAR field-of-view cones, camera frustum, a simplified schematic of the pipeline (sensors → EKF → Nav2 → motor control) animating over the hull. Not live telemetry.
- Hosting: serve model files from a CDN (Cloudflare) rather than through the Node backend directly.
- Effort: biggest single build in the plan — treat as its own workstream, ideally owned by someone on the software team.

### 2. Missions / press releases
Combine into one news-style section: NJORD 2026 prep, the Namibia/Kelp Forest Foundation deployment, and (once public) any Flying Labs collaboration outcomes. Highest-value content gap — most compelling material NODE has, currently invisible on the site. A newsletter signup fits naturally as a CTA at the bottom.

### 3. Social feed integration
- Instagram: feasible via Instagram Graph API (business/creator account) or a third-party embed widget (Elfsight, SnapWidget, Behold.so) — widget route is usually less setup.
- LinkedIn: harder — no easy public API for a company page's own feed. Practical route is a third-party embed service (Taggbox, EmbedSocial, Tagembed, SociableKit), or skip a live embed and link out instead.
- Both feeds should click through to the original post on click.

### 4. Support NODE + Team/recruitment
Keep the funding ask narrow and concrete: help building a new ASV to run more missions, what it unlocks, and a simple low-friction response mechanism (form, email, or payment link — TBD). Keep visually distinct from the "join us" recruitment call in Team, since one asks for money/resources and the other for people.

### Suggested phasing
1. Missions/news section + Support NODE ask — highest value, lowest build effort.
2. Team profiles + join-us recruitment — low effort, direct payoff.
3. Social feed embeds — low-to-medium effort depending on widget route.
4. Explore ASKET 3D viewer — highest effort, biggest differentiator; parallel workstream, doesn't block launch.

## Part 2 — Build Plan for Claude Code

### Prerequisites — gather before starting

**Access**
- Local clone of the repo with git configured (done — this file lives in it), Node.js/npm installed.
- The `.env` values the app already uses in production (Neon Postgres connection string, any existing Render env vars) — needed to run the app locally.
- Render dashboard access, for the custom-domain and env-var steps (manual, not code).

**Content and decisions someone on the team has to supply**
- 2–3 pieces of real copy for the first mission/news posts (NJORD 2026 status, Namibia/Kelp Forest Foundation deployment).
- Team member names, sub-team, short bio, and a photo for each profile.
- Decision on the "Support NODE" mechanism: contact form vs. an actual payment/donation link (Stripe, PayPal, Open Collective).
- Decision on social feed approach: paid third-party widget (recommended) vs. Instagram Graph API directly.
- 3D model files (blocks Phase 4 only): the ASKET assembly exported to glTF/GLB, parts separated and named.

### Technical decisions already made
- New content (missions/news, team members) lives in the existing Neon Postgres via new tables, rendered through new EJS views — no new CMS, no new backend framework.
- A minimal password-gated `/admin` route for creating/editing mission posts.
- 3D viewer built with Three.js, not `<model-viewer>`.
- 3D model assets served from a CDN (Cloudflare), not through the Express app.

### Phase 0 — Setup
- [ ] Confirm/copy the `.env` values needed to run the app locally.
- [ ] Put Cloudflare in front of the Render app (DNS + proxy) — done (nodeengineering.club connected).

### Phase 1 — Missions/News + Support NODE
*Highest value, lowest effort — do this first.*
- [ ] DB migration: `posts` table — `id, title, slug, body, cover_image_url, category (mission | press | update), published_at`.
- [ ] Routes: `GET /missions` (list), `GET /missions/:slug` (detail).
- [ ] Minimal `GET/POST /admin/posts` behind a simple shared password.
- [ ] EJS templates for list + detail, matching the existing site's visual style.
- [ ] Seed 2 real posts (NJORD 2026, Namibia deployment) once copy is supplied.
- [ ] Add a "Support NODE" section/page: the specific ask (help building a new ASV for more missions), with the CTA mechanism decided in Prerequisites.
- [ ] Link both from the main nav.
- **Done when:** both pages are live, linked, mobile-responsive, and match the current site's look.

### Phase 2 — Team & recruitment
- [ ] Table or static JSON for team members: `name, role, subteam, bio, photo_url, order`.
- [ ] New `/team` page: profile grid grouped by sub-team, replacing the single group photo.
- [ ] "Open roles" / join-us callout block on the same page.
- **Blocked on:** bios and photos.

### Phase 3 — Social feed embeds
- [ ] Add the chosen widget's embed script/component to a new "Follow Us" section.
- [ ] Click-through from each post to the original Instagram/LinkedIn post.
- **Blocked on:** the widget-vs-API decision.

### Phase 4 — Explore ASKET (3D hardware + software explorer)
- [ ] Add Three.js (or react-three-fiber) as a dependency; new `/explore` route with a canvas scene.
- [ ] Load the glTF/GLB model (Draco-compressed) from the CDN.
- [ ] Build a hotspot/label system: a small JSON manifest mapping mesh names to descriptions, raycasting on click.
- [ ] Build a hardware toggle / exploded-view control.
- [ ] Build a "software layer" toggle: sensor FOV cones + animated pipeline schematic overlay.
- [ ] Lazy-load this whole route.
- **Blocked on:** the exported 3D model files.

### Suggested order
Phase 0 → Phase 1 → Phase 2 → Phase 3, with Phase 4 run in parallel once model files are ready.
