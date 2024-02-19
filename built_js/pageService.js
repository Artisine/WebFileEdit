var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import Collection from "./collection/collection.js";
import { Debounce } from "./debounce.js";
import { Page } from "./page.js";
import { UIManager } from "./ui.js";
;
function isNullish(thing) {
    return (thing === null || thing === undefined);
}
;
class PageService {
    static ScanDOMforRoguePages() {
        const hits = Array.from(document.body.querySelectorAll(`[data-page-id]`));
        const rogues = hits.filter((elem) => {
            const pageId = elem.getAttribute("data-page-id");
            // const isWindowOrPanel = elem.classList.contains("ar-window") || elem.classList.contains("ar-panel");
            const isPage = elem.classList.contains("ar-page");
            if (pageId)
                return (isPage && !this.pages_collection.has(pageId));
            else
                return false;
        });
        rogues.forEach((rogueElem) => {
            if (!isNullish(rogueElem)) {
                this.RegisterRoguePage(rogueElem);
            }
        });
    }
    static CheckSuspectedRoguePageStructure(rogueElement) {
        const children = Array.from(rogueElement.children);
        // it's a page if it has a title, with class "ar-title".
        const titleElem = children.find((elem) => {
            return elem.classList.contains("ar-title");
        });
        // do not need to check for attribute "data-page-id"
        //  because method ScanDOMforRoguePages will pick them up already
        return titleElem;
    }
    static RegisterRoguePage(rogueElement) {
        const titleElem = this.CheckSuspectedRoguePageStructure(rogueElement);
        if (titleElem) {
            // therefore it has valid html structure;
            const dataPageId = rogueElement.getAttribute("data-page-id");
            const pageInst = this.CreatePage({
                Id: dataPageId,
                Title: `${titleElem.textContent}`
            });
            pageInst.ElementReference = rogueElement;
            pageInst.ElementReference.style.display = "none";
            // const paragraphElems = Array.from(pageInst.ElementReference.querySelectorAll("p"));
            // const imageContainerElems = Array.from(pageInst.ElementReference.querySelectorAll("figure.ar-image-container")) as HTMLElement[];
            // ^ warning, searching for "image" element may return SVG-image elements instead
            //   forewarning, this will produce some errors in the future.
            // pageInst.Paragraphs = paragraphElems;
            // pageInst.ImageContainers = imageContainerElems;
            pageInst.Init();
            const pageBlockSummary = pageInst.GetBlockSummary();
            console.info(pageBlockSummary);
        }
    }
    static CreatePage(config) {
        var _a, _b;
        const pageInst = new Page();
        if (config.Id)
            pageInst.Id = config.Id;
        pageInst.Title = (_a = config.Title) !== null && _a !== void 0 ? _a : "";
        pageInst.Name = (_b = config.Name) !== null && _b !== void 0 ? _b : "";
        this.pages_collection.set(pageInst.Id, pageInst);
        return pageInst;
    }
    static InitPage(page) {
    }
    static ShowPage(page) {
        // page?.ElementReference?.style.display = "block";
        UIManager.ShowView(page);
    }
    static HidePage(page) {
        UIManager.HideView(page);
    }
    static GetPagesByName(name) {
        return this.pages_collection.filter((page) => {
            return page.Name === name;
        });
    }
    static GetPagesByTitle(title) {
        return this.pages_collection.filter((page) => {
            return page.Title === title;
        });
    }
    static GetPageById(id) {
        return this.pages_collection.get(id);
    }
    static OnceInit() {
        return __awaiter(this, void 0, void 0, function* () {
            if (Debounce.Has(this.name + ":OnceInit"))
                return;
            Debounce.Add(this.name + ":OnceInit");
            // console.log(Debounce.debounces);
            // window.customElements.define("ar-page", Page, {
            // 	extends: "section"
            // });
            // await window.customElements.whenDefined("ar-page");
            // Debounce.Remove("UIManager:OnceInit");
            // console.log(Debounce.debounces);
            // test concluded: Debounce.Remove does indeed work.
            // this.ScanDOMforRoguePages();
            // I can guarantee that page:id=default exists
            // const pageDefault = this.GetPageById("default")!
            // this.ShowPage(pageDefault);
        });
    }
}
PageService.pages_collection = new Collection();
export { PageService };
