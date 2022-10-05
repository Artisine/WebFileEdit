/// <reference path="./../node_modules/@types/wicg-file-system-access/index.d.ts" />
import { Wait } from "./utility.js";
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
import { ResourceService } from "./resources.js";
const DEPENDENCIES = [
    ["./styles/bootstrap.min.css", "text"],
    ["./styles/index.css", "text"],
    ["./styles/less/loading.less", "text"],
    ["./styles/less/offline.less", "text"],
    ["./styles/less/homepage.less", "text"],
    ["./styles/less/blocks.less", "text"]
];
function HideEverythingPreventFOUC() {
    document.body.style.display = "none";
}
async function LoadDependencies() {
    const resource_loading_less = await ResourceService.GetResource("./../styles/less/loading.less", "text");
    resource_loading_less.AppendToBody();
    console.log({ resource_loading_less });
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
    const resource_less = await ResourceService.GetResource("./less.js", "text");
    resource_less.AppendToBody();
    console.log({ resource_less });
    // console.log(ResourceService.Storage.get("./html_imports/homepage.html"));
    less.render(resource_loading_less.Data).then(async (output) => {
        const { css: output_css, map: output_map } = output;
        const loading_css = await ResourceService.CreateResourceInSitu("./../styles/loading.css", "css", output_css);
        loading_css.AppendToBody();
        console.log({ loading_css });
    });
    [...ResourceService.Storage.values()].filter((item) => {
        return item.Type === "less";
    }).forEach((lessItem) => {
        less.render(lessItem.Data).then(async (output) => {
            const { css: output_css, map: output_map } = output;
            const make_css = await ResourceService.CreateResourceInSitu(`${lessItem.LinkURL.replace(".less", ".css")}`, "css", output_css);
            make_css.AppendToBody();
            console.log({ make_css });
        });
    });
}
HideEverythingPreventFOUC();
LoadDependencies().then(() => {
    document.body.style.display = "block";
}).finally(async () => {
    console.log("Dependency Loading complete!");
    await Wait(100);
    console.log("Yeah");
});
function when_visiblity_changes() {
    if (document.visibilityState === "hidden") {
        console.info(`> Window is gone 😥`);
    }
    else {
        console.info(`> Window is visible, rise and shine!`);
    }
}
document.addEventListener("visibilitychange", when_visiblity_changes);
console.log("%c[MAIN client.js]%c Locked and loaded!", "color: purple", "color: darkgreen");
// "End of File";
