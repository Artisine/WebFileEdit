
export class TextStuff {

	static OnceInit() {
		main();

		return;
	}
};

function main() {


	const holder = document.querySelector("div[name='holder']") as HTMLDivElement;
	console.log(holder);

	const textEditables = holder.querySelectorAll("p.text");
	textEditables.forEach((elem) => {
		elem.setAttribute("contenteditable", "true");
		elem.addEventListener("input", function() {
			console.log("Input event detected on: ", elem);
		});
	});

	console.log("End of main.");
};






console.info("End of textstuff.ts");
// End of File;