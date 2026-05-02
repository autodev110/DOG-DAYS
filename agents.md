# DOG DAYS Agent Guide

This file is for AI/MCP agents working on this exact repo.

## What DOG DAYS Is

DOG DAYS is a static art-brand / clothing-brand-esque website. It should behave like a real online store while remaining conceptually hollow. The experience should feel official, calm, lightly uncanny, and deadpan.

Visitors should first think the site is a legitimate brand store. If they read carefully, use the cart, reach checkout, or inspect hidden details, they should feel that something is wrong in a quiet, intentional way.

## What DOG DAYS Is Not

- Not a startup landing page.
- Not a normal redesign.
- Not a horror site.
- Not a joke site.
- Not a meme shop.
- Not a real checkout.
- Not a data-collecting commerce system.
- Not an MSCHF clone.

## Preserve The Visual Identity

The existing hero is the primary identity:

- Pastel cloudy sky video background.
- Large blue DOG DAYS logo.
- Light-blue howling dog/wolf silhouette.
- Thick black outline/shadow.
- Dreamy, innocent, bootleg, slightly ominous mascot-brand feel.

The black nav and footer should continue to frame the site simply.

## The Header / Hero Is Forbidden To Alter

Do not change the hero visual output.

Do not:

- Replace `Cloud9Vid.mp4`.
- Replace `DOG-DAYS_V2.png`.
- Crop the video differently.
- Move the logo.
- Resize the logo.
- Change `#hero-section` height.
- Change hero stacking, scale, or composition.
- Redesign or improve the hero.

If code around the hero must be touched for a technical reason, verify that the rendered result remains visually identical.

## Gallery Rule

The gallery must use only the current `never.png` image asset, but it may repeat that image endlessly. The intended effect is a legitimate gallery page that becomes impossible by continuing too long.

Do not:

- Add new gallery image assets.
- Replace `never.png`.
- Turn it into a portfolio.
- Add unrelated gallery content.

Use lightweight browser behavior: append small batches of the same cached image and avoid loading or saving many files.

## Use `audit.md`

Read `audit.md` before implementation. It records the pre-update state, including:

- Current files.
- Existing Ecwid store integration.
- Current hero implementation.
- Current gallery implementation.
- Missing pages and structure.
- Accessibility and performance issues.
- What must not be changed.

## Use `outline.md`

Read `outline.md` as the implementation contract. It defines:

- DOG DAYS identity.
- Page-by-page plan.
- Shop/cart/checkout behavior.
- Final checkout reveal.
- Policy pages.
- Easter eggs.
- QA checklist.

If an implementation choice is unclear, prefer the option that best follows `outline.md` while preserving the hero and the single-source gallery constraint.

## Implementation Guidance

- Keep the site static: HTML, CSS, lightweight JavaScript.
- Use local browser state only for cart/receipt behavior.
- Do not add backend services, databases, analytics, account systems, cookies, or real payment providers.
- Remove any commerce plugin or external checkout code.
- Keep dependencies minimal.
- Use local assets and CSS-based product image treatments.
- Keep copy short, official, and strange through context.

## Avoid Generic Design

Do not make DOG DAYS look like:

- A SaaS homepage.
- A modern startup landing page.
- A polished Shopify template.
- A generic streetwear store.
- A loud prank site.
- A lore-heavy art project.

Use negative space, flat structure, black bars, official labels, small operational notices, and product/catalog language that feels plausible but hollow.

## Preserve The Fake-Real Store Feeling

The shop should actually work locally:

- Product grid.
- Add to cart.
- Quantity changes.
- Removals.
- Subtotal.
- Checkout button.
- Checkout flow.
- Roulette order table before processing.
- Final receipt state.

But it must never become real commerce. Do not ask for card numbers, addresses, passwords, real account details, or payment credentials.

## DOG DAYS Voice

Prefer:

- “Current status”
- “Weather hold”
- “Accepted”
- “Reserved”
- “Filed”
- “No further action”
- “Unavailable”
- “Order”
- “Notice”
- “Fulfillment”
- “Archive”

Avoid:

- Memes.
- Internet slang.
- Obvious jokes.
- Horror cliches.
- Shock language.
- Over-explained lore.
- Startup marketing language.
- Visible words that break the world, such as fake, demo, prank, simulation, placeholder, or sample store.

## Checkout Reveal

The checkout ending is one of the most important parts of the site.

It should feel official and impossible:

- The last checkout button should read “Try to place order.”
- Before processing, show the local roulette order table.
- Red/black choice succeeds only if the seeded local wheel result matches the chosen color.
- A miss shows the failed order state and leaves the cart intact.
- Generate a local order number.
- Show timestamp.
- Show purchased items.
- Use a calm strange status.
- Treat purchase, weather, cancellation, and fulfillment as if they belong to the same process.
- Save a harmless local receipt artifact.

Do not explain that the store is hollow. Preserve the world.

## Easter Eggs

Easter eggs should be artifacts, not jokes.

Allowed:

- Hidden source comments.
- Tiny metadata.
- Local storage artifacts.
- Unlinked static files.
- Restrained console messages.
- Rare copy variations.

Forbidden:

- Jumpscares.
- Audio.
- Flashing.
- Fake malware or security warnings.
- Offensive content.
- Obvious hidden buttons.
- Disruptive popups.

## Testing Before Completion

Check:

- Hero visual output remains unchanged.
- Gallery uses only `never.png` and repeats it through lightweight infinite scroll.
- Shop has 9-12 products.
- Cart works and persists through refresh.
- Quantity changes and removals work.
- Checkout works without network calls.
- Final receipt/reveal appears.
- No real payment/shipping/account data is requested.
- Policy pages are linked.
- Sitemap and robots exist.
- Internal links resolve.
- No external commerce scripts remain.
- Public pages avoid visible world-breaking language.
- Layout works on desktop and mobile widths.
- Keyboard focus is visible.
