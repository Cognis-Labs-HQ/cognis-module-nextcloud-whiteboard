import { reuse } from "./host-resources.js";

const { loadFontsCatalog, parseSavedFont, toFontFamilyValue } =
    await reuse.importModule("font-prefs.js");

export { loadFontsCatalog, parseSavedFont, toFontFamilyValue };
