# DOG DAYS Implementation Outline

## Identity Summary

DOG DAYS is an art-brand / clothing-brand-esque online store that appears legitimate at first glance and becomes quietly wrong under attention. It should feel complete, clean, and usable while preserving a hollow conceptual center.

The brand is not horror, not a meme, not a startup landing page, and not a parody. It is a calm store-shaped object.

## Conceptual Inspiration

MSCHF is a conceptual reference only: absurd products, product drops as art objects, commerce used as performance, and serious presentation applied to impossible ideas. DOG DAYS should not copy MSCHF design or loudness. DOG DAYS should be softer, flatter, quieter, more deadpan, and more patient.

## Visual Language

- Keep the existing pastel cloud hero and DOG DAYS emblem exactly as rendered.
- Continue the black nav/footer frame.
- Use white space deliberately.
- Use restrained blue, black, white, red, and a few muted secondary colors.
- Keep product visuals local and graphic: CSS product flats, labels, codes, receipt-like details, poster-like treatments.
- Avoid glossy startup UI, gradients as decoration, nested cards, and over-designed marketing sections.

## Emotional Tone

- Official.
- Calm.
- Slightly wrong.
- Playful without announcing the joke.
- Hollow but functional.
- Absurdism through procedure, not random gags.
- Short statements that sound operational.

## Untouchable Elements

- The hero structure and visual output.
- `Cloud9Vid.mp4` as the hero background.
- `DOG-DAYS_V2.png` as the hero logo.
- Existing hero CSS values for size, position, crop, and composition.
- The gallery must use the current `never.png` image as its only image source, repeated endlessly through lightweight browser rendering.

## Forbidden Changes

- Do not redesign, crop, resize, reposition, replace, or improve the hero.
- Do not add new gallery image assets.
- Do not replace `never.png`.
- Do not create a carousel or masonry gallery.
- Do not add real payment, checkout, shipping, account, analytics, database, or backend services.
- Do not use visible world-breaking words like fake, demo, test checkout, prank, not real, simulation, placeholder, or sample store.
- Do not collect sensitive payment details or real shipping details.

## Page-by-Page Plan

### Home

Create sparse content that makes the empty space intentional:

- Current operational status.
- Short brand statement.
- Featured drop preview with a few product names.
- Quiet paths to shop and gallery.
- System-like notice copy that refuses to over-explain.

### Shop

Replace Ecwid with a static local shop:

- Product grid with 10 products.
- Local product visuals.
- Status labels.
- Prices.
- Descriptions.
- Add-to-cart buttons.
- Cart panel with quantities, removals, subtotal, and checkout link.

### Checkout

Create a separate static checkout page:

- Cart review.
- Contact-style step using harmless choices only.
- Shipping-style step using fulfillment choices, not addresses.
- Payment-style step using non-sensitive authorization choices.
- Review step.
- Roulette order table before processing.
- Processing state.
- Final DOG DAYS receipt/reveal.

### Gallery

Use only `never.png`, but repeat it as an endless field:

- Three-across desktop layout when space allows.
- Responsive fallback when necessary.
- Better alt text.
- Click-to-expand image viewer.
- Backdrop click, Close button, and Escape close behavior.
- Infinite scroll using small batches of the same cached image.
- No additional gallery image assets.

### Legal / Policy

Create:

- `privacy.html`
- `terms.html`
- `cancellation.html`

They should look structured and legitimate, then become subtly DOG DAYS through calm policy language.

### Static Structure

Create:

- `sitemap.xml`
- `robots.txt`
- `404.html`
- A restrained public notices page.
- A local receipt record page.

Optionally add small hidden artifacts only if they do not break normal static-site behavior.

## Shop Product Strategy

Use 9-12 products that feel plausible but conceptually hollow:

- Clothing: hoodie, tee, long sleeve, cap.
- Printed matter: poster, zine, sticker sheet.
- Accessories/objects: tote, key tag, pin set.

Each item gets:

- Name.
- Price.
- Short description.
- Status.
- Local image treatment.
- Add-to-cart behavior.

The language should sound like a real store catalog while being slightly too procedural or empty.

## Fake Cart Plan

The cart is real locally:

- Store product IDs and quantities in `localStorage`.
- Render cart from local product catalog.
- Allow add, remove, increment, decrement.
- Calculate subtotal in JavaScript.
- Persist across refresh.
- Never send data anywhere.
- Never require login.

The cart copy should be normal, with restrained DOG DAYS language.

## Checkout Plan

The checkout should feel credible until the end:

1. Review cart.
2. Choose notice preference.
3. Choose fulfillment method.
4. Choose non-sensitive authorization method.
5. Review.
6. Try to place order.
7. Choose red or black on the order table.
8. If the wheel returns the chosen color, continue to processing.
9. If the wheel misses, show the failed order state and leave the cart intact.
10. Final official impossible receipt.

No card numbers, addresses, real email collection, account creation, or backend calls.

## Final Checkout Reveal Concept

Final state:

```text
ORDER RECEIVED
FULFILLMENT STATUS: WEATHER ACCEPTED

Your request entered DOG DAYS at [timestamp].
The items were reserved in the order they were noticed.
Fulfillment and cancellation have been filed together.
No further action is required. Further action is unavailable.

The store has accepted the transaction.
The transaction has declined to leave.
```

The cart clears. A local receipt artifact is saved in browser storage. The user can print the receipt or return to the shop.

## Legal / Policy Page Plan

Privacy:

- Explain static browser-side behavior calmly.
- Say DOG DAYS does not operate accounts, tracking profiles, or payment handling.
- Keep language formal and slightly wrong.

Terms:

- Define use of site, product availability, local cart, order language, and weather holds.
- Avoid legal heaviness that makes the site feel too real or threatening.

Cancellation:

- Make it the most DOG DAYS policy.
- Treat cancellation, fulfillment, weather, and order status as a quiet loop.
- Keep it structured and plausible.

## Sitemap / Robots Plan

`sitemap.xml` includes:

- Home.
- Shop.
- Checkout.
- Gallery.
- Privacy.
- Terms.
- Cancellation.
- 404 only if appropriate for public discovery.

`robots.txt`:

- Allow all.
- Reference sitemap.

## Easter Egg Plan

Add hidden artifacts that do not disrupt usability:

- A tiny HTML/source comment on a low-traffic page.
- A restrained console message.
- A localStorage receipt/status artifact after checkout.
- An unlinked static artifact file with DOG DAYS language.

No jumpscares, audio, flashing, popups, fake security language, or obvious hidden buttons.

## Optimization Plan

- Remove Ecwid.
- Remove inline store scripts.
- Move gallery/shop/checkout behavior into one small local JavaScript file.
- Remove external Google Fonts if local system fonts can preserve the visual tone.
- Remove `.DS_Store` from the public repo.
- Keep `dd34.psd` documented or move it out of public deploy later if desired.
- Add image dimensions and lazy loading where safe.
- Preserve hero CSS exactly.
- Clean invalid HTML.
- Improve titles and metadata.

## Responsive Plan

- Preserve hero behavior.
- Use controlled content widths.
- Product grid: responsive columns.
- Cart panel: side panel on wide screens, full-width block on small screens.
- Checkout steps: single column on mobile.
- Gallery: infinite repeated field of the same current image, three-across where usable, graceful single-column fallback on small screens.
- Ensure buttons and text do not overflow.

## Accessibility Plan

- Add skip link.
- Add meaningful page titles.
- Add `aria-current` on nav.
- Add focus-visible styles.
- Use buttons for interactive controls.
- Make cart updates understandable through visible state.
- Make gallery dialog close with Escape, backdrop click, and proper buttons.
- Avoid color-only status communication.
- Add meaningful alt text for the gallery images.

## Exact Implementation Sequence

1. Add `audit.md`.
2. Add `outline.md`.
3. Add `agents.md`.
4. Remove Ecwid markup and scripts from `shop.html`.
5. Preserve hero markup and hero CSS values.
6. Replace empty home main with sparse DOG DAYS content.
7. Rebuild shop with local product grid and cart shell.
8. Add `checkout.html`.
9. Add local `site.js` for cart, checkout, gallery dialog, and hidden artifacts.
10. Rework `styles.css` while preserving hero visual values.
11. Update gallery markup while using only `never.png` as the repeated source image.
12. Add legal pages.
13. Add footer policy links.
14. Add `sitemap.xml`, `robots.txt`, `404.html`, and hidden artifact file.
15. Remove `.DS_Store`.
16. QA links, storage, no network commerce, responsiveness, and accessibility basics.

## QA Checklist

- Hero appears visually unchanged.
- Header/video/logo files are untouched.
- Nav still reads HOME, SHOP, GALLERY.
- Footer remains a black DOG DAYS bar.
- Gallery repeats only `never.png` and loads more as the user scrolls.
- No Ecwid, Stripe, Shopify, PayPal, Square, or external checkout code remains.
- Cart persists via browser storage only.
- Checkout never asks for card numbers, addresses, email, passwords, or account details.
- Checkout final reveal works.
- Cart clears after final order state.
- Policy pages are linked.
- Sitemap is valid XML.
- Robots allows all.
- Internal links resolve.
- No visible forbidden world-breaking words appear on public pages.
- Site remains static and lightweight.
