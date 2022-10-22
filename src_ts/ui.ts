

import Collection from "./collection/collection.js";
import { Debounce } from "./debounce.js";
import { Page } from "./page.js";
import { PageService } from "./pageService.js";


type ViewHistoryEntry = [
	Id: string,
	Timestamp: number
];
type T_View = (Page);

abstract class UIManager {

	static view_history: ViewHistoryEntry[] = [];

	/**
	 * Active means the user is performing gestures
	 * and interactions within that view
	 */
	static active_view_id?: string = undefined;
	static active_view?: (Page) = undefined;

	/**
	 * Visible means the view is on the screen
	 * Doesn't necessarily imply the user
	 * is interacting with it
	 */
	static visible_views_collection: Collection<T_View["Id"], T_View> = new Collection();

	/**
	 * The storage of any view that is used
	 */
	static views_storage: Collection<T_View["Id"], T_View> = new Collection();

	static OnceInit(): (1 | 0) {
		if (Debounce.Has(this.name + ":OnceInit")) return 1;
		Debounce.Add(this.name + ":OnceInit");
		// console.log(Debounce.debounces);

		const defaultPage = document.querySelector(`[data-page-id="default"]`)! as HTMLElement;
		PageService.RegisterRoguePage(defaultPage);
		// this.active_view = defaultPage;
		// void
		return 0;
	}

	static EnsureViewRegisteredInStorage(view: T_View) {
		if (!this.visible_views_collection.has(view.Id)) {
			this.visible_views_collection.set(view.Id, view);
		}
	}
	static ShowView(view: T_View) {
		this.EnsureViewRegisteredInStorage(view);
		if (view.ElementReference && this.active_view_id !== view.Id) {
			this.HideAllViews(Array.from(this.visible_views_collection.values()));
			view.ElementReference.style.display = "block";
			this.active_view = view;
			this.active_view_id = view.Id;
		} else {
			console.error(`${this.name} : view.ElementReference is undefined.`);
		}
	}
	static HideView(view: T_View) {
		this.EnsureViewRegisteredInStorage(view);
		if (view.ElementReference) {
			if (this.visible_views_collection.has(view.Id)) {
				this.visible_views_collection.delete(view.Id);
			}
			view.ElementReference.style.display = "none";
			if (this.active_view_id === view.Id) {
				this.active_view = undefined;
				this.active_view_id = undefined;
			}
		}
	}
	static HideAllViews(views: T_View[]) {
		views.forEach((view_inst)=>{
			this.HideView(view_inst);
		});
	}


}

export {UIManager};

