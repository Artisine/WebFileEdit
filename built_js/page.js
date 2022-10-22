import { Block, TextBlock, ImageBlock } from "./blocks.js";
import Collection from "./collection/collection.js";
import { GenerateRandomLetters } from "./utility.js";
;
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
    Init() {
        this.HookListeners();
        // this.UnhookListenerUsingId("3");
        // setTimeout(()=>{
        // 	const theelem = this.ElementReference!.querySelector("figure.ar-image-container")! as HTMLElement;
        // 	this.UnhookAllListenersFromElement(theelem);
        // }, 5000);
    }
    HookListenersOnElement(elem) {
        const child = elem;
        // ^ code moved from HookListeners
        let child_lcn = child.getAttribute("data-listener-coordinator-number");
        if (!child_lcn) {
            child.setAttribute("data-listener-coordinator-number", `${++this.ListenerCoordinatorNumber}`);
            child_lcn = child.getAttribute("data-listener-coordinator-number");
        }
        child_lcn = child_lcn;
        if (!this.HashedListeners.has(child_lcn)) {
            this.HashedListeners.set(child_lcn, []);
        }
        const child_cli = child.getAttribute(Page.ListenerNamesToDataIds.click);
        if (!child_cli) {
            // console.log(child, "\n\t does not have cli.");
            child.setAttribute(Page.ListenerNamesToDataIds.click, `${++this.Listeners}`);
            const callback_click = this.ListenerCallback_Click.bind(this, child);
            child.addEventListener("click", callback_click);
            this.HashedListeners.get(child_lcn).push([
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
            this.HashedListeners.get(child_lcn).push([
                "keydown",
                callback_keydown
            ]);
        }
        const child_inputlisten = child.getAttribute(Page.ListenerNamesToDataIds.input);
        if (!child_inputlisten) {
            child.setAttribute(Page.ListenerNamesToDataIds.input, `${++this.Listeners}`);
            const callback_input = this.ListenerCallback_Input.bind(this, child);
            child.addEventListener("input", callback_input);
            this.HashedListeners.get(child_lcn).push([
                "input",
                callback_input
            ]);
        }
    }
    HookListeners() {
        const children = Array.from(this.ElementReference.children);
        for (let child of children) {
            this.HookListenersOnElement(child);
        }
    }
    ListenerCallback_Click(elem, evt) {
        const elem_cli = elem.getAttribute(Page.ListenerNamesToDataIds.click);
        if (this.SelectedElement) {
            this.SelectedElement.classList.remove("selected");
            this.SelectedElement = undefined;
        }
        this.SelectedElement = elem;
        this.SelectedElement.classList.add("selected");
    }
    ListenerCallback_Keydown(elem, evt) {
        const elem_kli = elem.getAttribute(Page.ListenerNamesToDataIds.keydown);
        // console.log(this);
        // console.log("^ ", elem_kli);
        // console.log("Key down");
        const kbdevt = evt;
        if (kbdevt.key === "Backspace" && elem.textContent !== null && elem.textContent.length === 0) {
            // console.log("Backspace when nothing is there");
            elem.classList.add("flash-red");
            // console.log("flashing red.");
            setTimeout(() => {
                elem.classList.remove("flash-red");
            }, 300);
        }
        else if (kbdevt.key === "Escape") {
        }
    }
    ListenerCallback_Input(elem, evt) {
        const inpEvt = evt;
        const elem_ini = elem.getAttribute(Page.ListenerNamesToDataIds.input);
        const evtInputType = inpEvt.inputType;
        if (evtInputType === "deleteContentBackward") {
            // console.log("Deleting content backwards");
            // if (elem.textContent && elem.textContent == "") {
            // 	console.log("Find a way to delete this paragraph element");
            // }
            // console.log(elem.textContent);
        }
        else if (evtInputType === "insertLineBreak") {
            // console.log("You Shift+Enter 'd");
        }
        else if (evtInputType === "insertParagraph") {
            // console.log("You full Enter 'd");
        }
        else if (evtInputType === "insertText") {
            // console.log("Inserting normal text");
        }
        else {
            console.log(evt);
        }
    }
    UnhookListenerUsingId(listenerId) {
        for (let key in Page.ListenerNamesToDataIds) {
            const tc_key = key;
            const val = Page.ListenerNamesToDataIds[tc_key];
            const elem = this.ElementReference.querySelector(`[${val}="${listenerId}"]`);
            if (elem) {
                this.UnhookSpecificListenersFromElement(elem, [tc_key]);
            }
        }
    }
    UnhookSpecificListenersFromElement(elem, keys) {
        if (!elem) {
            console.error(`Elem is undefined!`);
            return false;
        }
        const child_lcn = elem.getAttribute("data-listener-coordinator-number");
        if (!child_lcn)
            return false;
        const hashedListenerArr = this.HashedListeners.get(child_lcn);
        if (hashedListenerArr) {
            // console.log(hashedListenerArr.join(" , "));
            for (let thing of hashedListenerArr) {
                for (let evtKey of keys) {
                    if (thing[0] === evtKey) {
                        elem.removeEventListener(evtKey, thing[1]);
                        hashedListenerArr.splice(hashedListenerArr.indexOf([evtKey, thing[1]]), 1);
                        // console.log(hashedListenerArr.join(" , "));
                    }
                }
            }
        }
        else {
            console.warn("hashedListenerArr is undefined");
            return false;
        }
        return true;
    }
    UnhookAllListenersFromElement(elem) {
        const allEvents = Object.keys(Page.ListenerNamesToDataIds);
        this.UnhookSpecificListenersFromElement(elem, allEvents);
    }
    GetBlockSummary() {
        // want to make it return all in correct formatted order
        // but that's a lot of effort, may need to iterate over
        // pageInstance.ElementReference.children to do that
        //  more computation... hmm
        let output = {
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
        const pageInstChildren = Array.from(this.ElementReference.children);
        const numberOfChildren = pageInstChildren.length;
        for (let i = 0; i < numberOfChildren; i += 1) {
            const child = pageInstChildren[i];
            // console.log(child, child.tagName);
            if (child.tagName === "P" && child.classList.contains("ar-text")) {
                output.Blocks.push({
                    "BlockType": Block.GetBlockTypeFromElement(child),
                    "TextContent": child.textContent,
                    "DateModified": Date.now()
                });
            }
            else if (child.tagName === "FIGURE" && child.classList.contains("ar-image-container")) {
                const imgElem = child.querySelector("img");
                const figcaptionElem = child.querySelector("figcaption");
                // in this specific case where I know definitely that imageContainerElem 
                //  is supposed to store an image element, I can just go directly to
                //  Block._blockTypesIndex rather than using the Block.GetBlockTypeFromElement
                output.Blocks.push({
                    "BlockType": Block._blockTypesIndex["Image"],
                    "ImageUrl": imgElem.src,
                    "ImageCaption": figcaptionElem.textContent || "",
                    "ImageAlternateDescription": imgElem.alt,
                    "DateModified": Date.now()
                });
            }
            else if (child.tagName === "H1" && child.classList.contains("ar-title")) {
                output.Blocks.push({
                    "BlockType": Block._blockTypesIndex["Title"],
                    "TextContent": child.textContent,
                    "DateModified": Date.now()
                });
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
    CreateBlock(blockType) {
        let elem = undefined;
        if (blockType === "Text") {
            elem = TextBlock.Create({
                BlockType: TextBlock.BlockType,
                TextContent: ""
            });
        }
        else if (blockType === "Image") {
            elem = ImageBlock.Create({
                BlockType: ImageBlock.BlockType,
                ImageUrl: "",
            });
        }
        return elem;
    }
    CreateBlockAbove(blockType, markerElem) {
        const elem = this.CreateBlock(blockType);
        if (elem) {
            markerElem.parentElement.insertBefore(elem, markerElem);
        }
    }
    CreateBlockBelow(blockType, markerElem) {
        const elem = this.CreateBlock(blockType);
        if (elem) {
            // referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
            // https://stackoverflow.com/questions/4793604/how-to-insert-an-element-after-another-element-in-javascript-without-using-a-lib
            markerElem.parentElement.insertBefore(elem, markerElem.nextSibling);
        }
    }
}
Page.ListenerNamesToDataIds = {
    "click": "data-click-listen-id",
    "keydown": "data-keydown-listen-id",
    "input": "data-input-listen-id"
};
export { Page };
