var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var ResourceService = /** @class */ (function () {
    function ResourceService() {
    }
    /**
     *
     * @param {string} url
     * @param {("json" | "text" | "blob")} format
     * @param {*} options
     */
    ResourceService.GetResource = function (url, format, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var fetch_prom, fetch_result, fileType, parser, doc, doc_body_children, ar;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (ResourceService.Storage.has(url)) {
                            return [2 /*return*/, undefined];
                        }
                        fetch_prom = fetch(url, options).then(function (res) {
                            if (format === "json") {
                                return res.json();
                            }
                            else if (format === "blob") {
                                return res.blob();
                            }
                            else {
                                return res.text();
                            }
                        }).catch(console.error);
                        return [4 /*yield*/, fetch_prom];
                    case 1:
                        fetch_result = _a.sent();
                        if (format === "text" && fetch_result) {
                            fileType = (function () {
                                var formats = ResourceService.ValidFileFormats;
                                var the_format = "html";
                                for (var i = 0; i < formats.length; i += 1) {
                                    var entry = formats[i];
                                    if (url.endsWith(".".concat(entry))) {
                                        the_format = entry;
                                        break;
                                    }
                                }
                                return the_format;
                            })();
                            parser = ResourceService.Parser;
                            doc = parser.parseFromString(fetch_result, "text/html");
                            doc_body_children = doc.body.childNodes;
                            ar = new AppResource({
                                Name: url,
                                Data: fetch_result,
                                // @ts-ignore
                                Type: fileType,
                                LinkURL: url
                            });
                            ResourceService.Storage.set(url, ar);
                            return [2 /*return*/, ar];
                        }
                        return [2 /*return*/, undefined];
                }
            });
        });
    };
    /**
     *
     * @param {string} url
     * @param {("JSON" | "text" | "blob")} format
     * @param {*} options
     */
    ResourceService.GetResourceThenAppendToBody = function (url, format, options) {
        if (options === void 0) { options = {}; }
        var the_resource = ResourceService.GetResource(url, format, options);
        the_resource.then(function (ar) {
            ar.AppendToBody();
            return ar;
        }).catch(console.error);
    };
    /**
     *
     * @param {string} url
     * @param {("JSON" | "text" | "script" | "js" | "css")} type
     * @param {string} data
     * @param {*} options
     */
    ResourceService.CreateResourceInSitu = function (url, type, data, options) {
        if (options === void 0) { options = {}; }
        return __awaiter(this, void 0, void 0, function () {
            var ar;
            return __generator(this, function (_a) {
                if (ResourceService.Storage.has(url)) {
                    console.error("Already has resource with URL ".concat(url));
                    // return undefined;
                    return [2 /*return*/, ResourceService.Storage.get(url)];
                }
                ar = new AppResource({
                    Data: data,
                    LinkURL: url,
                    Name: url,
                    // @ts-ignore
                    Type: type
                });
                ResourceService.Storage.set(ar.LinkURL, ar);
                return [2 /*return*/, ar];
            });
        });
    };
    ResourceService.Parser = new DOMParser();
    /**
     * @type {Map<AppResource["LinkURL"], AppResource}
     */
    ResourceService.Storage = new Map();
    ResourceService.ValidFileFormats = [
        "html", "css", "js",
        "woff", "woff2", "gif",
        "png", "jpg", "jpeg",
        "wav", "mp3", "mpeg",
        "mp4", "mkv", "json",
        "xml", "manifest", "webmanifest",
        "less", "scss", "sass"
    ];
    return ResourceService;
}());
export { ResourceService };
var AppResource = /** @class */ (function () {
    /**
     *
     * @param {{
     * Name: string,
     * Type: ("html" | "css" | "js" | "script" | "json" | "less"),
     * Data: (Blob | json | string),
     * LinkURL: string
     * }} config
     */
    function AppResource(config) {
        this.ClassName = "AppResource";
        this.Name = config.Name;
        this.Type = config.Type;
        this.Data = config.Data;
        this.LinkURL = config.LinkURL;
        this.Init();
    }
    AppResource.prototype.Init = function () {
        if (this.Type === "html") {
            var parser = ResourceService.Parser;
            this.HtmlDoc = parser.parseFromString(this.Data, "text/html");
            this.HtmlDocBody = undefined;
        }
    };
    AppResource.prototype.AppendToBody = function () {
        var _a;
        if (this.Type === "html") {
            if (this.HtmlDocBody === undefined) {
                var clonebody = this.HtmlDoc.body.cloneNode(true);
                this.HtmlDocBody = clonebody;
            }
            // @ts-ignore
            var children = __spreadArray([], (this.HtmlDocBody.childNodes), true);
            // children.forEach((htmlItem)=>{
            // 	console.log(htmlItem);
            // });
            (_a = document.body).append.apply(_a, children);
        }
        else if (this.Type === "css") {
            var cssTag = document.createElement("style");
            cssTag.setAttribute("rel", "stylesheet");
            cssTag.setAttribute("type", "text/css");
            cssTag.setAttribute("data-linkurl", this.LinkURL);
            cssTag.textContent = this.Data;
            document.body.append(cssTag);
        }
        else if (this.Type === "less") {
            var styleTag = document.createElement("style");
            styleTag.setAttribute("rel", "stylesheet/less");
            styleTag.setAttribute("type", "text/css");
            styleTag.setAttribute("data-linkurl", this.LinkURL);
            styleTag.textContent = this.Data;
            document.body.append(styleTag);
        }
        else if (this.Type === "js" || this.Type === "script") {
            var scriptTag = document.createElement("script");
            scriptTag.setAttribute("data-linkurl", this.LinkURL);
            scriptTag.textContent = this.Data;
            // scriptTag.
            document.body.append(scriptTag);
        }
    };
    return AppResource;
}());
// End of File
