

export class ResourceService {

	static Parser = new DOMParser();

	/**
	 * @type {Map<AppResource["LinkURL"], AppResource}
	 */
	static Storage: Map<AppResource["LinkURL"], AppResource> = new Map();

	static ValidFileFormats = [
		"html", "css", "js", 
		"woff", "woff2", "gif", 
		"png", "jpg", "jpeg", 
		"wav", "mp3", "mpeg", 
		"mp4", "mkv", "json", 
		"xml", "manifest", "webmanifest", 
		"less", "scss", "sass", "map"
	];
	
	/**
	 * 
	 * @param {string} url 
	 * @param {("json" | "text" | "blob")} format 
	 * @param {*} options 
	 */
	static async GetResource(url: string, format: ("json" | "text" | "blob"), options: any={}) {
		if (ResourceService.Storage.has(url)) {
			return undefined;
		}

		const fetch_prom = fetch(url, options).then((res)=>{
			if (format === "json") {
				return res.json();
			} else if (format === "blob") {
				return res.blob();
			} else {
				return res.text();
			}
		}).catch(console.error);
	
		const fetch_result = await fetch_prom;
	
		if (format === "text" && fetch_result) {
			const fileType = (()=>{
				const formats = ResourceService.ValidFileFormats;
				let the_format = "html";
				for (let i=0; i<formats.length; i+=1) {
					const entry = formats[i];
					if (url.endsWith(`.${entry}`)) {
						the_format = entry;
						break;
					}
				}
				return the_format;
			})();
			const parser = ResourceService.Parser;
			const doc = parser.parseFromString(fetch_result, "text/html");
			const doc_body_children = doc.body.childNodes;
			const ar = new AppResource({
				Name: url,
				Data: fetch_result,
				// @ts-ignore
				Type: fileType,
				LinkURL: url
			});
			ResourceService.Storage.set(url, ar);
			return ar;
		}
		return undefined;
	}

	/**
	 * 
	 * @param {string} url 
	 * @param {("JSON" | "text" | "blob")} format 
	 * @param {*} options 
	 */
	static GetResourceThenAppendToBody(url: string, format: ("json" | "text" | "blob"), options: any={}) {
		const the_resource = ResourceService.GetResource(url, format, options);
		if (the_resource) {
			console.logg(1, `Attempting load of ${url}`);
			the_resource.then((ar) => {
				ar!.AppendToBody();
				console.logg(1, `Loaded ${url}`);
				return ar;
			}).catch(console.error);
		}
	}

	/**
	 * 
	 * @param {string} url 
	 * @param {("JSON" | "text" | "script" | "js" | "css")} type 
	 * @param {string} data 
	 * @param {*} options 
	 */
	static async CreateResourceInSitu(url: string, type: ("json" | "text" | "script" | "js" | "css"), data: string, options: any={}) {
		if (ResourceService.Storage.has(url)) {
			console.logg(1, `[Error] Already has resource with URL ${url}`);
			// return undefined;
			return ResourceService.Storage.get(url);
		}

		const ar = new AppResource({
			Data: data,
			LinkURL: url,
			Name: url,
			// @ts-ignore
			Type: type
		});
		ResourceService.Storage.set(ar.LinkURL, ar);
		return ar;
	}

}

class AppResource {
	LinkURL: string;
	ClassName: string;
	Name: string;
	Type: string;
	Data: any;
	HtmlDoc?: Document;
	HtmlDocBody?: Node;
	/**
	 * 
	 * @param {{
	 * Name: string,
	 * Type: ("html" | "css" | "js" | "script" | "json" | "less" | "map"),
	 * Data: (Blob | json | string),
	 * LinkURL: string
	 * }} config 
	 */
	constructor(config: {
			Name: string;
			Type: ("html" | "css" | "js" | "script" | "json" | "less" | "map");
			Data: (Blob | JSON | string);
			LinkURL: string;
		}) {
		this.ClassName = "AppResource";
		this.Name = config.Name;
		this.Type = config.Type;
		this.Data = config.Data;
		this.LinkURL = config.LinkURL;
		this.Init();
	}

	Init() {
		if (this.Type === "html") {
			const parser = ResourceService.Parser;
			this.HtmlDoc = parser.parseFromString(this.Data, "text/html");
			this.HtmlDocBody = undefined;
		}
	}
	AppendToBody() {
		if (this.Type === "html") {
			if (this.HtmlDocBody === undefined) {
				const clonebody = this.HtmlDoc!.body.cloneNode(true) as Node;
				this.HtmlDocBody = clonebody!;
			}
			// @ts-ignore
			const children = [...(this.HtmlDocBody!.childNodes)];
			// children.forEach((htmlItem)=>{
			// 	console.log(htmlItem);
			// });
			document.body.append(...children);
		} else if (this.Type === "css") {
			const cssTag = document.createElement("style");
			cssTag.setAttribute("rel", "stylesheet");
			cssTag.setAttribute("type", "text/css");
			cssTag.setAttribute("data-linkurl", this.LinkURL);
			cssTag.textContent = this.Data;
			document.body.append(cssTag);
		} else if (this.Type === "less") {
			const styleTag = document.createElement("style");
			styleTag.setAttribute("rel", "stylesheet/less");
			styleTag.setAttribute("type", "text/css");
			styleTag.setAttribute("data-linkurl", this.LinkURL);
			styleTag.textContent = this.Data;
			document.body.append(styleTag);
		} else if (this.Type === "js" || this.Type === "script") {
			const scriptTag = document.createElement("script");
			scriptTag.setAttribute("data-linkurl", this.LinkURL);
			scriptTag.textContent = this.Data;
			// scriptTag.
			document.body.append(scriptTag);
		} else if (this.Type === "map") {
			const linkTag = document.createElement("link");
			linkTag.setAttribute("rel", "stylesheet");
			linkTag.setAttribute("data-linkurl", this.LinkURL);
			linkTag.href = this.LinkURL;
			document.body.append(linkTag);
		}
	}

}


// End of File