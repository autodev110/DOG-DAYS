# DOG DAYS

Static DOG DAYS brand/store site.

The site is plain HTML, CSS, and lightweight JavaScript. The shop and checkout are browser-local only: cart state is stored in `localStorage`, checkout progress stays on the page, and no payment provider, backend, analytics, account system, or database is used.

## Local Editing Layer

Open any page with `?edit=1` to enable the temporary DOG DAYS text editor, or press `Ctrl+Shift+E` / `Cmd+Shift+E` on any page to toggle it. Click visible text to edit it in place. Drafts autosave to this browser under `dogdays:editorDrafts`; the toolbar can copy or download the edit export before changes are applied back to source files.

Disable it with the toolbar Exit button, the same keyboard shortcut, or by visiting a page with `?edit=0`. To remove the editor entirely, delete the `editor.css` / `editor.js` references from the HTML files and remove those two files.

## Session Balance

Each browser session starts with a local DOG DAYS balance of `$25.00`, stored in `sessionStorage`. Slot machines and checkout use the same balance. The cart is still local-only and no payment data is collected.

The gallery includes three local slot machines before the repeating archive field. They use browser randomness, weighted symbols, local session balance, and no network requests.

Project context and implementation constraints live in:

- `audit.md`
- `outline.md`
- `agents.md`
- `product-image-prompts.md`
