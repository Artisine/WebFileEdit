import Collection from "./collection/collection.js";
import { Debounce } from "./debounce.js";
import { PageService } from "./pageService.js";
class UIManager {
    static OnceInit() {
        if (Debounce.Has(this.name + ":OnceInit"))
            return 1;
        Debounce.Add(this.name + ":OnceInit");
        // console.log(Debounce.debounces);
        const defaultPage = document.querySelector(`[data-page-id="default"]`);
        PageService.RegisterRoguePage(defaultPage);
        // this.active_view = defaultPage;
        // void
        return 0;
    }
    static EnsureViewRegisteredInStorage(view) {
        if (!this.visible_views_collection.has(view.Id)) {
            this.visible_views_collection.set(view.Id, view);
        }
    }
    static ShowView(view) {
        this.EnsureViewRegisteredInStorage(view);
        if (view.ElementReference && this.active_view_id !== view.Id) {
            this.HideAllViews(Array.from(this.visible_views_collection.values()));
            view.ElementReference.style.display = "block";
            this.active_view = view;
            this.active_view_id = view.Id;
        }
        else {
            console.error(`${this.name} : view.ElementReference is undefined.`);
        }
    }
    static HideView(view) {
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
    static HideAllViews(views) {
        views.forEach((view_inst) => {
            this.HideView(view_inst);
        });
    }
}
UIManager.view_history = [];
/**
 * Active means the user is performing gestures
 * and interactions within that view
 */
UIManager.active_view_id = undefined;
UIManager.active_view = undefined;
/**
 * Visible means the view is on the screen
 * Doesn't necessarily imply the user
 * is interacting with it
 */
UIManager.visible_views_collection = new Collection();
/**
 * The storage of any view that is used
 */
UIManager.views_storage = new Collection();
export { UIManager };
