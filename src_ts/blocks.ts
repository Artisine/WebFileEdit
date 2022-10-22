import { Page, T_ImageBlocks, T_TextBlocks } from "./page.js";

type T_BlockTypesIndex_Everything = (typeof Block._blockTypesIndex);
type T_BlockTypesIndex_Normal = Omit<T_BlockTypesIndex_Everything, ("Unknown" | "Root")>;
type T_BlockNames = (keyof T_BlockTypesIndex_Normal);
export {T_BlockNames};

class Block {
	static RunningCount = 1;

	ClassName: string;
	Id: number;
	Position?: number;
	Markup: string;
	constructor() {
		this.ClassName = "Block";
		this.Id = Block.RunningCount++;
		this.Position = undefined;
		this.Markup = ``;
	}

	public static _blockTypesIndex = {
		"Unknown": 0,
		"Root": 1,
		"Text": 2,
		"Image": 3,
		"Title": 4,
		
	};
	static GetBlockTypeFromElement(elem: HTMLElement) {
		if (elem instanceof HTMLParagraphElement) {
			return this._blockTypesIndex["Text"];
		} else if (elem.classList.contains("ar-image-container")) {
			return this._blockTypesIndex["Image"];
		}
		else {
			return this._blockTypesIndex["Unknown"];
		}
	}

	
}

class TextBlock extends Block {
	static BlockType = Block._blockTypesIndex.Text;
	static Create(config: T_TextBlocks) {
		const elem = document.createElement("p");
		elem.classList.add("ar-text");
		elem.contentEditable = "true";
		elem.textContent = config.TextContent ?? "";
		return elem;
	}
};
class ImageBlock extends Block {
	static BlockType = Block._blockTypesIndex.Image;
	static Create(config: T_ImageBlocks) {
		const elem = document.createElement("figure");
		elem.classList.add("ar-image-container");
		
		const img = document.createElement("img");
		img.src = config.ImageUrl;
		img.alt = config.ImageAlternateDescription ?? "image";
		elem.appendChild(img);
		if (config.ImageCaption && config.ImageCaption.length > 0) {
			const cap = document.createElement("figcaption");
			cap.contentEditable = "true";
			cap.textContent = config.ImageCaption;
			elem.append(cap);
		}

		return elem;
	}
}





export {Block, TextBlock, ImageBlock};


// "End of File";