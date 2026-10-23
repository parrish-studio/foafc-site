# Prototype structure — what each page actually contains

Captured 2026-10-22 by loading https://foafc-prototype.my.canva.site/ in the
agent browser at 1280px wide and walking every page.

**Why this file exists.** The prototype's embedded JSON is a content dictionary
only — `key → {text, font, colour, size}`. It has no geometry, no section order
and no page grouping, so reading it tells you what the words are and nothing
about how the page is built. Everything below came from looking at the rendered
site. Re-derive it only if the prototype changes.

**How to look again:** the agent browser *can* load the prototype. An early
refusal in this project was a site-permission prompt, not a block. The page
body is a cross-origin iframe, so `getComputedStyle` and the accessibility tree
do not reach the content — screenshots do.

Remember: **design is canonical, copy is not** (`CLAUDE.md`). Several pages
below are visibly placeholder.

**There is no mobile reference.** The prototype renders blank at 375px and at
768px — it is a fixed-canvas Canva mock, not a responsive site. So it cannot
answer how anything should behave on a phone, and the responsive design is
ours to make. Build mobile-first from the structure below; do not wait for a
prototype that will never show it.

Where the desktop arrangement is two or more columns, the honest mobile
equivalent is a single column in the same reading order, since that order is
already meaningful (welcome before weather, trails before etiquette).

---

## Global

**Header.** Badge, then name and location stacked beside it. Nav: Home · Trails
· About · Blog · Events · **Admin**, then a gold Donate pill. The active page's
nav link is gold with a short underline beneath it.

**Footer.** Full-bleed dark green, three columns:
1. Org name (serif), contact/location line, `501(c)(3) nonprofit · General information`
2. **Trail notes by email** — label, text input, gold **Join** button
3. **Follow along** — three icons (Instagram, Facebook, mail)

**Body background.** Cream with a **subtle dot texture**, not flat.

**Eyebrows.** UPPERCASE and letter-spaced everywhere. The stored strings are
sentence case; the design uppercases them in CSS. Gold on dark, brown on light.

**Buttons.** Gold filled = primary. Outlined = secondary. Dark green filled
appears on Events (RSVP).

---

## Home

1. **Hero** — full-bleed photo (the pulk sled picture), green overlay, content
   left-aligned: eyebrow, serif h1, copy, then **Donate (gold) first, then
   Explore Trail Maps (outlined)**.
2. **Trail status strip** — full-bleed sage band, check icon,
   "All trails open — 6 miles groomed". Spans the viewport, not the container.
3. **Two columns** — left: eyebrow `GOOD TO KNOW`, "Come find your fierce." and
   its paragraph. Right: the **weather card** (`FOAFC WEATHER`, Elliottsville ME,
   conditions, large temperature, `Forecast · date`, three rounded pills for
   precipitation / humidity / wind, then a five-hour strip with icons).
4. **Three cards** — Trail Maps · Latest Post · Upcoming Event. Each an icon, a
   title and one line. These are navigational teasers into the other pages.
5. **Donate band** — full-bleed dark green, **centre-aligned**: eyebrow
   `KEEP THE PATH CLEAR`, "Every mile is a community effort.", copy, gold
   "Support the trails".
6. Footer.

---

## Trails

1. Eyebrow `FIND YOUR WAY`, h1 "Trail Maps", intro line.
2. Two buttons: **Open Google Maps · website link** (gold) and **View winter
   trail map** (outlined).
3. **Map card** — titled "FOAFC trailhead and parking" with the note "Mock map
   preview · Use the controls to explore" and a **Center map** button. Inside,
   an overlay card: org name, "Cross Country Ski Trails · Monson, Maine", a
   **Directions** button and a **View larger map** link.
4. **Trail grid, four across.** Each card: a difficulty marker, the name, a
   one-line description, then two pills — distance (`0.66 mi / 1.06 km`) and
   difficulty word.
   - Markers are **coloured**: green circle = Easy, blue square = More
     difficult, black diamond = Most difficult.
   - **Every trail has a description.** These are not in `trails.json`.
5. **Two columns** — left: "Trail etiquette & safety" with a **Safety**
   sub-heading. Right: two stacked cards.

### Content on this page that is missing from our data

**Trail information**
- Location: Monson, Maine
- Access: Off Elliottsville Rd near Mathews Rd
- Funded by: Northern Forest Center and Maine Community Foundation

**Trail details**
- No-skate-ski: Craig's Trail Loop, Arthur's Loop, Craig's Orchard Loop, Snake Trail
- Difficulty key: Green circle = Easy · Blue square = More difficult · Black diamond = Most difficult
- Landmarks: Otter Slide Bridge, Eagle Pass Bridge, Moose Meadow Bridge, Trail Head parking area off Elliottsville Rd, Outhouse, Horse Crossing

**Per-trail descriptions** (one line each), e.g. "Quick warm-up loop through the
forest", "Namesake loop through mixed forest", "Gentle rolling loop, great for
beginners", "Longest loop, deep into quiet woods", "One-way loop. The toughest
run."

---

## About

1. Eyebrow `OUR STORY`, h1 "Built for the long way around."
2. **Two cards side by side** — "Our mission" on sage, "Our vision" on cream.
3. **Meet the board** — four cards, each a portrait placeholder, a name, and
   `Role · Friends of a Fierce Chase`.
   - **The names are fictional** (Avery Brooks, Morgan Hale, Riley Stone, Casey
     North). The real roster we already use is better; keep it.
4. **Two columns** — left: **Trail history**, a vertical timeline of
   `YEAR · entry` with a marker and a paragraph each. Right: **Projects &
   Impact**, four tiles in a 2×2 grid (Trail grooming, Bridges & boardwalks,
   Signs & wayfinding, Habitat & volunteer tools).
   - Timeline entries are literally "2012 · Placeholder" etc. Structure is real,
     content is not.
5. Footer.

---

## Blog

1. Eyebrow `FROM THE TRAILS`, h1 "News, Posts and Events".
2. **Featured post** — wide card, large image on the left, right side carries
   date, title, blurb and a **Read post** button.
3. Heading "More from Fierce Chase".
4. **Two columns** — left: a stack of post cards (date, title, blurb, Read
   post). Right: a **"Stay in the loop"** card on a dark slate-blue ground, with
   an email field and a gold "Join the mailing list" button.
5. Footer.

---

## Events

1. Eyebrow `GATHER OUTSIDE`, h1 "Events".
2. **Calendar card** — `‹ April 2026 · prototype ›` with a month grid; days
   with events are filled sage.
3. Heading "Upcoming events".
4. **Two-column grid of event cards** — icon, title, `date · type` in gold,
   location, one line, then a **RSVP** button in filled dark green.
5. Footer.

---

## Deltas against what is built

Updated 2026-10-23.

### Done

- Eyebrows uppercase and letter-spaced.
- Hero buttons in the prototype's order, Donate first.
- Full-bleed sage status strip under the hero.
- Welcome text and weather card side by side.
- Row of three teaser cards.
- Full-bleed centred donate band.
- Dot texture on the cream background.
- Trails as cards, not a table, with per-trail descriptions and coloured
  Nordic difficulty markers.
- Trail information and Trail details cards: access, funders, classic-only
  list, difficulty key, landmarks.
- Safety as a list rather than a paragraph.
- Footer in columns.
- Mission and vision as a side-by-side pair on About.
- The About board, trail history timeline and Projects & Impact tiles, with
  our own placeholder content rather than the prototype's.
- The trailhead map card on Trails — Google's keyless embed, with Directions
  and View larger map. No "Center map" button: that was a mock control in a
  static prototype, and the real embed has its own.
- The blog featured post and the two-column list. The aside in that second
  column points at Events and Facebook rather than carrying the prototype's
  mailing-list signup, which has nowhere to send an address yet.
- A 404 page, which the prototype has no equivalent of and which the site
  needs more than most: years of Facebook posts link to Wix URLs.
- Everything mobile-first. Verified at 375px on every page: no horizontal
  overflow anywhere.

### Still outstanding

Structure we have not built:

- **Events**: the month calendar and the event-card grid. Both wait on the
  Facebook sync — there is nothing to put in them, and a calendar with no
  events in it is worse than an honest empty state.
- **Footer**: the "Trail notes by email" column, and the blog aside's
  equivalent. Needs a mailing list provider and a public contact address,
  both board questions. An input that discards what someone types is worse
  than no input.
- **Home**: the trail-status strip is real but its text is fixed. Live status
  needs a source; `docs/plans/trail-status.md` has the thinking.

Content that is still placeholder and needs the board:

- **About**: the trail history years and entries, the Projects & Impact copy,
  and every board member's bio and photograph. The prototype is no help —
  its timeline entries are literally "2012 · Placeholder" and its board names
  are fictional. The structure is built and waiting on words.

Deliberately not matched:

- The prototype's difficulty ratings for Fierce Fisher, Wolf Chase and Bobcat
  Blaze, which it marks Easy where the trail system source document says more
  difficult. Trail data is not the prototype's to define.
- Its "All trails open — 6 miles groomed" banner text, which is live data with
  no source yet.
- Its lowercase "a" in the organisation's name.
- The Admin link in the nav; ours lives at /keystatic and stays out of public
  navigation.
