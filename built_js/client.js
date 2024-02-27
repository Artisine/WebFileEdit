/// <reference path="./../node_modules/@types/wicg-file-system-access/index.d.ts" />
import { Chalk, chalk } from "./chalkb.js";
import Collection from "./collection/collection.js";
import { TextStuff } from "./app/textstuff.js";
// chalk.setConfig(
// 	Object.assign({}, Chalk.DefaultConfig, {
// 		consoleLogFromChalkFile: true
// 	})
// );
chalk.setConfig(Chalk.DefaultConfig);
function HideEverythingPreventFOUC() {
    document.body.style.display = "none";
}
;
class AppGlobal {
    static OnceInit() {
        this.storage.set("AppName", "WebFileEdit");
        const thingsReplace = Array.from(document.querySelectorAll(`[data-text-replace="true"]`));
        thingsReplace.forEach((elem) => {
            if (elem.textContent !== null) {
                for (let [key, val] of this.storage) {
                    elem.textContent = elem.textContent.replace(key, val);
                }
            }
            elem.removeAttribute("data-text-replace");
        });
        TextStuff.OnceInit();
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
