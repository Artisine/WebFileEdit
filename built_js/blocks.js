class Block {
    constructor() {
        this.ClassName = "Block";
        this.Id = Block.RunningCount++;
        this.Position = undefined;
        this.Markup = ``;
    }
    static GetBlockTypeFromElement(elem) {
        if (elem instanceof HTMLParagraphElement) {
            return this._blockTypesIndex["Text"];
        }
        else if (elem.classList.contains("ar-image-container")) {
            return this._blockTypesIndex["Image"];
        }
        else {
            return this._blockTypesIndex["Unknown"];
        }
    }
}
Block.RunningCount = 1;
Block._blockTypesIndex = {
    "Unknown": 0,
    "Root": 1,
    "Text": 2,
    "Image": 3,
    "Title": 4,
};
class TextBlock extends Block {
    static Create(config) {
        var _a;
        const elem = document.createElement("p");
        elem.classList.add("ar-text");
        elem.contentEditable = "true";
        elem.textContent = (_a = config.TextContent) !== null && _a !== void 0 ? _a : "";
        return elem;
    }
}
TextBlock.BlockType = Block._blockTypesIndex.Text;
;
class ImageBlock extends Block {
    static Create(config) {
        var _a;
        const elem = document.createElement("figure");
        elem.classList.add("ar-image-container");
        const img = document.createElement("img");
        img.src = config.ImageUrl;
        img.alt = (_a = config.ImageAlternateDescription) !== null && _a !== void 0 ? _a : "image";
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
ImageBlock.BlockType = Block._blockTypesIndex.Image;
export { Block, TextBlock, ImageBlock };
// "End of File";
