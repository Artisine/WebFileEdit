
import Collection from "./collection/collection.js";
import { Debounce } from "./debounce.js";
import {
	Page
} from "./page.js";
import { UIManager } from "./ui.js";


interface PageConstructorConfig {
	Id?: string,
	Title?: string,
	Name?: string
};

abstract class PageService {
	static pages_collection: Collection<Page["Id"], Page> = new Collection();

	static ScanDOMforRoguePages() {
		const hits = Array.from(document.body.querySelectorAll(`[data-page-id]`)) as HTMLElement[];
		const rogues = hits.filter((elem) => {
			const pageId = elem.getAttribute("data-page-id");
			// const isWindowOrPanel = elem.classList.contains("ar-window") || elem.classList.contains("ar-panel");
			const isPage = elem.classList.contains("ar-page");
			if (pageId) return (isPage && !this.pages_collection.has(pageId));
			else return false;
		});
		rogues.forEach((rogueElem) => {
			this.RegisterRoguePage(rogueElem);
		});
	}
	static CheckSuspectedRoguePageStructure(rogueElement: HTMLElement) {
		const children = Array.from(rogueElement.children) as HTMLElement[];
		// it's a page if it has a title, with class "ar-title".
		const titleElem = children.find((elem)=>{
			return elem.classList.contains("ar-title");
		}) as (HTMLElement | undefined);
		// do not need to check for attribute "data-page-id"
		//  because method ScanDOMforRoguePages will pick them up already
		return titleElem;
	}
	static RegisterRoguePage(rogueElement: HTMLElement) {
		const titleElem = this.CheckSuspectedRoguePageStructure(rogueElement);
		if (titleElem) {
			// therefore it has valid html structure;
			const dataPageId = rogueElement.getAttribute("data-page-id")!;
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


	static CreatePage(config: PageConstructorConfig) {
		const pageInst = new Page();
		if (config.Id) pageInst.Id = config.Id;
		pageInst.Title = config.Title ?? "";
		pageInst.Name = config.Name ?? "";

		this.pages_collection.set(pageInst.Id, pageInst);
		return pageInst;
	}
	static InitPage(page: Page) {
		
	}


	static ShowPage(page: Page) {
		// page?.ElementReference?.style.display = "block";
		UIManager.ShowView(page);
	}
	static HidePage(page: Page) {
		UIManager.HideView(page);
	}


	static GetPagesByName(name: string): Collection<Page["Id"], Page> {
		return this.pages_collection.filter((page)=>{
			return page.Name === name;
		});
	}
	static GetPagesByTitle(title: string): Collection<Page["Id"], Page> {
		return this.pages_collection.filter((page)=>{
			return page.Title === title;
		});
	}
	static GetPageById(id: string): (Page | undefined) {
		return this.pages_collection.get(id);
	}


	static async OnceInit() {
		if (Debounce.Has(this.name + ":OnceInit")) return;
		Debounce.Add(this.name + ":OnceInit");
		// console.log(Debounce.debounces);

		// window.customElements.define("ar-page", Page, {
		// 	extends: "section"
		// });
		// await window.customElements.whenDefined("ar-page");
		
		// Debounce.Remove("UIManager:OnceInit");
		// console.log(Debounce.debounces);
		// test concluded: Debounce.Remove does indeed work.

		this.ScanDOMforRoguePages();
		// I can guarantee that page:id=default exists
		const pageDefault = this.GetPageById("default")!
		this.ShowPage(pageDefault);

	}

}


export {PageService};