import { isNullish, isString } from "../utility.js";
import { milliseconds } from "../utility/timings.js";

export class TextStuff {

	static OnceInit() {
		main();
		print(`[TextStuff] OnceInit()`);
		return;
	}
};

const print = console.log;

type T_handlerFunc = (editable: Element, inputEvent: InputEvent) => void;
const inputTypesAndTheirAssociatedHandlerFunctions: Partial<Record<InputEvent["inputType"], T_handlerFunc>> = {
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


function addListenersToEditable(editable: Element) {
	// check if editable has tag
	if (editable.getAttribute("data-has-listeners") === "true") {
		// if it does, return
		return;
	}
	// add a data-tag onto editable to say it has listeners
	editable.setAttribute("data-has-listeners", "true");
	editable.addEventListener("input", function(_evt) {
		const evt = _evt as InputEvent;
		for (const inputType in inputTypesAndTheirAssociatedHandlerFunctions) {
			if (evt.inputType === inputType) {
				const handler = inputTypesAndTheirAssociatedHandlerFunctions[inputType];
				if (!handler) break;
				handler(editable, evt);
				return;
			}
		}
		print(`Unhandled inputType: ${evt.inputType} detected on: `, editable, evt);
	});
	editable.addEventListener("keydown", function(_evt) {
		const evt = _evt as KeyboardEvent;
		when_keyStateChange(editable, evt, "down");
	});
};
const durationDeletionAttemptWaiting = milliseconds(700);
const deferredTimeouts = new Map<Element, Array<number>>();
function makeNewTimeout(editable: Element, timeoutMs: number, callback: () => unknown) {
	const timeouts = deferredTimeouts.get(editable) ?? [];
	const id = window.setTimeout(()=>{
		callback();
		cleanupTimeout(editable, id);
	}, timeoutMs);
	timeouts.push(id);
	deferredTimeouts.set(editable, timeouts);
	return id;
};
function cleanupTimeout(editable: Element, id: number) {
	const timeouts = deferredTimeouts.get(editable);
	if (timeouts) {
		const index = timeouts.indexOf(id);
		if (index !== -1) {
			timeouts.splice(index, 1);
		}
		const length = timeouts.length;
		if (length === 0) {
			deferredTimeouts.delete(editable);
		} else {
			deferredTimeouts.set(editable, timeouts);
		}
	}
	// re-assign to map
	return;
};

function makeNewTextEditable(originEditable: Element) {
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
};
function removeTrailingNewlineCharacter(editable: Element) {
	const text = editable.textContent;
	if (text && text[text.length - 1] === "\n") {
		editable.textContent = text.slice(0, -1);
	}
	return editable;
};
function removeTrailingBrTag(editable: Element) {
	const lastChild = editable.lastChild;
	if (lastChild instanceof HTMLBRElement) {
		editable.removeChild(lastChild);
	}
	return editable;
};

function editableTapDeletionCountAttribute(editable: Element, count?: number) {
	if (isNullish(count)) {
		return editable.getAttribute("data-attempt-delete-count");
	} else {
		if (count <= 0) {
			editable.removeAttribute("data-attempt-delete-count");
		} else {
			editable.setAttribute("data-attempt-delete-count", count.toString());
		}
		return count;
	}
};

function when_keyStateChange(editable: Element, keyEvent: KeyboardEvent, state: ("up"|"down")) {
	print(`Key state change detected: `, editable, keyEvent, state);
	if (state === "down") {
		if (keyEvent.key === "Backspace") {
			print("Backspace!");
			attempt_editable_deletion(editable, keyEvent);
		}
	}
	return;
};

function when_newParagraph(editable: Element, inputEvent: InputEvent) {
	print(`New paragraph detected: `, editable, inputEvent);
	const newEditable = makeNewTextEditable(editable);
	inputEvent.preventDefault();
	removeTrailingNewlineCharacter(editable);
	removeTrailingBrTag(editable);
	newEditable.focus();
};
function when_newLineBreak(editable: Element, inputEvent: InputEvent) {
	print(`New line break detected: `, editable, inputEvent);
};
function when_deleteContentBackward(editable: Element, inputEvent: InputEvent) {
	print(`Delete content backward detected: `, editable, inputEvent);

	attempt_editable_deletion(editable, inputEvent);

	return;
};
function when_deleteWordBackward(editable: Element, inputEvent: InputEvent) {
	print(`Delete word backward detected: `, editable, inputEvent);
};
function when_deleteContentForward(editable: Element, inputEvent: InputEvent) {
	print(`Delete content forward detected: `, editable, inputEvent);
};
function when_deleteWordForward(editable: Element, inputEvent: InputEvent) {
	print(`Delete word forward detected: `, editable, inputEvent);
};
function when_insertText(editable: Element, inputEvent: InputEvent) {
	print(`Insert text detected: `, editable, inputEvent);


	return collate_when_contentInserted(editable, inputEvent);
};
function when_deleteByDrag(editable: Element, inputEvent: InputEvent) {
	print(`Delete by drag detected: `, editable, inputEvent);
};
function when_insertFromDrop(editable: Element, inputEvent: InputEvent) {
	print(`Insert from drop detected: `, editable, inputEvent);
};
function when_historyUndo(editable: Element, inputEvent: InputEvent) {
	print(`History undo detected: `, editable, inputEvent);
};
function when_historyRedo(editable: Element, inputEvent: InputEvent) {
	print(`History redo detected: `, editable, inputEvent);
};
function when_deleteByCut(editable: Element, inputEvent: InputEvent) {
	print(`Delete by cut detected: `, editable, inputEvent);
};
function when_insertFromPaste(editable: Element, inputEvent: InputEvent) {
	print(`Insert from paste detected: `, editable, inputEvent);

	return collate_when_contentInserted(editable, inputEvent);
};


function attempt_editable_deletion(editable: Element, evt: Event) {
	const text = editable.textContent;
	editable.setAttribute("data-old-length", text?.length.toString() ?? "0");
	if (text?.length === 0) {
		// see if this editable has an attribute "data-attempt-delete-count"
		// if it does, increment it by 1. if >= 1, remove the attribute and remove the editable
		// if it does not, set it to 1
		const attemptDeleteCount = editableTapDeletionCountAttribute(editable);
		if (!isNullish(attemptDeleteCount) && isString(attemptDeleteCount)) {
			const count = parseInt(attemptDeleteCount);
			const old_count = parseInt(editable.getAttribute("data-old-length") ?? "0");
			if (count >= 2 && old_count >= text.length) {
				editableTapDeletionCountAttribute(editable, 0);
				const previousEditable = editable.previousElementSibling;
				editable.remove();

				// get previous element in heirachy
				// focus on that
				if (previousEditable instanceof HTMLElement) {
					previousEditable.focus();
					// and set cursor to end of text
					const range = document.createRange();
					const selection = window.getSelection();
					range.selectNodeContents(previousEditable);
					range.collapse(false);
					selection?.removeAllRanges();
					selection?.addRange(range);
					evt.preventDefault();
				}

				print(`Editable removed: `, editable);
			} else {
				editable.classList.add("flash-red");
				editableTapDeletionCountAttribute(editable, count + 1);
				makeNewTimeout(editable, durationDeletionAttemptWaiting, ()=>{
					editable.classList.remove("flash-red");
					editableTapDeletionCountAttribute(editable, count);
				});
			}
		} else {
			// editable.classList.add("flash-red");
			editableTapDeletionCountAttribute(editable, 1);
		}
	}
	return;
};
function collate_when_contentInserted(editable: Element, inputEvent: InputEvent) {
	const text = editable.textContent;
	if (text?.length === 0) {
		// if the text is empty, and there is a newline character at the end of the editable, remove it
		removeTrailingNewlineCharacter(editable);
	}
	if (!isNullish(text?.length) && text.length > 0) {
		// if editable has data-tag "data-attempt-delete-count", remove it
		editableTapDeletionCountAttribute(editable, 0);
		editable.setAttribute("data-old-length", text?.length.toString() ?? "0");
	}


	return;
};



function main() {


	const holder = document.querySelector("div[name='holder']") as HTMLDivElement;
	console.log(holder);

	const textEditables = holder.querySelectorAll("p.text");
	textEditables.forEach((elem) => {
		elem.setAttribute("contenteditable", "true");
		addListenersToEditable(elem);
		// editableTapDeletionCountAttribute(elem, 1);
		print(`Editable: `, elem);
	});

	console.log("End of main.");
};






console.info("End of textstuff.ts");
// End of File;