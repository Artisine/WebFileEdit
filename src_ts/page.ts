
import { Block, T_BlockNames, TextBlock, ImageBlock } from "./blocks.js";
import { chalk } from "./chalkb.js";
import Collection from "./collection/collection.js";
import {
	GenerateRandomLetters
} from "./utility.js";

type T_BlockInfo = {
	"BlockType": number,
	"DateModified"?: ReturnType<Date["getTime"]>,
	"ParentIndex"?: number
};
type T_TextBlocks = T_BlockInfo & {
	"TextContent": string
};
type T_ImageBlocks = T_BlockInfo & {
	"ImageUrl": string,
	"ImageCaption"?: string,
	"ImageAlternateDescription"?: string
};
export {T_BlockInfo, T_TextBlocks, T_ImageBlocks};
interface I_PageBlockSummary {
	Blocks: T_BlockInfo[],
	Page: {
		"Title": string,
		"Id": string
	},
	Meta?: {
		BlockTypes: {
			[key: string]: number
		}
	}
};

/**
 * Page
 * 
 * Does not need to store all text data stored
 * 
 * Only needs to hold references to HTML-contenteditable elements
 * 
 * Then when exporting to JSON format, scrape over elements' contents
 */
class Page {
	Id: string;
	Name: string;
	Title: string;
	Markup: string;
	ElementReference?: HTMLElement;

	// Paragraphs: Array<HTMLParagraphElement>;
	// ImageContainers: Array<HTMLElement>;
	SpecialBlocks: Collection<Block["Id"], Block>;

	ListenerCoordinatorNumber: number;
	Listeners: number;
	HashedListeners: Collection<
		string, 
		[
			(keyof typeof Page.ListenerNamesToDataIds), 
			((this: HTMLElement, evt: Event)=>void)
		][] 
	>;

	SelectedBlock?: Block;
	SelectedElement?: HTMLElement;

	constructor() {
		this.Id = GenerateRandomLetters(8);
		this.Name = "";
		this.Title = "";
		this.Markup = ``;
		this.ElementReference = undefined;

		// this.Paragraphs = [];
		// this.ImageContainers = [];

		this.ListenerCoordinatorNumber = 0;
		this.Listeners = 0;
		this.HashedListeners = new Collection();

		this.SpecialBlocks = new Collection();

	}

	static ListenerNamesToDataIds = {
		"click": "data-click-listen-id",
		"keydown": "data-keydown-listen-id",
		"input": "data-input-listen-id"
	};

	Init() {
		this.HookListeners();
		// this.UnhookListenerUsingId("3");
		// setTimeout(()=>{
		// 	const theelem = this.ElementReference!.querySelector("figure.ar-image-container")! as HTMLElement;
		// 	this.UnhookAllListenersFromElement(theelem);
		// }, 5000);
	}
	HookListenersOnElement(elem: HTMLElement) {
		const child = elem;
		// ^ code moved from HookListeners

		let child_lcn = child.getAttribute("data-listener-coordinator-number");
		if (!child_lcn) {
			child.setAttribute("data-listener-coordinator-number", `${++this.ListenerCoordinatorNumber}`);
			child_lcn = child.getAttribute("data-listener-coordinator-number");
		}
		child_lcn = child_lcn as string;

		if (!this.HashedListeners.has(child_lcn)) {
			this.HashedListeners.set(child_lcn, []);
		}


		const child_cli = child.getAttribute(Page.ListenerNamesToDataIds.click);
		if (!child_cli) {
			// console.log(child, "\n\t does not have cli.");
			child.setAttribute(Page.ListenerNamesToDataIds.click, `${++this.Listeners}`);
			const callback_click = this.ListenerCallback_Click.bind(this, child);
			child.addEventListener("click", callback_click);
			this.HashedListeners.get(child_lcn)!.push([
				"click",
				callback_click
			]);
		}

		const child_keydownlisten = child.getAttribute(Page.ListenerNamesToDataIds.keydown);
		if (!child_keydownlisten) {
			// console.log(child, "\n\t does not have keydownlisten");
			child.setAttribute(Page.ListenerNamesToDataIds.keydown, `${++this.Listeners}`);
			const callback_keydown = this.ListenerCallback_Keydown.bind(this, child);
			child.addEventListener("keydown", callback_keydown);
			this.HashedListeners.get(child_lcn)!.push([
				"keydown",
				callback_keydown
			]);
		}

		const child_inputlisten = child.getAttribute(Page.ListenerNamesToDataIds.input);
		if (!child_inputlisten) {
			child.setAttribute(Page.ListenerNamesToDataIds.input, `${++this.Listeners}`);
			const callback_input = this.ListenerCallback_Input.bind(this, child);
			child.addEventListener("input", callback_input);
			this.HashedListeners.get(child_lcn)!.push([
				"input",
				callback_input
			]);
		}
	}
	HookListeners() {
		const children = Array.from(this.ElementReference!.children) as HTMLElement[];
		for (let child of children) {
			this.HookListenersOnElement(child);
		}
	}
	ListenerCallback_Click(this: this, elem: HTMLElement, evt: Event) {
		const elem_cli = elem.getAttribute(Page.ListenerNamesToDataIds.click);
		
		if (this.SelectedElement) {
			this.SelectedElement.classList.remove("selected");
			this.SelectedElement = undefined;
		}
		this.SelectedElement = elem;
		this.SelectedElement.classList.add("selected");
		
	}
	ListenerCallback_Keydown(this: this, elem: HTMLElement, evt: Event) {
		const elem_kli = elem.getAttribute(Page.ListenerNamesToDataIds.keydown);
		// console.log(this);
		// console.log("^ ", elem_kli);
		// console.log("Key down");

		const kbdevt = evt as KeyboardEvent;
		if (kbdevt.key === "Backspace" && elem.textContent !== null && elem.textContent.length === 0) {
			// console.log("Backspace when nothing is there");
			elem.classList.add("flash-red");
			// console.log("flashing red.");
			setTimeout(()=>{
				elem.classList.remove("flash-red");
			}, 300);
		} else if (kbdevt.key === "Escape") {

		}
	}
	ListenerCallback_Input(this: this, elem: HTMLElement, evt: Event) {
		const inpEvt = evt as InputEvent;
		const elem_ini = elem.getAttribute(Page.ListenerNamesToDataIds.input);
		// console.log("Input");
		
		type InputEvent_inputType = (
			   "insertText"
			 | "insertReplacementText"
			 | "deleteContentForward"
			 | "deleteContentBackward"
			 | "insertLineBreak"
			 | "insertParagraph"
			 | "deleteByCut"
			 | "insertFromPaste"
			 | "historyUndo"
			 | "historyRedo"
		);
		const evtInputType = inpEvt.inputType as InputEvent_inputType;
		if (evtInputType === "deleteContentBackward") {
			// console.log("Deleting content backwards");
			// if (elem.textContent && elem.textContent == "") {
			// 	console.log("Find a way to delete this paragraph element");
			// }
			// console.log(elem.textContent);
		} else if (evtInputType === "insertLineBreak") {
			// console.log("You Shift+Enter 'd");
		} else if (evtInputType === "insertParagraph") {
			// console.log("You full Enter 'd");
		} else if (evtInputType === "insertText") {
			// console.log("Inserting normal text");
		} else {
			console.log(evt);
		}
	}
	UnhookListenerUsingId(listenerId: string) {

		for (let key in Page.ListenerNamesToDataIds) {
			const tc_key = key as (keyof typeof Page["ListenerNamesToDataIds"] );
			const val = Page.ListenerNamesToDataIds[tc_key];
			const elem = this.ElementReference!.querySelector(`[${val}="${listenerId}"]`) as HTMLElement;
			if (elem) {
				this.UnhookSpecificListenersFromElement(elem, [tc_key]);
			}
			
		}
	}
	UnhookSpecificListenersFromElement(elem: HTMLElement, keys: (keyof typeof Page.ListenerNamesToDataIds)[]) {
		if (!elem) {
			console.error(`Elem is undefined!`);
			return false;
		}
		const child_lcn = elem.getAttribute("data-listener-coordinator-number");
		if (!child_lcn) return false;
		const hashedListenerArr = this.HashedListeners.get(child_lcn);
		if (hashedListenerArr) {
			// console.log(hashedListenerArr.join(" , "));
			for (let thing of hashedListenerArr) {
				for (let evtKey of keys) {
					if (thing[0] === evtKey) {
						elem.removeEventListener(evtKey, thing[1]);
						hashedListenerArr.splice(
							hashedListenerArr.indexOf([evtKey, thing[1]]),
							1
						);
						// console.log(hashedListenerArr.join(" , "));
					}
				}
			}
		} else {
			console.warn("hashedListenerArr is undefined");
			return false;
		}
		return true;
	}
	UnhookAllListenersFromElement(elem: HTMLElement) {
		const allEvents = Object.keys(Page.ListenerNamesToDataIds) as (keyof typeof Page.ListenerNamesToDataIds)[];
		this.UnhookSpecificListenersFromElement(elem, allEvents);
	}

	GetBlockSummary() {
		// want to make it return all in correct formatted order
		// but that's a lot of effort, may need to iterate over
		// pageInstance.ElementReference.children to do that
		//  more computation... hmm
		let output: I_PageBlockSummary = {
			"Blocks": [
				{
					"BlockType": Block._blockTypesIndex["Root"]
					// can be used to store meta-data? i guess?
					// idk, thought it'd be cool to have why not
				}
			],
			"Page": {
				"Title": `${this.Title}`,
				"Id": `${this.Id}`
			},
			"Meta": {
				"BlockTypes": Object.assign({}, Block._blockTypesIndex)
			}
		};
		

		const pageInstChildren = Array.from(this.ElementReference!.children) as HTMLElement[];
		const numberOfChildren = pageInstChildren.length;
		for (let i=0; i < numberOfChildren; i+=1) {
			
			const child = pageInstChildren[i];
			// console.log(child, child.tagName);

			if (child.tagName === "P" && child.classList.contains("ar-text")) {
				output.Blocks.push({
					"BlockType": Block.GetBlockTypeFromElement(child),
					"TextContent": child.textContent,
					"DateModified": Date.now()
				} as T_TextBlocks);
			} else if (child.tagName === "FIGURE" && child.classList.contains("ar-image-container")) {
				const imgElem = child.querySelector("img")!;
				const figcaptionElem = child.querySelector("figcaption")!;
				// in this specific case where I know definitely that imageContainerElem 
				//  is supposed to store an image element, I can just go directly to
				//  Block._blockTypesIndex rather than using the Block.GetBlockTypeFromElement
				output.Blocks.push({
					"BlockType": Block._blockTypesIndex["Image"],
					"ImageUrl": imgElem.src,
					"ImageCaption": figcaptionElem.textContent || "",
					"ImageAlternateDescription": imgElem.alt,
					"DateModified": Date.now()
				} as T_ImageBlocks);
			} else if (child.tagName === "H1" && child.classList.contains("ar-title")) {
				output.Blocks.push({
					"BlockType": Block._blockTypesIndex["Title"],
					"TextContent": child.textContent,
					"DateModified": Date.now()
				} as T_TextBlocks);
			} 
			// else {
			// 	// console.createTask(f.name)
			// 	// tasl.run(f)
			// 	console.log(
			// 		...chalk.status("red").write(`Uh oh, `, child, ` could not be interpreted`).print()
			// 	, child);
			// }


		}



		return output;
	}

	CreateBlock(blockType: T_BlockNames) {
		let elem: (HTMLElement | undefined) = undefined;
		if (blockType === "Text") {
			elem = TextBlock.Create({
				BlockType: TextBlock.BlockType,
				TextContent: ""
			});
		} else if (blockType === "Image") {
			elem = ImageBlock.Create({
				BlockType: ImageBlock.BlockType,
				ImageUrl: "",

			});
		}
		return elem;
	}
	CreateBlockAbove(blockType: T_BlockNames, markerElem: HTMLElement) {
		const elem = this.CreateBlock(blockType);
		if (elem) {
			markerElem.parentElement!.insertBefore(elem, markerElem);
		}
	}
	CreateBlockBelow(blockType: T_BlockNames, markerElem: HTMLElement) {
		const elem = this.CreateBlock(blockType);
		if (elem) {
			// referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
			// https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
			markerElem.parentElement!.insertBefore(elem, markerElem.nextSibling);
		}
	}
}



export {Page};