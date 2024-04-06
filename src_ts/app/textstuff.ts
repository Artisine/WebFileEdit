declare global {
	function fileOpen(options: { mimeTypes: string[], multiple: boolean }): Promise<File[]>;
}
const print = console.log;

// Rest of your code...
import { isNullish, isString } from "../utility.js";
import { setCursorOffsetCharactersFromEnd, setCursorToEnd } from "../utility/textcursors/cursors.js";
import { milliseconds } from "../utility/timings.js";

/**
 * Using https://github.com/GoogleChromeLabs/browser-fs-access
 */
import {
	fileOpen as _fileOpen,
	directoryOpen,
	fileSave,
	supported,
} from "../utility/browserfsaccess/index.modern.js";
import { CoreFileOptions } from "../utility/browserfsaccess/index.js";
import Collection from "../collection/collection.js";
import { whenMarkdown, whenPlainText } from "./textprocessing/textprocessmain.js";
if (supported) {
	console.log('Using the File System Access API.');
} else {
	console.log('Using the fallback implementation.');
}

const abc: CoreFileOptions = {
	description: "Text files",
	extensions: [".txt"],
};
print({abc});

/**
 * 
 */
type FileOpenFunction = (options: FileOpenFunctionOptions) => Promise<File[]>;
// Options are optional. You can pass an array of options, too.
type FileOpenFunctionOptions = {
	// List of allowed MIME types, defaults to `*/*`.
	mimeTypes?: string[],
	// List of allowed file extensions (with leading '.'), defaults to `''`.
	extensions?: string[],
	// Set to `true` for allowing multiple files, defaults to `false`.
	multiple?: boolean,
	// Textual description for file dialog , defaults to `''`.
	description?: string,
	// Suggested directory in which the file picker opens. A well-known directory, or a file or directory handle.
	startIn?: string,
	// By specifying an ID, the user agent can remember different directories for different IDs.
	id?: string,
	// Include an option to not apply any filter in the file picker, defaults to `false`.
	excludeAcceptAllOption?: boolean,
};
const fileOpen: FileOpenFunction = _fileOpen;



export class TextStuff {

	static OnceInit() {
		main();
		print(`[TextStuff] OnceInit()`);
		return;
	}
};


type T_handlerFunc = (editable: HTMLElement, inputEvent: InputEvent) => void;
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


function addListenersToEditable(editable: HTMLElement) {
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
const deferredTimeouts = new Map<HTMLElement, Array<number>>();
function makeNewTimeout(editable: HTMLElement, timeoutMs: number, callback: () => unknown) {
	const timeouts = deferredTimeouts.get(editable) ?? [];
	const id = window.setTimeout(()=>{
		callback();
		cleanupTimeout(editable, id);
	}, timeoutMs);
	timeouts.push(id);
	deferredTimeouts.set(editable, timeouts);
	return id;
};
function cleanupTimeout(editable: HTMLElement, id: number) {
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

function makeNewTextEditable(originEditable: HTMLElement) {
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
function removeTrailingNewlineCharacter(editable: HTMLElement) {
	const text = editable.textContent;
	if (text && text[text.length - 1] === "\n") {
		editable.textContent = text.slice(0, -1);
	}
	return editable;
};
function removeTrailingBrTag(editable: HTMLElement) {
	const lastChild = editable.lastChild;
	if (lastChild instanceof HTMLBRElement) {
		editable.removeChild(lastChild);
	}
	return editable;
};

function editableTapDeletionCountAttribute(editable: HTMLElement, count?: number) {
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

function when_keyStateChange(editable: HTMLElement, keyEvent: KeyboardEvent, state: ("up"|"down")) {
	print(`Key state change detected: `, editable, keyEvent, state);
	if (state === "down") {
		if (keyEvent.key === "Backspace") {
			print("Backspace!");
			attempt_editable_deletion(editable, keyEvent);
		}
	}
	return;
};

function when_newParagraph(editable: HTMLElement, inputEvent: InputEvent) {
	print(`New paragraph detected: `, editable, inputEvent);
	const newEditable = makeNewTextEditable(editable);
	inputEvent.preventDefault();
	removeTrailingNewlineCharacter(editable);
	removeTrailingBrTag(editable);
	newEditable.focus();
};
function when_newLineBreak(editable: HTMLElement, inputEvent: InputEvent) {
	print(`New line break detected: `, editable, inputEvent);
};
function when_deleteContentBackward(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Delete content backward detected: `, editable, inputEvent);

	attempt_editable_deletion(editable, inputEvent);

	return;
};
function when_deleteWordBackward(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Delete word backward detected: `, editable, inputEvent);
};
function when_deleteContentForward(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Delete content forward detected: `, editable, inputEvent);
};
function when_deleteWordForward(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Delete word forward detected: `, editable, inputEvent);
};
function when_insertText(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Insert text detected: `, editable, inputEvent);


	return collate_when_contentInserted(editable, inputEvent);
};
function when_deleteByDrag(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Delete by drag detected: `, editable, inputEvent);
};
function when_insertFromDrop(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Insert from drop detected: `, editable, inputEvent);
};
function when_historyUndo(editable: HTMLElement, inputEvent: InputEvent) {
	print(`History undo detected: `, editable, inputEvent);
};
function when_historyRedo(editable: HTMLElement, inputEvent: InputEvent) {
	print(`History redo detected: `, editable, inputEvent);
};
function when_deleteByCut(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Delete by cut detected: `, editable, inputEvent);
};
function when_insertFromPaste(editable: HTMLElement, inputEvent: InputEvent) {
	print(`Insert from paste detected: `, editable, inputEvent);

	return collate_when_contentInserted(editable, inputEvent);
};


function attempt_editable_deletion(editable: HTMLElement, evt: Event) {
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
					setCursorToEnd(previousEditable);
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
	} else {
		print(`Editable not empty: `, editable);
		// where length >= 1

		// check if cursor is at very beginning
		const selection = window.getSelection();
		const range = selection?.getRangeAt(0);
		const startContainer = range?.startContainer;
		const startOffset = range?.startOffset;
		const previousEditable = editable.previousElementSibling;
		const shouldAppendToPreviousParagraph = (
			startContainer?.parentElement === editable
			 && startOffset === 0
			 && previousEditable instanceof HTMLElement
			 && !isNullish(previousEditable.textContent)
			 && !isNullish(text)
		);
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
};
function collate_when_contentInserted(editable: HTMLElement, inputEvent: InputEvent) {
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
		elem = elem as HTMLElement;
		addListenersToEditable(elem as HTMLElement);
		// editableTapDeletionCountAttribute(elem, 1);
		print(`Editable: `, elem);
	});


	const btnLoadFile = document.querySelector("button#btn-load-file") as HTMLButtonElement;
	btnLoadFile.addEventListener("click", async function() {
		const blobs =  await getTheBlobs();

		return doThingsWithBlobs(blobs);
	});

	const btnLoadFromLocalstorage = document.querySelector("button#load-from-localstorage") as HTMLButtonElement;
	btnLoadFromLocalstorage.addEventListener("click", async function() {
		const localStorage = window.localStorage;
		const keys = Object.keys(localStorage);
		console.log(`Local Storage keys: `, keys);
		const thingToLoad = window.prompt(`Enter the key to load from LocalStorage:\n` + keys.join("\n") + "\n[End]");
		if (!thingToLoad) {
			window.alert(`You did not enter anything.`);
			return;
		}
		if (keys.includes(thingToLoad)) {
			// const base64 = localStorage.getItem(thingToLoad);
			// const blob = new Blob([base64], {type: "image/png"});
			// return doThingsWithBlobs([blob]);
			window.alert(`You wanted to load file "${thingToLoad}" from LocalStorage.`);
		} else {
			window.alert(`The key "${thingToLoad}" does not exist in LocalStorage.`);
			return;
		}

		const fileExtension = thingToLoad.split(".").pop();
		if (fileExtension === undefined) {
			window.alert(`The key "${thingToLoad}" does not have a file extension.`);
			return;
		}
		const imageContentsBase64 = localStorage.getItem(thingToLoad) as string;
		
		const img = createImgFromBase64String(imageContentsBase64);
		const imageHolderElem = document.querySelector("#image-holder") as HTMLDivElement;
		imageHolderElem.appendChild(img);
		console.log(`Contents loaded, check the image holder!`);

		return;
	});



	console.log("End of main.");
};

function doThingsWithBlobs(blobs: Blob[]) {
	console.log({blobs});
	const fileTypes = blobs.map(blob => blob.type);
	console.log({ fileTypes });

	const fileTypesWhichAreTextual = [
		"text/plain",
		"text/markdown",
		"text/html",
		"application/json",
		"application/xml",
		"text/javascript",
		"text/css",
		"text/x-python",
		"text/x-java",
		"application/typescript",
		"application/x-php",
		"application/x-ruby",
		"application/x-csharp",
		"application/x-cplusplus",
		"application/x-go",
		"application/x-swift",
		"application/x-rust",
		"application/x-kotlin",
		"application/x-scala",
		"application/x-perl",
	];
	const fileTypesWhichAreImages = [
		"image/jpeg",
		"image/png",
		"image/gif",
		"image/webp",
		"image/svg+xml",
		"image/bmp",
		"image/tiff",
	];
	const textFilesBlobs = blobs.filter(blob => fileTypesWhichAreTextual.includes(blob.type));
	const imageFileBlobs = blobs.filter(blob => fileTypesWhichAreImages.includes(blob.type));
	const textFileContents = new Collection(textFilesBlobs.map(item => [item, [item.type, item.text()]]));
	const processedTextValues = textFileContents.map(async(fileTypeAndTextContents, blob) => {
		const [fileTypeString, textContentsPromise] = fileTypeAndTextContents as [string, Promise<string>];
		const textContents = await textContentsPromise;
		if (fileTypeString === "text/plain") {
			return whenPlainText(textContents);
		} else if (fileTypeString === "text/markdown") {
			return whenMarkdown(textContents);
		} else {
			throw new Error("ur mom");
		}
		return textContents;
	});

	const holder = document.querySelector("div[name='holder']") as HTMLDivElement;
	// console.log(holder);
	processedTextValues.forEach(async(textvalue)=>{
		const newEditable = makeNewTextEditable(holder.lastElementChild as HTMLElement);
		newEditable.textContent = await textvalue;

	});



	/* Image specific section */
	const imageHolderElem = document.querySelector("#image-holder") as HTMLDivElement;
	imageFileBlobs.forEach(async(blob) => {
		const sourceTextMaybe = await blob.text();
		const img = document.createElement("img");
		img.style.cursor = "pointer";
		// img.src = URL.createObjectURL(blob);
		img.src = await blobToBase64(blob);
		imageHolderElem.appendChild(img);

		console.log(`You gave me a Blob: `, blob, `\nBlob source-text: `, {sourceTextMaybe}, `\nCreated an image using that: `, img);
		img.addEventListener("click", (evt)=>{
			imgClickHandler(evt, blob as File);
		});
	});





	return;
};

function blobToBase64(blob: Blob): Promise<string> {
	return new Promise((resolve, reject)=>{
		const reader = new FileReader();
		reader.onloadend = ()=> resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(blob);
	});
};
function createImgFromBase64String(b64string: string) {
	const img = document.createElement("img");
	img.style.cursor = "pointer";
	img.src = b64string;
	console.log(`Created an image using base64 string: `, img);
	return img;
}

async function imgClickHandler(evt: MouseEvent, file: File) {
	// console.log(`You click image element: `, evt.target);
	const img = evt.target as HTMLImageElement;
	console.log(file);
	const wantToSave = window.confirm(`Do you want to save this image "${file.name}" ?`);
	if (wantToSave) {
		console.log(`You want to save the image "${file.name}".`);

		const imageContentsAsBase64 = await blobToBase64(file);

		const localStorage = window.localStorage;
		localStorage.setItem(file.name, imageContentsAsBase64);

		console.log(`Contents saved, check LocalStorage!`);
		window.alert(`Contents saved, check LocalStorage!`);
	} else {
		console.log(`You do not want to save the image "${file.name}".`);
	}

	return;
};

async function getTheBlobs() {
	const blobs = await fileOpen({
		// mimeTypes: ["text/txt", "text/markdown"],
		multiple: true,
		extensions: [".txt", ".md", ".png", ".jpg", ".jpeg", ".gif", ".webp", ".svg", ".bmp", ".tiff"],
		excludeAcceptAllOption: false
	}) as Blob[];
	console.info({blobs});
	return blobs;
};




console.info("End of textstuff.ts");
// End of File;