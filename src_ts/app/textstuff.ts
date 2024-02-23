
export class TextStuff {

	static OnceInit() {
		main();

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
	editable.addEventListener("input", function(_evt) {
		const evt = _evt as InputEvent;
		// console.log("Input event detected on: ", editable, _evt, evt);
		// if (evt.inputType === "insertParagraph") {
		// 	when_newParagraph(editable, evt);
		// } else if (evt.inputType === "insertLineBreak") {
		// 	when_newLineBreak(editable, evt);
		// } else if (evt.inputType === "deleteContentBackward") {
		// 	when_deleteContentBackward(editable, evt);
		// } else if (evt.inputType === "deleteWordBackward") {
		// 	when_deleteWordBackward(editable, evt);
		// } else if (evt.inputType === "deleteContentForward") {
		// 	when_deleteContentForward(editable, evt);
		// } else if (evt.inputType === "deleteWordForward") {
		// 	when_deleteWordForward(editable, evt);
		// } else if (evt.inputType === "insertText") {
		// 	when_insertText(editable, evt);
		// } else if (evt.inputType === "deleteByDrag") {
		// 	when_deleteByDrag(editable, evt);
		// } else if (evt.inputType === "insertFromDrop") {
		// 	when_insertFromDrop(editable, evt);
		// } else if (evt.inputType === "historyUndo") {
		// 	when_historyUndo(editable, evt);
		// } else if (evt.inputType === "historyRedo") {
		// 	when_historyRedo(editable, evt);
		// } else if (evt.inputType === "deleteByCut") {
		// 	when_deleteByCut(editable, evt);
		// } else if (evt.inputType === "insertFromPaste") {
		// 	when_insertFromPaste(editable, evt);
		// } else {

		// 	console.log("Unhandled inputType: ", evt.inputType);
		// }

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
};

function when_newParagraph(editable: Element, inputEvent: InputEvent) {
	print(`New paragraph detected: `, editable, inputEvent);
};
function when_newLineBreak(editable: Element, inputEvent: InputEvent) {
	print(`New line break detected: `, editable, inputEvent);
};
function when_deleteContentBackward(editable: Element, inputEvent: InputEvent) {
	print(`Delete content backward detected: `, editable, inputEvent);
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
};

function main() {


	const holder = document.querySelector("div[name='holder']") as HTMLDivElement;
	console.log(holder);

	const textEditables = holder.querySelectorAll("p.text");
	textEditables.forEach((elem) => {
		elem.setAttribute("contenteditable", "true");
		addListenersToEditable(elem);
	});

	console.log("End of main.");
};






console.info("End of textstuff.ts");
// End of File;