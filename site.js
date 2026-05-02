(function () {
    "use strict";

    const CART_KEY = "dogdays:cart";
    const RECEIPT_KEY = "dogdays:lastReceipt";
    const WEATHER_KEY = "dogdays:weather";
    const BALANCE_KEY = "dogdays:sessionBalance";
    const BALANCE_VERSION_KEY = "dogdays:balanceVersion";
    const BALANCE_VERSION = "25-start";
    const DEFAULT_BALANCE = 25;
    const SLOT_HISTORY_KEY = "dogdays:slotHistory";
    const ROULETTE_WHEEL = [0, 32, 15, 19, 4, 21, 2, 25, 17, 34, 6, 27, 13, 36, 11, 30, 8, 23, 10, 5, 24, 16, 33, 1, 20, 14, 31, 9, 22, 18, 29, 7, 28, 12, 35, 3, 26];
    const ROULETTE_RED_NUMBERS = new Set([1, 3, 5, 7, 9, 12, 14, 16, 18, 19, 21, 23, 25, 27, 30, 32, 34, 36]);

    const products = [
        {
            id: "weather-hold-hoodie",
            code: "DD-01",
            name: "Weather Hold Hoodie",
            price: 72,
            status: "AVAILABLE",
            visual: "hoodie",
            format: "Garment",
            mark: "OPEN",
            sizes: ["S", "M", "L", "XL", "XXL"],
            description: "Heavy black fleece issued for rooms where the store is open and the weather has not agreed."
        },
        {
            id: "blue-hour-tee",
            code: "DD-02",
            name: "Blue Hour Tee",
            price: 38,
            status: "AVAILABLE",
            visual: "tee",
            format: "Garment",
            mark: "SKY",
            sizes: ["S", "M", "L", "XL", "XXL"],
            description: "A short sleeve shirt in the official blue used for looking upward without filing a report."
        },
        {
            id: "dog-days-cap",
            code: "DD-03",
            name: "Counter Cap",
            price: 34,
            status: "LIMITED",
            visual: "cap",
            format: "Headwear",
            mark: "DESK",
            description: "Low-profile cap for the front counter, back counter, and counters that face neither way."
        },
        {
            id: "never-understand-poster",
            code: "DD-04",
            name: "Never Understand Poster",
            price: 26,
            status: "ARCHIVE",
            visual: "poster",
            format: "Print",
            mark: "NEVER",
            description: "Printed notice from the gallery archive. Ships flat if the archive permits flatness."
        },
        {
            id: "weather-receipt-zine",
            code: "DD-05",
            name: "Weather Receipt Zine",
            price: 18,
            status: "PENDING",
            visual: "zine",
            format: "Printed Matter",
            mark: "FILE",
            description: "Twenty-four pages of store notices, itemized weather, and margins reserved for later use."
        },
        {
            id: "closed-store-tote",
            code: "DD-06",
            name: "Closed Store Tote",
            price: 44,
            status: "AVAILABLE",
            visual: "tote",
            format: "Carry Object",
            mark: "CARRY",
            description: "Canvas bag for carrying goods away from a store that is still deciding what away means."
        },
        {
            id: "pending-sticker-sheet",
            code: "DD-07",
            name: "Pending Sticker Sheet",
            price: 12,
            status: "AVAILABLE",
            visual: "sticker",
            format: "Labels",
            mark: "PENDING",
            description: "Nine labels for surfaces that need a status but do not need a conclusion."
        },
        {
            id: "howl-department-long-sleeve",
            code: "DD-08",
            name: "Howl Department Long Sleeve",
            price: 46,
            status: "DELAYED",
            visual: "longsleeve",
            format: "Garment",
            mark: "DEPT",
            sizes: ["S", "M", "L", "XL", "XXL"],
            description: "Department-issued cotton layer with sleeves long enough to reach the next notice."
        },
        {
            id: "unclaimed-key-tag",
            code: "DD-09",
            name: "Unclaimed Key Tag",
            price: 16,
            status: "AVAILABLE",
            visual: "tag",
            format: "Key Object",
            mark: "NO. 09",
            description: "Hard enamel tag for a key that has not been matched to a door in the current system."
        },
        {
            id: "sky-return-pin-set",
            code: "DD-10",
            name: "Sky Return Pin Set",
            price: 22,
            status: "LIMITED",
            visual: "pin",
            format: "Pin Set",
            mark: "RETURN",
            description: "Three small pins for marking the approved direction of a completed transaction."
        }
    ];

    const productMap = new Map(products.map((product) => [product.id, product]));
    const productRecords = {
        "weather-hold-hoodie": {
            material: "Cotton fleece, black exterior",
            fit: "Roomy. Measured after the room closed.",
            handling: "Wash cold. Dry while the store is thinking.",
            note: "Issued for weather staff not currently listed on staff."
        },
        "blue-hour-tee": {
            material: "Midweight cotton, official sky blue",
            fit: "Standard. Shoulders remain accountable.",
            handling: "Turn inside out before weather.",
            note: "Color may appear more certain indoors."
        },
        "dog-days-cap": {
            material: "Cotton twill with adjustable back",
            fit: "One size filed for most heads.",
            handling: "Keep brim facing the counter.",
            note: "Counter classification remains active while worn."
        },
        "never-understand-poster": {
            material: "Matte paper, archive ink",
            fit: "18 x 28 inches when measured directly.",
            handling: "Frame only if the frame understands less.",
            note: "The gallery repeats this image until the page stops asking."
        },
        "weather-receipt-zine": {
            material: "Stapled paper, black ink, margin reserve",
            fit: "Pocketable if the pocket accepts records.",
            handling: "Do not flatten the waiting sections.",
            note: "Pages are numbered by the order in which they were noticed."
        },
        "closed-store-tote": {
            material: "Canvas with printed weather mark",
            fit: "Carries ordinary objects and some unresolved ones.",
            handling: "Spot clean. Do not ask the bag where it has been.",
            note: "The opening remains open when the store is closed."
        },
        "pending-sticker-sheet": {
            material: "Gloss label stock",
            fit: "Nine positions, no final position.",
            handling: "Apply to clean surfaces with incomplete status.",
            note: "A label may become accurate after it is placed."
        },
        "howl-department-long-sleeve": {
            material: "Cotton jersey, department issue",
            fit: "Sleeves extend toward notice.",
            handling: "Wash with similar departments.",
            note: "Delayed items may still arrive at the correct silence."
        },
        "unclaimed-key-tag": {
            material: "Enamel and split ring",
            fit: "One key, or no key with confidence.",
            handling: "Attach before identifying the door.",
            note: "Unclaimed status is not a defect."
        },
        "sky-return-pin-set": {
            material: "Enamel pin set with metal backs",
            fit: "Three points of return.",
            handling: "Secure backs before looking upward.",
            note: "The approved direction may change after checkout."
        }
    };

    const coinValues = [20, 40, 100, 150];
    const slotMultipliers = [1.25, 1.5, 2, 3.5];
    const slotMachines = [
        {
            id: "weather-table",
            name: "Weather Table",
            logo: "assets/slots/weather-table/logo-weather-table.svg",
            bonusSymbol: "howl",
            bonusName: "HOWL",
            scatterSymbol: "receipt",
            pays: { pair: 0.24, twoPair: 0.42, scatter3: 0.5, scatter4: 0.9, centerPair: 0.22, three: 1.25, four: 4, five: 14, diagonal: 3, corners: 2.5 },
            bonusRound: { startSpins: 3, triggerChance: 0.05, nearMissChance: 0.38, symbolChance: 0.12, base: 8, step: 1.2, full: 100 },
            symbols: [
                { id: "cloud", label: "CLOUD", mark: "CLD", image: "assets/slots/weather-table/symbol-cloud.svg", weight: 22, tier: 1 },
                { id: "sky", label: "SKY", mark: "SKY", image: "assets/slots/weather-table/symbol-sky.svg", weight: 19, tier: 1.1 },
                { id: "rain", label: "RAIN", mark: "RAN", image: "assets/slots/weather-table/symbol-rain.svg", weight: 17, tier: 1.2 },
                { id: "window", label: "WINDOW", mark: "WIN", image: "assets/slots/weather-table/symbol-window.svg", weight: 14, tier: 1.35 },
                { id: "receipt", label: "RECEIPT", mark: "RCT", image: "assets/slots/weather-table/symbol-receipt.svg", weight: 12, tier: 1.55 },
                { id: "key", label: "KEY", mark: "KEY", image: "assets/slots/weather-table/symbol-key.svg", weight: 10, tier: 1.8 },
                { id: "howl", label: "HOWL", mark: "DOG", image: "assets/slots/weather-table/symbol-howl.svg", weight: 6, tier: 2.2 }
            ]
        },
        {
            id: "archive-window",
            name: "Archive Window",
            logo: "assets/slots/archive-window/logo-archive-window.svg",
            bonusSymbol: "never",
            bonusName: "NEVER",
            scatterSymbol: "notice",
            pays: { pair: 0.28, twoPair: 0.5, scatter3: 0.62, scatter4: 1.1, centerPair: 0.26, three: 1.5, four: 5, five: 18, diagonal: 4, corners: 3 },
            bonusRound: { startSpins: 3, triggerChance: 0.05, nearMissChance: 0.34, symbolChance: 0.105, base: 11, step: 1.55, full: 160 },
            symbols: [
                { id: "frame", label: "FRAME", mark: "FRM", image: "assets/slots/archive-window/symbol-frame.svg", weight: 21, tier: 1 },
                { id: "ocean", label: "OCEAN", mark: "SEA", image: "assets/slots/archive-window/symbol-ocean.svg", weight: 18, tier: 1.15 },
                { id: "head", label: "HEAD", mark: "HD", image: "assets/slots/archive-window/symbol-head.svg", weight: 15, tier: 1.3 },
                { id: "laptop", label: "LAPTOP", mark: "LPT", image: "assets/slots/archive-window/symbol-laptop.svg", weight: 13, tier: 1.5 },
                { id: "notice", label: "NOTICE", mark: "NTC", image: "assets/slots/archive-window/symbol-notice.svg", weight: 11, tier: 1.7 },
                { id: "redword", label: "RED WORD", mark: "RED", image: "assets/slots/archive-window/symbol-red-word.svg", weight: 9, tier: 2 },
                { id: "never", label: "NEVER", mark: "NVR", image: "assets/slots/archive-window/symbol-never.svg", weight: 5, tier: 2.6 }
            ]
        },
        {
            id: "counter-return",
            name: "Counter Return",
            logo: "assets/slots/counter-return/logo-counter-return.svg",
            bonusSymbol: "return",
            bonusName: "RETURN",
            scatterSymbol: "chip",
            pays: { pair: 0.32, twoPair: 0.62, scatter3: 0.8, scatter4: 1.4, centerPair: 0.3, three: 1.75, four: 6.5, five: 26, diagonal: 5.5, corners: 4 },
            bonusRound: { startSpins: 3, triggerChance: 0.05, nearMissChance: 0.3, symbolChance: 0.09, base: 16, step: 2.1, full: 250 },
            symbols: [
                { id: "counter", label: "COUNTER", mark: "CTR", image: "assets/slots/counter-return/symbol-counter.svg", weight: 24, tier: 1 },
                { id: "file", label: "FILE", mark: "FIL", image: "assets/slots/counter-return/symbol-file.svg", weight: 18, tier: 1.15 },
                { id: "tag", label: "TAG", mark: "TAG", image: "assets/slots/counter-return/symbol-tag.svg", weight: 14, tier: 1.35 },
                { id: "pin", label: "PIN", mark: "PIN", image: "assets/slots/counter-return/symbol-pin.svg", weight: 11, tier: 1.65 },
                { id: "door", label: "DOOR", mark: "DOR", image: "assets/slots/counter-return/symbol-door.svg", weight: 9, tier: 1.95 },
                { id: "chip", label: "CHIP", mark: "CHP", image: "assets/slots/counter-return/symbol-chip.svg", weight: 7, tier: 2.35 },
                { id: "return", label: "RETURN", mark: "RTN", image: "assets/slots/counter-return/symbol-return.svg", weight: 4, tier: 3 }
            ]
        }
    ];

    function money(value) {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD"
        }).format(value);
    }

    function readBalance() {
        if (sessionStorage.getItem(BALANCE_VERSION_KEY) !== BALANCE_VERSION) {
            sessionStorage.setItem(BALANCE_KEY, String(DEFAULT_BALANCE));
            sessionStorage.setItem(BALANCE_VERSION_KEY, BALANCE_VERSION);
            return DEFAULT_BALANCE;
        }

        const stored = Number(sessionStorage.getItem(BALANCE_KEY));
        if (Number.isFinite(stored)) return stored;
        sessionStorage.setItem(BALANCE_KEY, String(DEFAULT_BALANCE));
        sessionStorage.setItem(BALANCE_VERSION_KEY, BALANCE_VERSION);
        return DEFAULT_BALANCE;
    }

    function writeBalance(value) {
        const next = Math.max(0, Math.round(value * 100) / 100);
        sessionStorage.setItem(BALANCE_KEY, String(next));
        renderBalance();
        return next;
    }

    function adjustBalance(delta) {
        return writeBalance(readBalance() + delta);
    }

    function renderBalance() {
        const value = readBalance();
        document.querySelectorAll("[data-balance-value]").forEach((element) => {
            element.textContent = money(value);
        });
    }

    function initBalanceStrip() {
        const header = document.querySelector("header");
        if (!header || document.querySelector(".balance-strip")) return;

        const strip = document.createElement("div");
        strip.className = "balance-strip";
        strip.innerHTML = `
            <span>SESSION BALANCE</span>
            <strong data-balance-value>${money(readBalance())}</strong>
        `;
        header.insertAdjacentElement("afterend", strip);
    }

    function randomUnit() {
        if (window.crypto?.getRandomValues) {
            const values = new Uint32Array(1);
            window.crypto.getRandomValues(values);
            return values[0] / 4294967296;
        }
        return Math.random();
    }

    function hasSizes(product) {
        return Array.isArray(product?.sizes) && product.sizes.length > 0;
    }

    function cartKey(id, size = "") {
        return size ? `${id}::${size}` : id;
    }

    function parseCartKey(key) {
        const [id, size = ""] = key.split("::");
        return { id, size };
    }

    function normalizedSize(product, size = "") {
        if (!hasSizes(product)) return "";
        return product.sizes.includes(size) ? size : product.sizes[0];
    }

    function productArtMarkup(product, extraClass = "") {
        return `
            <div class="product-art product-art--${product.visual} ${extraClass}" aria-hidden="true">
                <span class="product-art__code">${product.code}</span>
                <span class="product-art__ticket">DOG DAYS GOODS</span>
                <span class="product-art__shape"></span>
                <span class="product-art__mark">${product.mark}</span>
                <span class="product-art__bar"></span>
            </div>
        `;
    }

    function readCart() {
        try {
            const parsed = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
            const normalized = {};

            Object.entries(parsed).forEach(([storedKey, qty]) => {
                const { id, size } = parseCartKey(storedKey);
                const product = productMap.get(id);
                if (!product || !Number.isInteger(qty) || qty <= 0) return;

                const key = cartKey(id, normalizedSize(product, size));
                normalized[key] = Math.min((normalized[key] || 0) + qty, 99);
            });

            return normalized;
        } catch (_error) {
            return {};
        }
    }

    function writeCart(cart) {
        localStorage.setItem(CART_KEY, JSON.stringify(cart));
        renderCart();
    }

    function cartEntries() {
        const cart = readCart();
        return Object.entries(cart).map(([key, qty]) => {
            const { id, size } = parseCartKey(key);
            return {
                key,
                size,
                product: productMap.get(id),
                qty
            };
        });
    }

    function cartSubtotal() {
        return cartEntries().reduce((sum, entry) => sum + entry.product.price * entry.qty, 0);
    }

    function cartCount() {
        return cartEntries().reduce((sum, entry) => sum + entry.qty, 0);
    }

    function addToCart(id, size = "") {
        const product = productMap.get(id);
        if (!product) return;

        const cart = readCart();
        const key = cartKey(id, normalizedSize(product, size));
        cart[key] = Math.min((cart[key] || 0) + 1, 99);
        writeCart(cart);
    }

    function setQuantity(key, qty) {
        const cart = readCart();
        if (qty <= 0) {
            delete cart[key];
        } else {
            cart[key] = Math.min(qty, 99);
        }
        writeCart(cart);
    }

    function renderProducts() {
        const grid = document.getElementById("product-grid");
        if (!grid) return;

        grid.innerHTML = products.map((product) => `
            <article class="product-card">
                ${productArtMarkup(product)}
                <div class="product-card__body">
                    <p class="product-status">${product.status}</p>
                    <div class="product-card__top">
                        <h2>${product.name}</h2>
                        <span class="product-price">${money(product.price)}</span>
                    </div>
                    <div class="product-card__ledger">
                        <span>${product.code}</span>
                        <span>${product.format}</span>
                    </div>
                    <p class="product-description">${product.description}</p>
                    <div class="product-card__actions">
                        <button class="button button--secondary" type="button" data-view-product="${product.id}">View record</button>
                        <button class="button button--primary" type="button" data-add-product="${product.id}">${hasSizes(product) ? "Select size" : "Add to cart"}</button>
                    </div>
                </div>
            </article>
        `).join("");

        grid.addEventListener("click", (event) => {
            const button = event.target.closest("[data-add-product]");
            const recordButton = event.target.closest("[data-view-product]");

            if (button) {
                const product = productMap.get(button.dataset.addProduct);
                if (hasSizes(product)) {
                    openProductRecord(button.dataset.addProduct);
                    return;
                }

                addToCart(button.dataset.addProduct);
                button.textContent = "Added";
                window.setTimeout(() => {
                    button.textContent = "Add to cart";
                }, 900);
            }

            if (recordButton) {
                openProductRecord(recordButton.dataset.viewProduct);
            }
        });
    }

    function renderCart() {
        const container = document.getElementById("cart-items");
        const subtotal = document.getElementById("cart-subtotal");
        const checkoutLink = document.getElementById("checkout-link");
        const clearButton = document.getElementById("clear-cart");
        const note = document.querySelector(".cart-note");

        if (!container || !subtotal) return;

        const entries = cartEntries();
        const count = cartCount();
        subtotal.textContent = money(cartSubtotal());

        if (note) {
            if (count >= 7) {
                note.textContent = "The cart has repeated itself enough to be filed as weather.";
            } else if (count > 0) {
                note.textContent = "Items remain in this browser until they are removed or processed.";
            } else {
                note.textContent = "The cart remains empty without requesting correction.";
            }
        }

        if (checkoutLink) {
            const empty = entries.length === 0;
            checkoutLink.setAttribute("aria-disabled", String(empty));
            checkoutLink.classList.toggle("is-disabled", empty);
        }

        if (clearButton) {
            clearButton.disabled = entries.length === 0;
        }

        if (entries.length === 0) {
            container.innerHTML = `<p class="cart-empty">The cart is empty and behaving normally.</p>`;
            return;
        }

        container.innerHTML = entries.map(({ key, product, qty, size }) => {
            const lineName = size ? `${product.name} / ${size}` : product.name;
            return `
            <article class="cart-item">
                <div class="cart-item__row">
                    <span class="cart-item__name">${lineName}</span>
                    <span>${money(product.price * qty)}</span>
                </div>
                <div class="cart-item__row">
                    <div class="cart-qty" aria-label="Quantity for ${lineName}">
                        <button type="button" data-cart-decrease="${key}" aria-label="Decrease ${lineName}">-</button>
                        <span>${qty}</span>
                        <button type="button" data-cart-increase="${key}" aria-label="Increase ${lineName}">+</button>
                    </div>
                    <button class="remove-item" type="button" data-cart-remove="${key}">Remove</button>
                </div>
            </article>
        `;
        }).join("");
    }

    function openProductRecord(id) {
        const modal = document.getElementById("product-record");
        const content = document.getElementById("product-record-content");
        const close = document.getElementById("product-record-close");
        const product = productMap.get(id);
        const record = productRecords[id];

        if (!modal || !content || !close || !product || !record) return;

        const sizeSelect = hasSizes(product) ? `
            <fieldset class="size-select">
                <legend>Size</legend>
                <div class="size-select__options">
                    ${product.sizes.map((size, index) => `
                        <label>
                            <input type="radio" name="record-size" value="${size}" ${index === 1 ? "checked" : ""}>
                            <span>${size}</span>
                        </label>
                    `).join("")}
                </div>
            </fieldset>
        ` : "";

        content.innerHTML = `
            <article class="product-record">
                <div class="product-record__layout">
                    <div class="product-record__image">
                        ${productArtMarkup(product, "product-art--record")}
                    </div>
                    <div class="product-record__details">
                        <div class="product-record__header">
                            <p class="eyebrow">PRODUCT RECORD</p>
                            <h2 id="product-record-title">${product.name}</h2>
                            <p>${product.description}</p>
                        </div>
                        <div class="product-record__meta">
                            <div><span>Code</span><strong>${product.code}</strong></div>
                            <div><span>Status</span><strong>${product.status}</strong></div>
                            <div><span>Price</span><strong>${money(product.price)}</strong></div>
                            <div><span>Classification</span><strong>${product.mark}</strong></div>
                        </div>
                        <ul class="product-record__list">
                            <li><strong>Material:</strong> ${record.material}</li>
                            <li><strong>Fit:</strong> ${record.fit}</li>
                            <li><strong>Handling:</strong> ${record.handling}</li>
                            <li><strong>Note:</strong> ${record.note}</li>
                        </ul>
                        ${sizeSelect}
                        <button class="button button--primary" type="button" data-record-add="${product.id}">Add to cart</button>
                    </div>
                </div>
            </article>
        `;
        modal.hidden = false;
        close.focus();
    }

    function closeProductRecord() {
        const modal = document.getElementById("product-record");
        if (modal) modal.hidden = true;
    }

    function initProductRecordControls() {
        const modal = document.getElementById("product-record");
        const close = document.getElementById("product-record-close");
        const content = document.getElementById("product-record-content");

        if (!modal || !close || !content) return;

        close.addEventListener("click", closeProductRecord);
        modal.addEventListener("click", (event) => {
            if (event.target === modal) closeProductRecord();
        });
        content.addEventListener("click", (event) => {
            const button = event.target.closest("[data-record-add]");
            if (!button) return;
            const product = productMap.get(button.dataset.recordAdd);
            const size = content.querySelector('input[name="record-size"]:checked')?.value || "";
            addToCart(button.dataset.recordAdd, normalizedSize(product, size));
            button.textContent = "Added";
            window.setTimeout(() => {
                button.textContent = "Add to cart";
            }, 900);
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !modal.hidden) closeProductRecord();
        });
    }

    function initCartControls() {
        const container = document.getElementById("cart-items");
        const clearButton = document.getElementById("clear-cart");
        const checkoutLink = document.getElementById("checkout-link");

        if (container) {
            container.addEventListener("click", (event) => {
                const increase = event.target.closest("[data-cart-increase]");
                const decrease = event.target.closest("[data-cart-decrease]");
                const remove = event.target.closest("[data-cart-remove]");
                const cart = readCart();

                if (increase) setQuantity(increase.dataset.cartIncrease, (cart[increase.dataset.cartIncrease] || 0) + 1);
                if (decrease) setQuantity(decrease.dataset.cartDecrease, (cart[decrease.dataset.cartDecrease] || 0) - 1);
                if (remove) setQuantity(remove.dataset.cartRemove, 0);
            });
        }

        if (clearButton) {
            clearButton.addEventListener("click", () => writeCart({}));
        }

        if (checkoutLink) {
            checkoutLink.addEventListener("click", (event) => {
                if (cartCount() === 0) event.preventDefault();
            });
        }
    }

    function selectedValue(name) {
        const selected = document.querySelector(`input[name="${name}"]:checked`);
        return selected ? selected.value : "";
    }

    function checkoutChoices() {
        return {
            notice: selectedValue("notice"),
            fulfillment: selectedValue("fulfillment"),
            authorization: selectedValue("authorization")
        };
    }

    function showCheckoutStep(stepNumber) {
        document.querySelectorAll("[data-step]").forEach((step) => {
            step.hidden = step.dataset.step !== String(stepNumber);
        });

        document.querySelectorAll("[data-progress-step]").forEach((step) => {
            step.classList.toggle("is-active", step.dataset.progressStep === String(stepNumber));
        });

        renderCheckoutReview();
    }

    function renderCheckoutReview() {
        const review = document.getElementById("checkout-cart-review");
        const subtotal = document.getElementById("checkout-subtotal");
        const orderReview = document.getElementById("checkout-order-review");
        const entries = cartEntries();

        if (review) {
            review.innerHTML = entries.map(({ product, qty, size }) => {
                const lineName = size ? `${product.name} / ${size}` : product.name;
                return `
                <div class="review-line">
                    <span><strong>${lineName}</strong><br>${qty} x ${money(product.price)}</span>
                    <span>${money(product.price * qty)}</span>
                </div>
            `;
            }).join("");
        }

        if (subtotal) {
            subtotal.textContent = money(cartSubtotal());
        }

        if (orderReview) {
            const choices = checkoutChoices();
            orderReview.innerHTML = `
                <div class="review-line"><strong>Notice</strong><span>${choices.notice}</span></div>
                <div class="review-line"><strong>Fulfillment</strong><span>${choices.fulfillment}</span></div>
                <div class="review-line"><strong>Authorization</strong><span>${choices.authorization}</span></div>
                <div class="review-line"><strong>Items</strong><span>${cartCount()}</span></div>
                <div class="review-total"><span>Subtotal</span><strong>${money(cartSubtotal())}</strong></div>
            `;
        }
    }

    function generateOrderNumber() {
        const now = new Date();
        const date = now.toISOString().slice(0, 10).replace(/-/g, "");
        const fragment = Math.random().toString(36).slice(2, 6).toUpperCase();
        return `DD-${date}-${fragment}`;
    }

    function seededRandom(seed) {
        let value = seed >>> 0;
        return function () {
            value += 0x6D2B79F5;
            let result = Math.imul(value ^ (value >>> 15), 1 | value);
            result ^= result + Math.imul(result ^ (result >>> 7), 61 | result);
            return ((result ^ (result >>> 14)) >>> 0) / 4294967296;
        };
    }

    function rouletteSeed() {
        let cryptoSeed = 0;
        if (window.crypto?.getRandomValues) {
            const values = new Uint32Array(1);
            window.crypto.getRandomValues(values);
            cryptoSeed = values[0];
        }

        const timeSeed = Date.now() >>> 0;
        const performanceSeed = Math.floor(performance.now() * 1000) >>> 0;
        return (cryptoSeed ^ timeSeed ^ performanceSeed) >>> 0;
    }

    function rouletteColor(number) {
        if (number === 0) return "green";
        return ROULETTE_RED_NUMBERS.has(number) ? "red" : "black";
    }

    function renderRouletteWheel() {
        const disc = document.getElementById("roulette-disc");
        if (!disc || disc.dataset.rendered === "true") return;

        const segment = 360 / ROULETTE_WHEEL.length;
        const stops = ROULETTE_WHEEL.map((number, index) => {
            const color = rouletteColor(number);
            const hex = color === "green" ? "#2e7d50" : color === "red" ? "#9f1d24" : "#111";
            const start = (index * segment).toFixed(2);
            const end = ((index + 1) * segment).toFixed(2);
            return `${hex} ${start}deg ${end}deg`;
        }).join(", ");

        disc.style.background = `radial-gradient(circle, var(--white) 0 18%, transparent 19%), conic-gradient(${stops})`;
        disc.innerHTML = ROULETTE_WHEEL.map((number, index) => {
            const angle = index * segment + segment / 2;
            return `<span class="roulette-pocket" style="--angle:${angle}deg;--reverse-angle:${-angle}deg;">${number}</span>`;
        }).join("");
        disc.dataset.rendered = "true";
    }

    function createReceipt() {
        const entries = cartEntries();
        const receipt = {
            orderNumber: generateOrderNumber(),
            timestamp: new Date().toLocaleString(),
            status: "WEATHER ACCEPTED",
            choices: checkoutChoices(),
            items: entries.map(({ product, qty, size }) => ({
                name: product.name,
                size,
                qty,
                price: product.price
            })),
            subtotal: cartSubtotal(),
            balanceAfter: readBalance()
        };

        localStorage.setItem(RECEIPT_KEY, JSON.stringify(receipt));
        localStorage.setItem(WEATHER_KEY, `${receipt.orderNumber}: weather accepted`);
        localStorage.removeItem(CART_KEY);
        return receipt;
    }

    function renderConfirmation(receipt) {
        const confirmation = document.getElementById("checkout-confirmation");
        if (!confirmation) return;

        const items = receipt.items.map((item) => {
            const lineName = item.size ? `${item.name} / ${item.size}` : item.name;
            return `
            <div class="receipt-line">
                <span><strong>${lineName}</strong><br>${item.qty} x ${money(item.price)}</span>
                <span>${money(item.qty * item.price)}</span>
            </div>
        `;
        }).join("");

        confirmation.innerHTML = `
            <article class="receipt">
                <p class="eyebrow">ORDER RECEIVED</p>
                <h2>Fulfillment Status: ${receipt.status}</h2>
                <div class="receipt-meta">
                    <div><span>Order</span><strong>${receipt.orderNumber}</strong></div>
                    <div><span>Time</span><strong>${receipt.timestamp}</strong></div>
                    <div><span>Total</span><strong>${money(receipt.subtotal)}</strong></div>
                    <div><span>Account</span><strong>${money(receipt.balanceAfter || readBalance())}</strong></div>
                </div>
                <div class="receipt-statement">
                    <p>Your request entered DOG DAYS at the time shown above.</p>
                    <p>The items were reserved in the order they were noticed.</p>
                    <p>Fulfillment and return have been filed under the same weather.</p>
                    <p>No further action is required. Further action has not been forecast.</p>
                </div>
                <div class="receipt-items">${items}</div>
                <div class="receipt-total"><span>Recorded subtotal</span><strong>${money(receipt.subtotal)}</strong></div>
                <p>The store has accepted the transaction. The transaction has declined to leave.</p>
                <div class="receipt-actions">
                    <button class="button button--primary" type="button" id="print-receipt">Print receipt</button>
                    <a class="button button--secondary" href="record.html">Open record</a>
                    <a class="button button--secondary" href="shop.html">Return to shop</a>
                </div>
            </article>
        `;

        confirmation.hidden = false;
        document.getElementById("print-receipt")?.addEventListener("click", () => window.print());
    }

    function startProcessing(processing) {
        processing.hidden = false;

        const lines = [
            "Counting inventory.",
            "Checking weather.",
            "Filing fulfillment with cancellation.",
            "Closing the open portion."
        ];
        const lineElement = document.getElementById("processing-line");
        let index = 0;
        const interval = window.setInterval(() => {
            index += 1;
            if (lineElement) lineElement.textContent = lines[index] || lines[lines.length - 1];
        }, 520);

        window.setTimeout(() => {
            window.clearInterval(interval);
            const receipt = createReceipt();
            processing.hidden = true;
            renderConfirmation(receipt);
        }, 2300);
    }

    function initCheckout() {
        const form = document.getElementById("checkout-form");
        const empty = document.getElementById("checkout-empty");
        const processing = document.getElementById("checkout-processing");
        const roulette = document.getElementById("checkout-roulette");
        const failure = document.getElementById("checkout-failure");
        const funds = document.getElementById("checkout-funds");
        const placeOrder = document.getElementById("place-order");
        const progress = document.querySelector(".checkout-progress");
        let checkoutStake = 0;

        if (!form) return;

        renderRouletteWheel();

        if (cartCount() === 0) {
            form.hidden = true;
            progress.hidden = true;
            empty.hidden = false;
            return;
        }

        renderCheckoutReview();

        form.addEventListener("change", renderCheckoutReview);

        form.addEventListener("click", (event) => {
            const next = event.target.closest("[data-next-step]");
            const prev = event.target.closest("[data-prev-step]");
            if (next) showCheckoutStep(next.dataset.nextStep);
            if (prev) showCheckoutStep(prev.dataset.prevStep);
        });

        placeOrder?.addEventListener("click", () => {
            checkoutStake = cartSubtotal();
            if (readBalance() < checkoutStake) {
                const detail = document.getElementById("checkout-funds-detail");
                if (detail) {
                    detail.textContent = `The cart is asking for ${money(checkoutStake)}. The account is holding ${money(readBalance())}.`;
                }
                form.hidden = true;
                progress.hidden = true;
                if (funds) {
                    funds.hidden = false;
                    funds.querySelector("a")?.focus();
                }
                return;
            }

            const wheel = document.getElementById("roulette-wheel");
            const disc = document.querySelector(".roulette-wheel__disc");
            const ball = document.getElementById("roulette-ball");
            wheel?.classList.remove("is-spinning", "is-landed");
            if (disc) disc.style.transform = "rotate(0deg)";
            if (ball) ball.style.transform = "rotate(0deg)";
            form.hidden = true;
            progress.hidden = true;
            roulette.hidden = false;
            document.querySelector("[data-roulette-choice]")?.focus();
        });

        document.getElementById("roulette-buttons")?.addEventListener("click", (event) => {
            const button = event.target.closest("[data-roulette-choice]");
            if (!button || button.disabled) return;

            const choice = button.dataset.rouletteChoice;
            const status = document.getElementById("roulette-status");
            const resultBox = document.getElementById("roulette-result");
            const resultValue = document.getElementById("roulette-result-value");
            const wheel = document.getElementById("roulette-wheel");
            const disc = document.querySelector(".roulette-wheel__disc");
            const ball = document.getElementById("roulette-ball");
            const buttons = document.querySelectorAll("[data-roulette-choice]");

            buttons.forEach((betButton) => {
                betButton.disabled = true;
                betButton.classList.toggle("is-selected", betButton === button);
            });

            const seed = rouletteSeed();
            const random = seededRandom(seed);
            const number = Math.floor(random() * 37);
            const color = rouletteColor(number);
            const segment = 360 / ROULETTE_WHEEL.length;
            const targetIndex = ROULETTE_WHEEL.indexOf(number);
            const targetAngle = targetIndex * segment + segment / 2;
            const landingAngle = 20 + random() * 320;
            const wheelTurns = 6 + Math.floor(random() * 4);
            const ballTurns = wheelTurns + 2 + Math.floor(random() * 3);
            const discRotation = wheelTurns * 360 + landingAngle - targetAngle;
            const ballRotation = ballTurns * 360 + landingAngle;

            if (status) status.textContent = `Chip placed on ${choice.toUpperCase()}. The wheel is moving.`;
            if (resultBox) resultBox.hidden = true;
            if (wheel) {
                wheel.classList.remove("is-spinning", "is-landed");
                void wheel.offsetWidth;
                wheel.classList.add("is-spinning");
            }
            if (disc) disc.style.transform = `rotate(${discRotation}deg)`;
            if (ball) ball.style.transform = `rotate(${ballRotation}deg)`;

            window.setTimeout(() => {
                if (wheel) {
                    wheel.classList.remove("is-spinning");
                    wheel.classList.add("is-landed");
                }

                const resultText = `${number} / ${color.toUpperCase()}`;
                if (resultValue) resultValue.textContent = resultText;
                if (resultBox) resultBox.hidden = false;

                if (color === choice) {
                    if (status) status.textContent = "Color accepted. The order may enter the weather.";
                    adjustBalance(-checkoutStake);
                    window.setTimeout(() => {
                        roulette.hidden = true;
                        startProcessing(processing);
                    }, 950);
                    return;
                }

                if (status) status.textContent = "Color declined. The order remains at the table.";
                window.setTimeout(() => {
                    adjustBalance(-checkoutStake);
                    const detail = document.getElementById("checkout-failure-detail");
                    if (detail) {
                        detail.textContent = `The wheel returned ${resultText}. The table retained ${money(checkoutStake)} and did not return the order with the correct color.`;
                    }
                    roulette.hidden = true;
                    failure.hidden = false;
                    failure.querySelector("a")?.focus();
                }, 950);
            }, 3720);
        });
    }

    function slotById(id) {
        return slotMachines.find((slot) => slot.id === id);
    }

    function slotBonusSymbol(slot) {
        return slot.symbols.find((symbol) => symbol.id === slot.bonusSymbol) || slot.symbols[slot.symbols.length - 1];
    }

    function weightedSlotSymbol(slot, options = {}) {
        const symbols = options.excludeBonus ? slot.symbols.filter((symbol) => symbol.id !== slot.bonusSymbol) : slot.symbols;
        const total = symbols.reduce((sum, symbol) => sum + symbol.weight, 0);
        let roll = randomUnit() * total;
        for (const symbol of symbols) {
            roll -= symbol.weight;
            if (roll <= 0) return symbol;
        }
        return symbols[0];
    }

    function makeSlotGrid(slot, options = {}) {
        const grid = Array.from({ length: 5 }, () => Array.from({ length: 4 }, () => weightedSlotSymbol(slot)));

        if (!options.allowBonusTrigger) return grid;

        const bonusRoll = randomUnit();
        if (bonusRoll < slot.bonusRound.triggerChance) {
            const column = Math.floor(randomUnit() * 5);
            const bonusSymbol = slotBonusSymbol(slot);
            for (let row = 0; row < 4; row += 1) {
                grid[column][row] = bonusSymbol;
            }
            return grid;
        }

        if (bonusRoll < slot.bonusRound.triggerChance + slot.bonusRound.nearMissChance) {
            applyBonusNearMiss(slot, grid);
        }

        return grid;
    }

    function applyBonusNearMiss(slot, grid) {
        const bonusSymbol = slotBonusSymbol(slot);
        const mode = Math.floor(randomUnit() * 4);

        if (mode === 0) {
            const column = Math.floor(randomUnit() * 5);
            const missingRow = Math.floor(randomUnit() * 4);
            for (let row = 0; row < 4; row += 1) {
                if (row !== missingRow) grid[column][row] = bonusSymbol;
            }
            return;
        }

        if (mode === 1) {
            const columns = [0, 1, 2, 3, 4].sort(() => randomUnit() - 0.5).slice(0, 2);
            columns.forEach((column) => {
                const missingRows = [0, 1, 2, 3].sort(() => randomUnit() - 0.5).slice(0, 2);
                for (let row = 0; row < 4; row += 1) {
                    if (!missingRows.includes(row)) grid[column][row] = bonusSymbol;
                }
            });
            return;
        }

        if (mode === 2) {
            const row = Math.floor(randomUnit() * 4);
            const columns = [0, 1, 2, 3, 4].sort(() => randomUnit() - 0.5).slice(0, 4);
            columns.forEach((column) => {
                grid[column][row] = bonusSymbol;
            });
            return;
        }

        const positions = new Set();
        while (positions.size < 5) {
            const column = Math.floor(randomUnit() * 5);
            const row = Math.floor(randomUnit() * 4);
            const key = posKey(column, row);
            const columnCount = Array.from(positions).filter((position) => position.startsWith(`${column}:`)).length;
            if (columnCount < 3) positions.add(key);
        }
        positions.forEach((key) => {
            const [column, row] = key.split(":").map(Number);
            grid[column][row] = bonusSymbol;
        });
    }

    function posKey(column, row) {
        return `${column}:${row}`;
    }

    function slotSymbolMarkup(symbol, options = {}) {
        const classes = ["slot-symbol", `slot-symbol--${symbol.id}`];
        if (options.locked) classes.push("is-locked");
        if (options.newBonus) classes.push("is-new-bonus");
        if (options.empty) classes.push("is-empty-spin");
        return `
            <span class="${classes.join(" ")}" data-slot-symbol="${symbol.id}">
                <img class="slot-symbol__image" src="${symbol.image}" alt="" loading="lazy" decoding="async">
                <strong>${symbol.mark}</strong>
                <span>${symbol.label}</span>
            </span>
        `;
    }

    function slotGridMarkup(grid, options = {}) {
        const locked = options.locked || new Set();
        const newBonus = options.newBonus || new Set();
        let markup = "";
        for (let row = 0; row < 4; row += 1) {
            for (let column = 0; column < 5; column += 1) {
                const key = posKey(column, row);
                markup += slotSymbolMarkup(grid[column][row], {
                    locked: locked.has(key),
                    newBonus: newBonus.has(key)
                });
            }
        }
        return markup;
    }

    function readSlotGrid(card, slot) {
        const symbols = Array.from(card.querySelectorAll("[data-slot-reels] > .slot-symbol"));
        if (symbols.length !== 20) return makeSlotGrid(slot);

        const grid = Array.from({ length: 5 }, () => Array(4));
        symbols.forEach((element, index) => {
            const row = Math.floor(index / 5);
            const column = index % 5;
            const id = element.dataset.slotSymbol;
            grid[column][row] = slot.symbols.find((symbol) => symbol.id === id) || weightedSlotSymbol(slot);
        });
        return grid;
    }

    function slotReelMetrics(reels) {
        const styles = window.getComputedStyle(reels);
        const rowGap = Number.parseFloat(styles.rowGap || styles.gap) || 0;
        const paddingTop = Number.parseFloat(styles.paddingTop) || 0;
        const paddingBottom = Number.parseFloat(styles.paddingBottom) || 0;
        const contentHeight = Math.max(0, reels.clientHeight - paddingTop - paddingBottom);
        const cellHeight = Math.max(28, (contentHeight - rowGap * 3) / 4);
        const travelRows = 16;

        return {
            cellHeight: Math.round(cellHeight * 100) / 100,
            distance: Math.round(-(cellHeight + rowGap) * travelRows * 100) / 100
        };
    }

    function slotRollMarkup(slot, currentGrid, finalGrid, metrics) {
        return Array.from({ length: 5 }, (_value, column) => {
            const symbols = [
                ...currentGrid[column],
                ...Array.from({ length: 12 }, () => weightedSlotSymbol(slot)),
                ...finalGrid[column]
            ];
            const duration = 980 + column * 190;
            const delay = column * 50;
            return `
                <div class="slot-reel" style="--roll-duration:${duration}ms; --roll-delay:${delay}ms; --slot-cell-height:${metrics.cellHeight}px; --roll-distance:${metrics.distance}px;">
                    <div class="slot-reel__strip">
                        ${symbols.map((symbol) => slotSymbolMarkup(symbol)).join("")}
                    </div>
                </div>
            `;
        }).join("");
    }

    function slotRollSettleMs() {
        const lastColumn = 4;
        const duration = 980 + lastColumn * 190;
        const delay = lastColumn * 50;
        return duration + delay + 160;
    }

    function slotBet(card) {
        const coin = Number(card.dataset.coin || coinValues[0]) / 100;
        const multiplier = Number(card.dataset.multiplier || slotMultipliers[0]);
        return Math.round(coin * multiplier * 100) / 100;
    }

    function updateSlotBet(card) {
        const bet = card.querySelector("[data-slot-bet]");
        if (bet) bet.textContent = money(slotBet(card));
    }

    function lineSymbol(grid, coordinates) {
        const first = grid[coordinates[0][0]][coordinates[0][1]];
        return coordinates.every(([column, row]) => grid[column][row].id === first.id) ? first : null;
    }

    function evaluateSlot(slot, grid, bet) {
        const hits = [];
        let multiplier = 0;
        let openingPairs = 0;
        let bestPair = null;

        function addHit(label, base, symbol) {
            const value = Math.round(base * symbol.tier * 100) / 100;
            hits.push(`${label}: ${symbol.label} / ${value}x`);
            multiplier += value;
        }

        for (let row = 0; row < 4; row += 1) {
            const first = grid[0][row];
            let run = 1;
            for (let column = 1; column < 5; column += 1) {
                if (grid[column][row].id !== first.id) break;
                run += 1;
            }

            if (run >= 5) addHit("Five across", slot.pays.five, first);
            else if (run >= 4) addHit("Four across", slot.pays.four, first);
            else if (run >= 3) addHit("Three across", slot.pays.three, first);
            else if (run >= 2) {
                openingPairs += 1;
                if (!bestPair || first.tier > bestPair.tier) bestPair = first;
            }
        }

        if (openingPairs >= 2 && bestPair) addHit("Two opening pairs", slot.pays.twoPair, bestPair);
        else if (openingPairs === 1 && bestPair) addHit("Opening pair", slot.pays.pair, bestPair);

        const centerA = grid[2][1];
        const centerB = grid[2][2];
        if (centerA.id === centerB.id) addHit("Center hold", slot.pays.centerPair, centerA);

        const scatterSymbol = slot.symbols.find((symbol) => symbol.id === slot.scatterSymbol);
        const scatterCount = grid.flat().filter((symbol) => symbol.id === slot.scatterSymbol).length;
        if (scatterSymbol && scatterCount >= 4) addHit("Public scatter", slot.pays.scatter4, scatterSymbol);
        else if (scatterSymbol && scatterCount >= 3) addHit("Small scatter", slot.pays.scatter3, scatterSymbol);

        [
            [[0, 0], [1, 1], [2, 2], [3, 3]],
            [[1, 3], [2, 2], [3, 1], [4, 0]],
            [[0, 3], [1, 2], [2, 1], [3, 0]],
            [[1, 0], [2, 1], [3, 2], [4, 3]]
        ].forEach((coordinates) => {
            const symbol = lineSymbol(grid, coordinates);
            if (symbol) addHit("Diagonal file", slot.pays.diagonal, symbol);
        });

        const cornerSymbol = lineSymbol(grid, [[0, 0], [4, 0], [0, 3], [4, 3]]);
        if (cornerSymbol) addHit("Four corners", slot.pays.corners, cornerSymbol);

        const bonusPositions = findBonusPositions(slot, grid);
        const bonusColumns = new Set(Array.from(bonusPositions).map((key) => key.split(":")[0]));
        const bonusLines = bonusColumns.size;

        if (bonusLines > 0) {
            hits.push(`${slot.bonusName} bonus ready / ${slot.bonusRound.startSpins} free spins`);
        }

        const payout = Math.round(bet * multiplier * 100) / 100;

        return {
            hits,
            bonusLines,
            bonusPositions,
            payout,
            multiplier: Math.round(multiplier * 100) / 100
        };
    }

    function findBonusPositions(slot, grid) {
        const positions = new Set();
        for (let column = 0; column < 5; column += 1) {
            if (grid[column].every((symbol) => symbol.id === slot.bonusSymbol)) {
                for (let row = 0; row < 4; row += 1) {
                    positions.add(posKey(column, row));
                }
            }
        }
        return positions;
    }

    function bonusMultiplier(slot, lockedCount) {
        if (lockedCount >= 20) return slot.bonusRound.full;
        if (lockedCount <= 4) return slot.bonusRound.base;
        const extra = lockedCount - 4;
        return Math.round((slot.bonusRound.base + Math.pow(extra, 1.45) * slot.bonusRound.step) * 100) / 100;
    }

    function bonusGrid(slot, locked) {
        const bonusSymbol = slotBonusSymbol(slot);
        return Array.from({ length: 5 }, (_columnValue, column) => {
            return Array.from({ length: 4 }, (_rowValue, row) => {
                return locked.has(posKey(column, row)) ? bonusSymbol : weightedSlotSymbol(slot, { excludeBonus: true });
            });
        });
    }

    function bonusSpinGrid(slot, locked) {
        const bonusSymbol = slotBonusSymbol(slot);
        const grid = bonusGrid(slot, locked);
        const newPositions = new Set();

        for (let column = 0; column < 5; column += 1) {
            for (let row = 0; row < 4; row += 1) {
                const key = posKey(column, row);
                if (locked.has(key)) continue;
                if (randomUnit() < slot.bonusRound.symbolChance) {
                    grid[column][row] = bonusSymbol;
                    newPositions.add(key);
                }
            }
        }

        return { grid, newPositions };
    }

    function triggerBonusCue(card) {
        const cue = card.querySelector("[data-slot-bonus-cue]");
        if (!cue) return;
        cue.hidden = false;
        cue.textContent = "Activate bonus.";
        cue.classList.remove("is-finished");
    }

    function finishBonusCue(card, text) {
        const cue = card.querySelector("[data-slot-bonus-cue]");
        if (!cue) return;
        cue.textContent = text;
        cue.classList.add("is-finished");
        window.setTimeout(() => {
            cue.hidden = true;
            cue.classList.remove("is-finished");
        }, 1900);
    }

    function startSlotBonusRound({ slot, card, reels, status, spin, bet, lockedPositions, initialGrid }) {
        let locked = new Set(lockedPositions);
        let freeSpins = slot.bonusRound.startSpins;
        card.classList.add("is-bonus");
        reels.classList.add("is-bonus");
        reels.innerHTML = slotGridMarkup(initialGrid || bonusGrid(slot, locked), { locked });
        status.textContent = `${slot.bonusName} bonus activated. ${freeSpins} free spins filed.`;

        function endBonus(reason) {
            const lockedCount = locked.size;
            const multiplier = bonusMultiplier(slot, lockedCount);
            const payout = Math.round(bet * multiplier * 100) / 100;
            adjustBalance(payout);
            card.classList.remove("is-bonus", "is-bonus-spinning");
            reels.classList.remove("is-bonus");
            spin.disabled = false;
            status.textContent = `${money(payout)} bonus returned. ${lockedCount} of 20 ${slot.bonusName} symbols held. ${reason}`;
            finishBonusCue(card, lockedCount === 20 ? "Full screen accepted." : "Bonus filed.");
            saveSlotHistory({
                slot: slot.id,
                at: new Date().toISOString(),
                bet: 0,
                payout,
                hits: [`Bonus ${lockedCount}/20`, `${multiplier}x`],
                balance: readBalance()
            });
        }

        function runFreeSpin() {
            if (locked.size >= 20) {
                endBonus("The screen filled before another spin was required.");
                return;
            }

            if (freeSpins <= 0) {
                endBonus("No free spins remain in the account.");
                return;
            }

            freeSpins -= 1;
            card.classList.add("is-bonus-spinning");
            status.textContent = `Bonus spin active. ${freeSpins} free spins remain behind this spin.`;

            let ticks = 0;
            const ticker = window.setInterval(() => {
                ticks += 1;
                reels.innerHTML = slotGridMarkup(bonusGrid(slot, locked), { locked });
                if (ticks >= 7) window.clearInterval(ticker);
            }, 90);

            window.setTimeout(() => {
                window.clearInterval(ticker);
                const result = bonusSpinGrid(slot, locked);
                result.newPositions.forEach((key) => locked.add(key));
                const newCount = result.newPositions.size;
                card.classList.remove("is-bonus-spinning");
                reels.innerHTML = slotGridMarkup(result.grid, { locked, newBonus: result.newPositions });

                if (locked.size >= 20) {
                    window.setTimeout(() => endBonus("The full screen was filed."), 950);
                    return;
                }

                if (newCount === 0) {
                    window.setTimeout(() => endBonus("No new bonus symbols landed on the last free spin."), 950);
                    return;
                }

                freeSpins += newCount;
                status.textContent = `${newCount} new ${slot.bonusName} symbol${newCount === 1 ? "" : "s"} locked. ${newCount} free spin${newCount === 1 ? "" : "s"} added.`;
                window.setTimeout(runFreeSpin, 1050);
            }, 840);
        }

        window.setTimeout(runFreeSpin, 1200);
    }

    function saveSlotHistory(entry) {
        let history = [];
        try {
            history = JSON.parse(sessionStorage.getItem(SLOT_HISTORY_KEY) || "[]");
        } catch (_error) {
            history = [];
        }
        history.unshift(entry);
        sessionStorage.setItem(SLOT_HISTORY_KEY, JSON.stringify(history.slice(0, 18)));
    }

    function slotRules(slot) {
        return `
            <ul>
                <li>Three across from the left pays ${slot.pays.three}x before symbol weight.</li>
                <li>Opening pairs, center holds, and ${slot.scatterSymbol.toUpperCase()} scatters pay smaller filed returns.</li>
                <li>Four across from the left pays ${slot.pays.four}x before symbol weight.</li>
                <li>Five across pays ${slot.pays.five}x before symbol weight.</li>
                <li>Diagonal files pay ${slot.pays.diagonal}x before symbol weight.</li>
                <li>Four matching corners pay ${slot.pays.corners}x before symbol weight.</li>
                <li>Four ${slot.bonusName} symbols vertically activate ${slot.bonusRound.startSpins} free bonus spins.</li>
                <li>During bonus spins, locked ${slot.bonusName} symbols remain. Each new ${slot.bonusName} symbol adds one free spin.</li>
            </ul>
        `;
    }

    function renderSlotMachines() {
        const container = document.getElementById("slot-machines");
        if (!container) return;

        container.innerHTML = slotMachines.map((slot) => {
            const grid = makeSlotGrid(slot);
            return `
                <article class="slot-machine slot-machine--${slot.id}" data-slot-machine="${slot.id}" data-coin="${coinValues[0]}" data-multiplier="${slotMultipliers[0]}">
                    <div class="slot-machine__header">
                        <img class="slot-machine__logo" src="${slot.logo}" width="420" height="160" alt="${slot.name} logo">
                    </div>
                    <div class="slot-meter">
                        <span>Bet <strong data-slot-bet>${money((coinValues[0] / 100) * slotMultipliers[0])}</strong></span>
                        <span>Bonus <strong>${slot.bonusName}</strong></span>
                    </div>
                    <div class="slot-reels" data-slot-reels>
                        ${slotGridMarkup(grid)}
                    </div>
                    <div class="slot-bonus-cue" data-slot-bonus-cue hidden>Activate bonus.</div>
                    <div class="slot-controls">
                        <div class="slot-control-group">
                            <span>Coin value</span>
                            <div>
                                ${coinValues.map((value, index) => `
                                    <button class="${index === 0 ? "is-selected" : ""}" type="button" data-slot-coin="${value}">${money(value / 100)}</button>
                                `).join("")}
                            </div>
                        </div>
                        <div class="slot-control-group">
                            <span>Multiplier</span>
                            <div>
                                ${slotMultipliers.map((value, index) => `
                                    <button class="${index === 0 ? "is-selected" : ""}" type="button" data-slot-multiplier="${value}">${value}x</button>
                                `).join("")}
                            </div>
                        </div>
                    </div>
                    <button class="button button--primary slot-spin" type="button" data-slot-spin>Spin</button>
                    <p class="slot-status" data-slot-status>Waiting for a coin value.</p>
                    <details class="slot-rules">
                        <summary>Filed rules</summary>
                        ${slotRules(slot)}
                    </details>
                </article>
            `;
        }).join("");
    }

    function initSlotMachines() {
        const container = document.getElementById("slot-machines");
        if (!container) return;

        renderSlotMachines();

        container.addEventListener("click", (event) => {
            const coin = event.target.closest("[data-slot-coin]");
            const multiplier = event.target.closest("[data-slot-multiplier]");
            const spin = event.target.closest("[data-slot-spin]");
            const card = event.target.closest("[data-slot-machine]");
            if (!card) return;

            if (coin) {
                card.dataset.coin = coin.dataset.slotCoin;
                card.querySelectorAll("[data-slot-coin]").forEach((button) => button.classList.toggle("is-selected", button === coin));
                updateSlotBet(card);
                return;
            }

            if (multiplier) {
                card.dataset.multiplier = multiplier.dataset.slotMultiplier;
                card.querySelectorAll("[data-slot-multiplier]").forEach((button) => button.classList.toggle("is-selected", button === multiplier));
                updateSlotBet(card);
                return;
            }

            if (!spin || spin.disabled) return;

            const slot = slotById(card.dataset.slotMachine);
            const reels = card.querySelector("[data-slot-reels]");
            const status = card.querySelector("[data-slot-status]");
            if (!slot || !reels || !status) return;

            const bet = slotBet(card);
            if (readBalance() < bet) {
                status.textContent = `Insufficient balance. The machine is asking for ${money(bet)}.`;
                return;
            }

            adjustBalance(-bet);
            const currentGrid = readSlotGrid(card, slot);
            const finalGrid = makeSlotGrid(slot, { allowBonusTrigger: true });
            const metrics = slotReelMetrics(reels);
            spin.disabled = true;
            card.classList.add("is-spinning");
            reels.classList.add("is-rolling");
            reels.innerHTML = slotRollMarkup(slot, currentGrid, finalGrid, metrics);
            status.textContent = `Accepted ${money(bet)}. Reels are checking the account.`;

            window.setTimeout(() => {
                const result = evaluateSlot(slot, finalGrid, bet);
                reels.classList.remove("is-rolling");
                reels.innerHTML = slotGridMarkup(finalGrid, { locked: result.bonusPositions });
                card.classList.remove("is-spinning");

                if (result.payout > 0) {
                    adjustBalance(result.payout);
                    status.textContent = `${money(result.payout)} returned. ${result.hits.join(" / ")}.`;
                } else if (result.bonusLines === 0) {
                    status.textContent = "No payable line was observed. The coin remains filed.";
                }

                const normalHistory = {
                    slot: slot.id,
                    at: new Date().toISOString(),
                    bet,
                    payout: result.payout,
                    hits: result.hits,
                    balance: readBalance()
                };
                saveSlotHistory(normalHistory);

                if (result.bonusLines > 0) {
                    triggerBonusCue(card);
                    status.textContent = `${slot.bonusName} column locked. Activate bonus.`;
                    window.setTimeout(() => {
                        startSlotBonusRound({
                            slot,
                            card,
                            reels,
                            status,
                            spin,
                            bet,
                            lockedPositions: result.bonusPositions,
                            initialGrid: finalGrid
                        });
                    }, 1250);
                    return;
                }

                spin.disabled = false;
            }, slotRollSettleMs());
        });
    }

    function renderRecordPage() {
        const container = document.getElementById("local-record");
        if (!container) return;

        let receipt = null;
        try {
            receipt = JSON.parse(localStorage.getItem(RECEIPT_KEY) || "null");
        } catch (_error) {
            receipt = null;
        }

        if (!receipt || !Array.isArray(receipt.items)) return;
        const choices = receipt.choices || {};

        const items = receipt.items.map((item) => {
            const lineName = item.size ? `${item.name} / ${item.size}` : item.name;
            return `
            <div class="receipt-line">
                <span><strong>${lineName}</strong><br>${item.qty} x ${money(item.price)}</span>
                <span>${money(item.qty * item.price)}</span>
            </div>
        `;
        }).join("");

        container.innerHTML = `
            <article class="receipt">
                <p class="eyebrow">RECORD LOCATED</p>
                <h2>${receipt.status}</h2>
                <div class="record-meta">
                    <div><span>Order</span><strong>${receipt.orderNumber}</strong></div>
                    <div><span>Time</span><strong>${receipt.timestamp}</strong></div>
                    <div><span>Notice</span><strong>${choices.notice || "Browser receipt"}</strong></div>
                    <div><span>Fulfillment</span><strong>${choices.fulfillment || "Weather hold"}</strong></div>
                </div>
                <div class="receipt-items">${items}</div>
                <div class="receipt-total"><span>Recorded subtotal</span><strong>${money(receipt.subtotal)}</strong></div>
                <p>This record remains local to the browser that completed the filing.</p>
                <div class="record-actions">
                    <button class="button button--primary" type="button" id="print-local-record">Print record</button>
                    <a class="button button--secondary" href="shop.html">Return to shop</a>
                </div>
            </article>
        `;

        document.getElementById("print-local-record")?.addEventListener("click", () => window.print());
    }

    function initInfiniteGallery() {
        const grid = document.getElementById("gallery-grid");
        const sentinel = document.getElementById("gallery-sentinel");
        const viewer = document.getElementById("image-viewer");
        const close = document.getElementById("image-viewer-close");

        if (!grid || !sentinel || !viewer || !close) return;

        const batchSize = 18;
        let issued = 0;
        let loading = false;

        function renderBatch() {
            if (loading) return;
            loading = true;

            const fragment = document.createDocumentFragment();
            for (let index = 0; index < batchSize; index += 1) {
                issued += 1;
                const figure = document.createElement("figure");
                figure.className = "gallery-item";

                const button = document.createElement("button");
                button.type = "button";
                button.dataset.expandGallery = "never.png";
                button.setAttribute("aria-label", `Expand DOG DAYS notice ${issued}`);

                const img = document.createElement("img");
                img.src = "never.png";
                img.width = 959;
                img.height = 1494;
                img.loading = issued <= 6 ? "eager" : "lazy";
                img.decoding = "async";
                img.alt = "DOG DAYS poster reading You Will Never Understand";

                button.appendChild(img);
                figure.appendChild(button);
                fragment.appendChild(figure);
            }

            grid.appendChild(fragment);
            sentinel.querySelector("span").textContent = `MORE NOTICES PENDING / ${issued} OBSERVED`;
            loading = false;
        }

        function closeViewer() {
            viewer.hidden = true;
            document.body.classList.remove("modal-open");
        }

        grid.addEventListener("click", (event) => {
            const button = event.target.closest("[data-expand-gallery]");
            if (!button) return;
            viewer.hidden = false;
            document.body.classList.add("modal-open");
            close.focus();
        });

        close.addEventListener("click", closeViewer);
        viewer.addEventListener("click", (event) => {
            if (event.target === viewer) closeViewer();
        });
        document.addEventListener("keydown", (event) => {
            if (event.key === "Escape" && !viewer.hidden) closeViewer();
        });

        if ("IntersectionObserver" in window) {
            const observer = new IntersectionObserver((entries) => {
                if (entries.some((entry) => entry.isIntersecting)) {
                    renderBatch();
                }
            }, { rootMargin: "900px 0px" });
            observer.observe(sentinel);
        } else {
            window.addEventListener("scroll", () => {
                const remaining = document.documentElement.scrollHeight - window.innerHeight - window.scrollY;
                if (remaining < 1200) renderBatch();
            }, { passive: true });
        }

        renderBatch();
        renderBatch();
    }

    function initConsoleArtifact() {
        if (sessionStorage.getItem("dogdays:console-notice")) return;
        sessionStorage.setItem("dogdays:console-notice", "observed");
        console.info("DOG DAYS: no further action is available.");
    }

    document.addEventListener("DOMContentLoaded", () => {
        initBalanceStrip();
        renderBalance();
        renderProducts();
        initCartControls();
        initProductRecordControls();
        renderCart();
        initCheckout();
        initSlotMachines();
        renderRecordPage();
        initInfiniteGallery();
        initConsoleArtifact();
    });
})();
