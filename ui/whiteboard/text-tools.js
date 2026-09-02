import {
    loadFontsCatalog,
    parseSavedFont,
    toFontFamilyValue,
} from "../reuse/font-resources.js";
import { getTextBoxDimensions } from "./elements.js";

export function getCurrentAppFont() {
    const value = getComputedStyle(document.documentElement)
        .getPropertyValue("--app-font")
        .trim();
    return parseSavedFont(value);
}

export function createWhiteboardTextTools({
    canvasElement,
    commitElements,
    currentAppFont,
    getElements,
    getTextFormatMenu,
    getTextElement,
    positionTextOverlay,
    selectOnlyElement,
    setTextFormatMenu,
    updateTransientElement,
}) {
    let fontCatalogPromise = null;

    function updateTextStyle(elementId, patch) {
        commitElements(
            getElements().map((item) => {
                if (item.id !== elementId) return item;
                const nextItem = {
                    ...item,
                    ...patch,
                    version: (item.version || 1) + 1,
                };
                if (patch.fontSize !== undefined) {
                    const scale =
                        patch.fontSize / Math.max(1, item.fontSize ?? 28);
                    nextItem.width = Math.max(1, (item.width ?? 1) * scale);
                    nextItem.height = Math.max(1, (item.height ?? 1) * scale);
                }
                return nextItem;
            }),
        );
    }

    function loadTextMenuFonts(select, selectedFont) {
        if (!fontCatalogPromise) {
            fontCatalogPromise = loadFontsCatalog().catch(() => [
                currentAppFont(),
                "Inter",
                "Arial",
                "sans-serif",
            ]);
        }
        void fontCatalogPromise.then((fonts) => {
            if (!select.isConnected) return;
            const options = Array.from(
                new Set([selectedFont, ...fonts]),
            ).filter(Boolean);
            select.replaceChildren(
                ...options.map((font) => {
                    const option = document.createElement("option");
                    option.value = font;
                    option.textContent = font;
                    option.style.fontFamily = `${toFontFamilyValue(font)}, Arial, sans-serif`;
                    if (font === selectedFont) option.selected = true;
                    return option;
                }),
            );
        });
    }

    function syncTextFormatMenu() {
        const element = getTextElement();
        if (!element) {
            getTextFormatMenu()?.remove();
            setTextFormatMenu(null);
            return;
        }
        const parent = canvasElement.parentElement;
        if (!parent) return;
        let textFormatMenu = getTextFormatMenu();
        if (!textFormatMenu?.isConnected) {
            textFormatMenu = document.createElement("div");
            textFormatMenu.className = "whiteboard-text-menu";
            textFormatMenu.innerHTML = `
        <button type="button" data-text-toggle="bold" aria-label="Bold">B</button>
        <button type="button" data-text-toggle="italic" aria-label="Italic"><em>I</em></button>
        <button type="button" data-text-toggle="underline" aria-label="Underline"><u>U</u></button>
        <button type="button" data-text-toggle="line-through" aria-label="Strikethrough"><s>S</s></button>
        <input type="number" min="8" max="96" step="1" data-text-size aria-label="Font size" />
        <select data-text-font aria-label="Font family"></select>
      `;
            parent.appendChild(textFormatMenu);
            bindTextMenuEvents(textFormatMenu, updateTextStyle, getTextElement);
            setTextFormatMenu(textFormatMenu);
        }
        positionTextOverlay(textFormatMenu, element, -48);
        const sizeInput = textFormatMenu.querySelector("[data-text-size]");
        if (sizeInput) sizeInput.value = String(element.fontSize ?? 28);
        const fontSelect = textFormatMenu.querySelector("[data-text-font]");
        const selectedFont = parseSavedFont(
            element.fontFamily || currentAppFont(),
        );
        if (fontSelect) loadTextMenuFonts(fontSelect, selectedFont);
        syncTextMenuToggleStates(textFormatMenu, element);
    }

    function updateTextElement(element, text, dimensions = {}) {
        const nextText = text.trim() || "Text";
        const fontSize = element.fontSize ?? 28;
        const width =
            dimensions.width ??
            Math.max(160, nextText.length * fontSize * 0.62);
        const height = dimensions.height ?? Math.max(56, fontSize * 1.8);
        commitElements(
            getElements().map((item) =>
                item.id === element.id
                    ? {
                          ...item,
                          text: nextText,
                          width,
                          height,
                          fontSize: dimensions.fontSize ?? item.fontSize,
                          autoSize: dimensions.autoSize ?? item.autoSize,
                          version: (item.version || 1) + 1,
                      }
                    : item,
            ),
        );
        selectOnlyElement(element.id);
    }

    function openTextEditor(element) {
        const parent = canvasElement.parentElement;
        if (!parent) return;
        parent.querySelector(".wb-text-editor")?.remove();
        const editor = document.createElement("textarea");
        editor.className = "wb-text-editor whiteboard-text-editor";
        editor.value = element.text ?? "Text";
        positionTextOverlay(editor, element);
        editor.style.width = `${Math.max(1, element.width ?? 180)}px`;
        editor.style.height = `${Math.max(1, element.height ?? 64)}px`;
        editor.style.fontSize = `${element.fontSize ?? 28}px`;
        editor.style.fontFamily = `${element.fontFamily || toFontFamilyValue(currentAppFont())}, Arial, sans-serif`;
        editor.style.fontWeight = element.fontWeight === "700" ? "700" : "400";
        editor.style.fontStyle =
            element.fontStyle === "italic" ? "italic" : "normal";
        editor.style.textDecoration = element.textDecoration ?? "none";
        parent.appendChild(editor);
        const measurementContext = canvasElement.getContext("2d");
        let automaticallySized = element.autoSize !== false;
        let expectedWidth = editor.offsetWidth;
        let expectedHeight = editor.offsetHeight;
        let previousHeight = expectedHeight;
        let previousFontSize = element.fontSize ?? 28;

        function fitEditorToText() {
            if (!measurementContext) return;
            measurementContext.font = `${editor.style.fontStyle} ${editor.style.fontWeight} ${editor.style.fontSize} ${editor.style.fontFamily}`;
            const dimensions = getTextBoxDimensions(
                editor.value,
                Number.parseFloat(editor.style.fontSize),
                (line) => measurementContext.measureText(line).width,
            );
            editor.style.width = `${dimensions.width}px`;
            editor.style.height = `${dimensions.height}px`;
            expectedWidth = dimensions.width;
            expectedHeight = dimensions.height;
            previousHeight = dimensions.height;
            updateTransientElement?.(element.id, {
                text: editor.value,
                ...dimensions,
                autoSize: true,
            });
        }

        if (automaticallySized) fitEditorToText();
        const editorResizeObserver = new ResizeObserver(() => {
            const width = editor.offsetWidth;
            const height = editor.offsetHeight;
            if (width === expectedWidth && height === expectedHeight) return;
            automaticallySized = false;
            const fontSize =
                previousFontSize * (height / Math.max(1, previousHeight));
            editor.style.fontSize = `${fontSize}px`;
            expectedWidth = width;
            expectedHeight = height;
            previousHeight = height;
            previousFontSize = fontSize;
            updateTransientElement?.(element.id, {
                width,
                height,
                fontSize,
                autoSize: false,
            });
        });
        editorResizeObserver.observe(editor);
        editor.focus();
        editor.select();
        editor.addEventListener("input", () => {
            if (automaticallySized) {
                fitEditorToText();
            } else {
                updateTransientElement?.(element.id, { text: editor.value });
            }
        });
        let finished = false;
        const finish = () => {
            if (finished) return;
            finished = true;
            const value = editor.value;
            const dimensions = {
                width: editor.offsetWidth,
                height: editor.offsetHeight,
                fontSize: Number.parseFloat(editor.style.fontSize),
                autoSize: automaticallySized,
            };
            editorResizeObserver.disconnect();
            editor.parentNode?.removeChild(editor);
            updateTextElement(element, value, dimensions);
        };
        editor.addEventListener("blur", finish, { once: true });
        editor.addEventListener("keydown", (event) => {
            if (event.key === "Escape") {
                finished = true;
                editorResizeObserver.disconnect();
                editor.parentNode?.removeChild(editor);
                selectOnlyElement(element.id);
            } else if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                finish();
            }
        });
    }

    return { openTextEditor, syncTextFormatMenu, updateTextElement };
}

function bindTextMenuEvents(textFormatMenu, updateTextStyle, getTextElement) {
    textFormatMenu.addEventListener("click", (event) => {
        const button = event.target.closest("[data-text-toggle]");
        const target = getTextElement();
        if (!button || !target) return;
        const toggle = button.dataset.textToggle;
        if (toggle === "bold") {
            updateTextStyle(target.id, {
                fontWeight: target.fontWeight === "700" ? "400" : "700",
            });
        } else if (toggle === "italic") {
            updateTextStyle(target.id, {
                fontStyle: target.fontStyle === "italic" ? "normal" : "italic",
            });
        } else {
            const parts = new Set(
                String(target.textDecoration ?? "none")
                    .split(" ")
                    .filter((item) => item && item !== "none"),
            );
            if (parts.has(toggle)) parts.delete(toggle);
            else parts.add(toggle);
            updateTextStyle(target.id, {
                textDecoration: parts.size ? [...parts].join(" ") : "none",
            });
        }
    });
    textFormatMenu
        .querySelector("[data-text-size]")
        ?.addEventListener("change", (event) => {
            const target = getTextElement();
            if (!target) return;
            updateTextStyle(target.id, {
                fontSize: Math.max(
                    8,
                    Math.min(96, Number(event.target.value) || 28),
                ),
            });
        });
    textFormatMenu
        .querySelector("[data-text-font]")
        ?.addEventListener("change", (event) => {
            const target = getTextElement();
            if (!target) return;
            updateTextStyle(target.id, {
                fontFamily: `${toFontFamilyValue(event.target.value)}, Arial, sans-serif`,
            });
        });
}

function syncTextMenuToggleStates(textFormatMenu, element) {
    textFormatMenu
        .querySelector('[data-text-toggle="bold"]')
        ?.classList.toggle("active", element.fontWeight === "700");
    textFormatMenu
        .querySelector('[data-text-toggle="italic"]')
        ?.classList.toggle("active", element.fontStyle === "italic");
    const decoration = String(element.textDecoration ?? "none");
    textFormatMenu
        .querySelector('[data-text-toggle="underline"]')
        ?.classList.toggle("active", decoration.includes("underline"));
    textFormatMenu
        .querySelector('[data-text-toggle="line-through"]')
        ?.classList.toggle("active", decoration.includes("line-through"));
}
