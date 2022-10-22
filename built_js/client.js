/// <reference path="./../node_modules/@types/wicg-file-system-access/index.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Wait } from "./utility.js";
import { UIManager } from "./ui.js";
import { PageService } from "./pageService.js";
import { ResourceService } from "./resources.js";
import { Chalk, chalk } from "./chalkb.js";
import Collection from "./collection/collection.js";
// chalk.setConfig(
// 	Object.assign({}, Chalk.DefaultConfig, {
// 		consoleLogFromChalkFile: true
// 	})
// );
chalk.setConfig(Chalk.DefaultConfig);
// const testblock = document.querySelector("#blocktest")!;
// const button = document.querySelector("button#test1")!;
// button.addEventListener("click", async()=>{
// 	const [fileHandle] = await window.showOpenFilePicker();
// 	const file = await fileHandle.getFile();
// 	const contents = await file.text();
// 	testblock.textContent = contents;
// });
// const bob = new TextBlock();
// console.info(bob.ClassName);
const DEPENDENCIES = [
    ["./styles/bootstrap.min.css", "text"],
    ["./styles/bootstrap.min.css.map", "text"],
    ["./styles/index.css", "text"],
    ["./styles/less/loading.less", "text"],
    ["./styles/less/offline.less", "text"],
    ["./styles/less/homepage.less", "text"],
    ["./styles/less/blocks.less", "text"],
    ["./styles/less/pages.less", "text"],
    ["./styles/less/windows.less", "text"]
];
function HideEverythingPreventFOUC() {
    document.body.style.display = "none";
}
function LoadDependencies() {
    return __awaiter(this, void 0, void 0, function* () {
        const resource_loading_less = yield ResourceService.GetResource("./../styles/less/loading.less", "text");
        resource_loading_less.AppendToBody();
        // console.log({resource_loading_less});
        // const resource_loading_less = ResourceService.GetResourceThenAppendToBody("./styles/loading.less", "text");
        // console.log({resource_loading_less});
        // const resource_bootstrap5css = await ResourceService.GetResource("./styles/bootstrap.min.css", "text");
        // resource_bootstrap5css.AppendToBody();
        // console.log({resource_bootstrap5css});
        // ResourceService.GetResourceThenAppendToBody("./styles/bootstrap.min.css", "text");
        for (let i = 0; i < DEPENDENCIES.length; i += 1) {
            const arr = DEPENDENCIES[i];
            // @ts-ignore
            ResourceService.GetResourceThenAppendToBody(arr[0], arr[1]);
        }
        const resource_less = yield ResourceService.GetResource("./built_js/less.js", "text");
        resource_less.AppendToBody();
        // console.log({resource_less});
        // console.log(ResourceService.Storage.get("./html_imports/homepage.html"));
        less.render(resource_loading_less.Data).then((output) => __awaiter(this, void 0, void 0, function* () {
            const { css: output_css, map: output_map } = output;
            const loading_css = yield ResourceService.CreateResourceInSitu("./../styles/loading.css", "css", output_css);
            loading_css.AppendToBody();
            // console.log({loading_css});
        }));
        [...ResourceService.Storage.values()].filter((item) => {
            return item.Type === "less";
        }).forEach((lessItem) => {
            less.render(lessItem.Data).then((output) => __awaiter(this, void 0, void 0, function* () {
                const { css: output_css, map: output_map } = output;
                const make_css = yield ResourceService.CreateResourceInSitu(`${lessItem.LinkURL.replace(".less", ".css")}`, "css", output_css);
                make_css.AppendToBody();
                // console.log({make_css});
            }));
        });
    });
}
HideEverythingPreventFOUC();
LoadDependencies().then(() => {
    document.body.style.display = "block";
}).finally(() => __awaiter(void 0, void 0, void 0, function* () {
    // console.log(...chalk.bgBlack.green.write("SOMEBODY ONCE TOLD ME").print());
    console.log(...chalk.status("gray").grey.write("Hello").print());
    console.info("Dependency Loading complete!");
    yield Wait(100);
    UIManager.OnceInit();
    PageService.OnceInit();
    // console.log(...)
}));
;
class AppGlobal {
    static OnceInit() {
        this.storage.set("AppName", "ArPlanner");
        const thingsReplace = Array.from(document.querySelectorAll(`[data-text-replace="true"]`));
        thingsReplace.forEach((elem) => {
            if (elem.textContent !== null) {
                for (let [key, val] of this.storage) {
                    elem.textContent = elem.textContent.replace(key, val);
                }
            }
            elem.removeAttribute("data-text-replace");
        });
    }
}
AppGlobal.storage = new Collection();
function when_visiblity_changes() {
    if (document.visibilityState === "hidden") {
        console.info(`> Window is gone 😥`);
    }
    else {
        console.info(`> Window is visible, rise and shine!`);
    }
}
document.addEventListener("visibilitychange", when_visiblity_changes);
let consoleLoggPriorityThreshold = 2;
;
console.logg = function (priority, ...args) {
    if (priority >= consoleLoggPriorityThreshold) {
        this.log(...args);
    }
};
console.logg(1, "TEST 1");
console.logg(2, "TEST 2");
AppGlobal.OnceInit();
console.log("%c[MAIN client.js]%c Locked and loaded!", "color: purple", "color: darkgreen");
// "End of File";
