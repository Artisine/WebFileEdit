/// <reference path="./../node_modules/@types/wicg-file-system-access/index.d.ts" />

import {
	Wait
} from "./utility.js";
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





interface AppGlobalStorage {
	AppName: string
};
type T_AppGlobal_Storage = Collection<keyof AppGlobalStorage, any>;
abstract class AppGlobal {
	static storage: T_AppGlobal_Storage = new Collection();

	static OnceInit() {
		this.storage.set("AppName", "WebFileEdit");


		const thingsReplace = Array.from(document.querySelectorAll(`[data-text-replace="true"]`)) as HTMLElement[];
		thingsReplace.forEach((elem) => {
			if (elem.textContent !== null) {
				for (let [key, val] of this.storage) {
					elem.textContent = elem.textContent!.replace(key, val);
				}
			}
			elem.removeAttribute("data-text-replace");
		});


		TextStuff.OnceInit();
		
	}
}










function when_visiblity_changes() {
	if (document.visibilityState === "hidden") {
		console.info(`> Window is gone 😥`);

	} else {
		console.info(`> Window is visible, rise and shine!`);
	}
}
document.addEventListener("visibilitychange", when_visiblity_changes);




let consoleLoggPriorityThreshold = 2;
declare global {
	interface Console {
		logg(priority: number, ...args: unknown[]): void;
	}
};

console.logg = function(priority: number, ...args: unknown[]) {
	if (priority >= consoleLoggPriorityThreshold) {
		this.log(...args);
	}
};
console.logg(1, "TEST 1");
console.logg(2, "TEST 2");





AppGlobal.OnceInit();
console.log("%c[MAIN client.js]%c Locked and loaded!", "color: purple", "color: darkgreen");
// "End of File";