import { isNullish } from "../../utility.js";

export function setCursorToEnd(editable: Element) {
	const range = document.createRange();
	const selection = window.getSelection();
	range.selectNodeContents(editable);
	range.collapse(false);
	selection?.removeAllRanges();
	selection?.addRange(range);
	return editable;
};
export function setCursorToBeginning(editable: Element) {
	const range = document.createRange();
	const selection = window.getSelection();
	range.selectNodeContents(editable);
	range.collapse(true);
	selection?.removeAllRanges();
	selection?.addRange(range);
	return editable;
};
export function setCursorOffsetCharactersFromBeginning(editable: HTMLElement, offsetCharacters: number) {
	const range = document.createRange();
	const selection = window.getSelection();
	range.setStart(editable, offsetCharacters);
	range.collapse(true);
	selection?.removeAllRanges();
	selection?.addRange(range);
	return editable;
};
export function setCursorOffsetCharactersFromEnd(editable: HTMLElement, offsetCharacters: number) {
	// use the fromBeginning function
	if (isNullish(editable.textContent)) return;
	const offset = editable.textContent.length - offsetCharacters;
	console.log(`text = ${editable.textContent} | length = ${editable.textContent.length} | offset: ${offset}`);
	setCursorOffsetCharactersFromBeginning(editable, offset);
	return editable;
};


// "End of File";