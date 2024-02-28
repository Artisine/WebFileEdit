import { isNullish } from "../../utility.js";
export function setCursorToEnd(editable) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(editable);
    range.collapse(false);
    selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
    selection === null || selection === void 0 ? void 0 : selection.addRange(range);
    return editable;
}
;
export function setCursorToBeginning(editable) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.selectNodeContents(editable);
    range.collapse(true);
    selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
    selection === null || selection === void 0 ? void 0 : selection.addRange(range);
    return editable;
}
;
export function setCursorOffsetCharactersFromBeginning(editable, offsetCharacters) {
    const range = document.createRange();
    const selection = window.getSelection();
    range.setStart(editable, offsetCharacters);
    range.collapse(true);
    selection === null || selection === void 0 ? void 0 : selection.removeAllRanges();
    selection === null || selection === void 0 ? void 0 : selection.addRange(range);
    return editable;
}
;
export function setCursorOffsetCharactersFromEnd(editable, offsetCharacters) {
    // use the fromBeginning function
    if (isNullish(editable.textContent))
        return;
    const offset = editable.textContent.length - offsetCharacters;
    console.log(`text = ${editable.textContent} | length = ${editable.textContent.length} | offset: ${offset}`);
    setCursorOffsetCharactersFromBeginning(editable, offset);
    return editable;
}
;
// "End of File";
