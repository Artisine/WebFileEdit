import { isNullish, isString } from "../utility.js";
import { setCursorOffsetCharactersFromEnd, setCursorToEnd } from "../utility/textcursors/cursors.js";
import { milliseconds } from "../utility/timings.js";
export class TextStuff {
    static OnceInit() {
        main();
        print(`[TextStuff] OnceInit()`);
        return;
    }
}
;
const print = console.log;
const inputTypesAndTheirAssociatedHandlerFunctions = {
    "insertParagraph": when_newParagraph,
    "insertLineBreak": when_newLineBreak,
    "deleteContentBackward": when_deleteContentBackward,
    "deleteWordBackward": when_deleteWordBackward,
    "deleteContentForward": when_deleteContentForward,
    "deleteWordForward": when_deleteWordForward,
    "insertText": when_insertText,
    "deleteByDrag": when_deleteByDrag,
    "insertFromDrop": when_insertFromDrop,
    "historyUndo": when_historyUndo,
    "historyRedo": when_historyRedo,
    "deleteByCut": when_deleteByCut,
    "insertFromPaste": when_insertFromPaste,
};
function addListenersToEditable(editable) {
    // check if editable has tag
    if (editable.getAttribute("data-has-listeners") === "true") {
        // if it does, return
        return;
    }
    // add a data-tag onto editable to say it has listeners
    editable.setAttribute("data-has-listeners", "true");
    editable.addEventListener("input", function (_evt) {
        const evt = _evt;
        for (const inputType in inputTypesAndTheirAssociatedHandlerFunctions) {
            if (evt.inputType === inputType) {
                const handler = inputTypesAndTheirAssociatedHandlerFunctions[inputType];
                if (!handler)
                    break;
                handler(editable, evt);
                return;
            }
        }
        print(`Unhandled inputType: ${evt.inputType} detected on: `, editable, evt);
    });
    editable.addEventListener("keydown", function (_evt) {
        const evt = _evt;
        when_keyStateChange(editable, evt, "down");
    });
}
;
const durationDeletionAttemptWaiting = milliseconds(700);
const deferredTimeouts = new Map();
function makeNewTimeout(editable, timeoutMs, callback) {
    var _a;
    const timeouts = (_a = deferredTimeouts.get(editable)) !== null && _a !== void 0 ? _a : [];
    const id = window.setTimeout(() => {
        callback();
        cleanupTimeout(editable, id);
    }, timeoutMs);
    timeouts.push(id);
    deferredTimeouts.set(editable, timeouts);
    return id;
}
;
function cleanupTimeout(editable, id) {
    const timeouts = deferredTimeouts.get(editable);
    if (timeouts) {
        const index = timeouts.indexOf(id);
        if (index !== -1) {
            timeouts.splice(index, 1);
        }
        const length = timeouts.length;
        if (length === 0) {
            deferredTimeouts.delete(editable);
        }
        else {
            deferredTimeouts.set(editable, timeouts);
        }
    }
    // re-assign to map
    return;
}
;
function makeNewTextEditable(originEditable) {
    const newEditable = document.createElement("p");
    newEditable.classList.add("text");
    newEditable.setAttribute("contenteditable", "true");
    newEditable.textContent = "";
    // place newEditable right after originEditable
    originEditable.after(newEditable);
    print(`New editable created: `, newEditable, originEditable);
    addListenersToEditable(newEditable);
    editableTapDeletionCountAttribute(newEditable, 1);
    return newEditable;
}
;
function removeTrailingNewlineCharacter(editable) {
    const text = editable.textContent;
    if (text && text[text.length - 1] === "\n") {
        editable.textContent = text.slice(0, -1);
    }
    return editable;
}
;
function removeTrailingBrTag(editable) {
    const lastChild = editable.lastChild;
    if (lastChild instanceof HTMLBRElement) {
        editable.removeChild(lastChild);
    }
    return editable;
}
;
function editableTapDeletionCountAttribute(editable, count) {
    if (isNullish(count)) {
        return editable.getAttribute("data-attempt-delete-count");
    }
    else {
        if (count <= 0) {
            editable.removeAttribute("data-attempt-delete-count");
        }
        else {
            editable.setAttribute("data-attempt-delete-count", count.toString());
        }
        return count;
    }
}
;
function when_keyStateChange(editable, keyEvent, state) {
    print(`Key state change detected: `, editable, keyEvent, state);
    if (state === "down") {
        if (keyEvent.key === "Backspace") {
            print("Backspace!");
            attempt_editable_deletion(editable, keyEvent);
        }
    }
    return;
}
;
function when_newParagraph(editable, inputEvent) {
    print(`New paragraph detected: `, editable, inputEvent);
    const newEditable = makeNewTextEditable(editable);
    inputEvent.preventDefault();
    removeTrailingNewlineCharacter(editable);
    removeTrailingBrTag(editable);
    newEditable.focus();
}
;
function when_newLineBreak(editable, inputEvent) {
    print(`New line break detected: `, editable, inputEvent);
}
;
function when_deleteContentBackward(editable, inputEvent) {
    print(`Delete content backward detected: `, editable, inputEvent);
    attempt_editable_deletion(editable, inputEvent);
    return;
}
;
function when_deleteWordBackward(editable, inputEvent) {
    print(`Delete word backward detected: `, editable, inputEvent);
}
;
function when_deleteContentForward(editable, inputEvent) {
    print(`Delete content forward detected: `, editable, inputEvent);
}
;
function when_deleteWordForward(editable, inputEvent) {
    print(`Delete word forward detected: `, editable, inputEvent);
}
;
function when_insertText(editable, inputEvent) {
    print(`Insert text detected: `, editable, inputEvent);
    return collate_when_contentInserted(editable, inputEvent);
}
;
function when_deleteByDrag(editable, inputEvent) {
    print(`Delete by drag detected: `, editable, inputEvent);
}
;
function when_insertFromDrop(editable, inputEvent) {
    print(`Insert from drop detected: `, editable, inputEvent);
}
;
function when_historyUndo(editable, inputEvent) {
    print(`History undo detected: `, editable, inputEvent);
}
;
function when_historyRedo(editable, inputEvent) {
    print(`History redo detected: `, editable, inputEvent);
}
;
function when_deleteByCut(editable, inputEvent) {
    print(`Delete by cut detected: `, editable, inputEvent);
}
;
function when_insertFromPaste(editable, inputEvent) {
    print(`Insert from paste detected: `, editable, inputEvent);
    return collate_when_contentInserted(editable, inputEvent);
}
;
function attempt_editable_deletion(editable, evt) {
    var _a, _b;
    const text = editable.textContent;
    editable.setAttribute("data-old-length", (_a = text === null || text === void 0 ? void 0 : text.length.toString()) !== null && _a !== void 0 ? _a : "0");
    if ((text === null || text === void 0 ? void 0 : text.length) === 0) {
        // see if this editable has an attribute "data-attempt-delete-count"
        // if it does, increment it by 1. if >= 1, remove the attribute and remove the editable
        // if it does not, set it to 1
        const attemptDeleteCount = editableTapDeletionCountAttribute(editable);
        if (!isNullish(attemptDeleteCount) && isString(attemptDeleteCount)) {
            const count = parseInt(attemptDeleteCount);
            const old_count = parseInt((_b = editable.getAttribute("data-old-length")) !== null && _b !== void 0 ? _b : "0");
            if (count >= 2 && old_count >= text.length) {
                editableTapDeletionCountAttribute(editable, 0);
                const previousEditable = editable.previousElementSibling;
                editable.remove();
                // get previous element in heirachy
                // focus on that
                if (previousEditable instanceof HTMLElement) {
                    previousEditable.focus();
                    // and set cursor to end of text
                    setCursorToEnd(previousEditable);
                    evt.preventDefault();
                }
                print(`Editable removed: `, editable);
            }
            else {
                editable.classList.add("flash-red");
                editableTapDeletionCountAttribute(editable, count + 1);
                makeNewTimeout(editable, durationDeletionAttemptWaiting, () => {
                    editable.classList.remove("flash-red");
                    editableTapDeletionCountAttribute(editable, count);
                });
            }
        }
        else {
            // editable.classList.add("flash-red");
            editableTapDeletionCountAttribute(editable, 1);
        }
    }
    else {
        print(`Editable not empty: `, editable);
        // where length >= 1
        // check if cursor is at very beginning
        const selection = window.getSelection();
        const range = selection === null || selection === void 0 ? void 0 : selection.getRangeAt(0);
        const startContainer = range === null || range === void 0 ? void 0 : range.startContainer;
        const startOffset = range === null || range === void 0 ? void 0 : range.startOffset;
        const previousEditable = editable.previousElementSibling;
        const shouldAppendToPreviousParagraph = ((startContainer === null || startContainer === void 0 ? void 0 : startContainer.parentElement) === editable
            && startOffset === 0
            && previousEditable instanceof HTMLElement
            && !isNullish(previousEditable.textContent)
            && !isNullish(text));
        print(`startcontainer: `, startContainer, `startOffset: `, startOffset, `previousEditable: `, previousEditable, `shouldAppendToPreviousParagraph: `, shouldAppendToPreviousParagraph);
        print(`Should append to previous paragraph: `, shouldAppendToPreviousParagraph, previousEditable);
        if (shouldAppendToPreviousParagraph) {
            editable.blur();
            const originalLength = text.length;
            previousEditable.textContent += text;
            editable.remove();
            previousEditable.focus();
            // and set cursor to end of text
            // setCursorToEnd(previousEditable);
            setCursorOffsetCharactersFromEnd(previousEditable, originalLength);
            evt.preventDefault();
        }
    }
    return;
}
;
function collate_when_contentInserted(editable, inputEvent) {
    var _a;
    const text = editable.textContent;
    if ((text === null || text === void 0 ? void 0 : text.length) === 0) {
        // if the text is empty, and there is a newline character at the end of the editable, remove it
        removeTrailingNewlineCharacter(editable);
    }
    if (!isNullish(text === null || text === void 0 ? void 0 : text.length) && text.length > 0) {
        // if editable has data-tag "data-attempt-delete-count", remove it
        editableTapDeletionCountAttribute(editable, 0);
        editable.setAttribute("data-old-length", (_a = text === null || text === void 0 ? void 0 : text.length.toString()) !== null && _a !== void 0 ? _a : "0");
    }
    return;
}
;
function main() {
    const holder = document.querySelector("div[name='holder']");
    console.log(holder);
    const textEditables = holder.querySelectorAll("p.text");
    textEditables.forEach((elem) => {
        elem.setAttribute("contenteditable", "true");
        elem = elem;
        addListenersToEditable(elem);
        // editableTapDeletionCountAttribute(elem, 1);
        print(`Editable: `, elem);
    });
    console.log("End of main.");
}
;
console.info("End of textstuff.ts");
// End of File;
