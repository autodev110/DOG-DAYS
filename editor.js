(function () {
    "use strict";

    const ACTIVE_KEY = "dogdays:editorActive";
    const DRAFTS_KEY = "dogdays:editorDrafts";
    const HISTORY_KEY = "dogdays:editorHistory";
    const BACKUP_KEY = "dogdays:editorBackup";
    const params = new URLSearchParams(window.location.search);
    const requestedOn = params.get("edit") === "1" || params.get("dd-edit") === "1";
    const requestedOff = params.get("edit") === "0" || params.get("dd-edit") === "0";

    if (requestedOn) localStorage.setItem(ACTIVE_KEY, "true");
    if (requestedOff) localStorage.removeItem(ACTIVE_KEY);

    document.addEventListener("keydown", (event) => {
        if (!(event.metaKey || event.ctrlKey) || !event.shiftKey || event.key.toLowerCase() !== "e") return;
        event.preventDefault();
        if (localStorage.getItem(ACTIVE_KEY) === "true") {
            localStorage.removeItem(ACTIVE_KEY);
        } else {
            localStorage.setItem(ACTIVE_KEY, "true");
        }
        window.location.reload();
    });

    if (localStorage.getItem(ACTIVE_KEY) !== "true") return;

    const pageKey = window.location.pathname.split("/").pop() || "index.html";
    let activeElement = null;
    let saveTimer = null;
    let mutationTimer = null;

    function readJSON(key, fallback) {
        try {
            return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback));
        } catch (_error) {
            return fallback;
        }
    }

    function writeJSON(key, value) {
        localStorage.setItem(key, JSON.stringify(value));
        if (key === DRAFTS_KEY) sessionStorage.setItem(BACKUP_KEY, JSON.stringify(value));
    }

    function exportPayload() {
        return {
            exportedAt: new Date().toISOString(),
            page: pageKey,
            drafts: readJSON(DRAFTS_KEY, {}),
            history: readJSON(HISTORY_KEY, {})
        };
    }

    function editableCandidates() {
        return Array.from(document.querySelectorAll([
            "main h1",
            "main h2",
            "main h3",
            "main p",
            "main li",
            "main a",
            "main button",
            "main strong",
            "main span",
            "footer p",
            "footer a",
            "header nav a"
        ].join(",")));
    }

    function shouldSkip(element) {
        if (!element || element.closest(".dd-editor-toolbar, .dd-editor-copybox")) return true;
        if (element.closest(".product-art, .slot-reels, .roulette-wheel, .balance-strip, .cart-items, .checkout-review, .receipt, .image-viewer")) return true;
        if (element.matches("input, textarea, select, option, [aria-hidden='true']")) return true;
        if (element.children.length > 0 && element.innerText.trim().length === 0) return true;
        if (element.innerText.trim().length === 0) return true;
        return false;
    }

    function setPlaintextEditable(element) {
        element.setAttribute("contenteditable", "plaintext-only");
        if (element.contentEditable !== "plaintext-only") {
            element.setAttribute("contenteditable", "true");
        }
        element.setAttribute("spellcheck", "true");
    }

    function assignKeys() {
        let index = 0;
        editableCandidates().forEach((element) => {
            if (shouldSkip(element)) return;
            if (!element.dataset.ddEdit) {
                element.dataset.ddEdit = `auto:${pageKey}:${element.tagName.toLowerCase()}:${index}`;
            }
            index += 1;
        });
    }

    function applyDrafts() {
        const drafts = readJSON(DRAFTS_KEY, {});
        document.querySelectorAll("[data-dd-edit]").forEach((element) => {
            if (shouldSkip(element)) return;
            const key = element.dataset.ddEdit;
            if (!element.dataset.ddOriginal) element.dataset.ddOriginal = element.innerText;
            if (drafts[key] && typeof drafts[key].value === "string" && element.innerText !== drafts[key].value) {
                element.innerText = drafts[key].value;
                element.classList.add("dd-editor-dirty");
            }
            setPlaintextEditable(element);
        });
    }

    function updateStatus(message) {
        const status = document.getElementById("dd-editor-status");
        if (status) status.textContent = message;
    }

    function rememberHistory(element, previousValue) {
        const key = element.dataset.ddEdit;
        const history = readJSON(HISTORY_KEY, {});
        const list = Array.isArray(history[key]) ? history[key] : [];
        if (list[0]?.value !== previousValue) {
            list.unshift({
                value: previousValue,
                at: new Date().toISOString(),
                page: pageKey
            });
        }
        history[key] = list.slice(0, 20);
        writeJSON(HISTORY_KEY, history);
    }

    function saveElement(element) {
        if (!element?.dataset?.ddEdit) return;
        const key = element.dataset.ddEdit;
        const drafts = readJSON(DRAFTS_KEY, {});
        const original = element.dataset.ddOriginal || "";
        const value = element.innerText;

        if (!drafts[key]) rememberHistory(element, original);

        if (value === original) {
            delete drafts[key];
            element.classList.remove("dd-editor-dirty");
        } else {
            drafts[key] = {
                value,
                original,
                page: pageKey,
                selector: key,
                updatedAt: new Date().toISOString()
            };
            element.classList.add("dd-editor-dirty");
        }

        writeJSON(DRAFTS_KEY, drafts);
        updateStatus(`Saved locally / ${Object.keys(drafts).length} edited fields`);
    }

    function scheduleSave(element) {
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(() => saveElement(element), 180);
    }

    function revertActive() {
        if (!activeElement) {
            updateStatus("No active field selected.");
            return;
        }
        const drafts = readJSON(DRAFTS_KEY, {});
        delete drafts[activeElement.dataset.ddEdit];
        activeElement.innerText = activeElement.dataset.ddOriginal || "";
        activeElement.classList.remove("dd-editor-dirty");
        writeJSON(DRAFTS_KEY, drafts);
        updateStatus("Field restored to page copy.");
    }

    function clearPageDrafts() {
        if (!window.confirm("Clear local edits for this page?")) return;
        const drafts = readJSON(DRAFTS_KEY, {});
        Object.keys(drafts).forEach((key) => {
            if (drafts[key]?.page === pageKey) delete drafts[key];
        });
        writeJSON(DRAFTS_KEY, drafts);
        window.location.reload();
    }

    function clearAllDrafts() {
        if (!window.confirm("Clear all DOG DAYS local edits from this browser?")) return;
        localStorage.removeItem(DRAFTS_KEY);
        localStorage.removeItem(HISTORY_KEY);
        sessionStorage.removeItem(BACKUP_KEY);
        window.location.reload();
    }

    function copyExport() {
        const text = JSON.stringify(exportPayload(), null, 2);
        if (navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(text).then(() => updateStatus("Export copied to clipboard.")).catch(() => showCopyBox(text));
            return;
        }
        showCopyBox(text);
    }

    function showCopyBox(text) {
        let box = document.getElementById("dd-editor-copybox");
        if (!box) {
            box = document.createElement("div");
            box.className = "dd-editor-copybox";
            box.id = "dd-editor-copybox";
            box.innerHTML = `
                <strong>Copy DOG DAYS edits</strong>
                <textarea readonly></textarea>
                <button type="button">Close</button>
            `;
            document.body.appendChild(box);
            box.querySelector("button").addEventListener("click", () => {
                box.hidden = true;
            });
        }
        box.hidden = false;
        const textarea = box.querySelector("textarea");
        textarea.value = text;
        textarea.focus();
        textarea.select();
        updateStatus("Clipboard unavailable. Copy from the export box.");
    }

    function downloadExport() {
        const blob = new Blob([JSON.stringify(exportPayload(), null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `dog-days-edits-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        updateStatus("Downloaded local edit export.");
    }

    function exitEditor() {
        localStorage.removeItem(ACTIVE_KEY);
        params.delete("edit");
        params.delete("dd-edit");
        const query = params.toString();
        window.location.href = `${window.location.pathname}${query ? `?${query}` : ""}${window.location.hash}`;
    }

    function buildToolbar() {
        const toolbar = document.createElement("div");
        toolbar.className = "dd-editor-toolbar";
        toolbar.innerHTML = `
            <strong>DD Edit</strong>
            <span id="dd-editor-status">Editing locally. Drafts are autosaved in this browser.</span>
            <button type="button" data-dd-editor-action="revert">Revert field</button>
            <button type="button" data-dd-editor-action="copy">Copy export</button>
            <button type="button" data-dd-editor-action="download">Download export</button>
            <button type="button" data-dd-editor-action="clear-page">Clear page</button>
            <button type="button" data-dd-editor-action="clear-all">Clear all</button>
            <button type="button" data-dd-editor-action="exit">Exit</button>
        `;
        toolbar.addEventListener("click", (event) => {
            const action = event.target.closest("[data-dd-editor-action]")?.dataset.ddEditorAction;
            if (action === "revert") revertActive();
            if (action === "copy") copyExport();
            if (action === "download") downloadExport();
            if (action === "clear-page") clearPageDrafts();
            if (action === "clear-all") clearAllDrafts();
            if (action === "exit") exitEditor();
        });
        document.body.appendChild(toolbar);
    }

    function refreshEditableFields() {
        assignKeys();
        applyDrafts();
    }

    document.addEventListener("DOMContentLoaded", () => {
        document.body.classList.add("dd-editor-active");
        buildToolbar();
        refreshEditableFields();

        document.addEventListener("focusin", (event) => {
            const editable = event.target.closest("[data-dd-edit]");
            if (!editable || shouldSkip(editable)) return;
            activeElement = editable;
            updateStatus(`Editing ${editable.dataset.ddEdit}`);
        });

        document.addEventListener("beforeinput", (event) => {
            if (event.target.closest("[data-dd-edit]")) event.stopPropagation();
        }, true);

        document.addEventListener("click", (event) => {
            if (event.target.closest("[data-dd-edit]")) {
                event.preventDefault();
                event.stopPropagation();
            }
        }, true);

        document.addEventListener("input", (event) => {
            const editable = event.target.closest("[data-dd-edit]");
            if (!editable || shouldSkip(editable)) return;
            scheduleSave(editable);
        }, true);

        const observer = new MutationObserver(() => {
            window.clearTimeout(mutationTimer);
            mutationTimer = window.setTimeout(refreshEditableFields, 120);
        });
        observer.observe(document.body, { childList: true, subtree: true });
    });
})();
