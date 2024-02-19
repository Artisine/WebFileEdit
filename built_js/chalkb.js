;
;
export class Chalk {
    static DefineCustomColor(name, value) {
        Chalk.CustomColors.set(name, value);
        return Chalk.CustomColors.get(name);
    }
    constructor() {
        this.ClassName = "Chalk";
        this.Name = "Chalk";
        // this.textStyles = [];
        // this.modifiers = [];
        this.printModifiers = [];
        this.writeModifiers = [];
        this.writeBuffer = [];
        this.printBuffer = [];
        this.actionStack = [];
        this.objectBuffer = [];
        this.objectStack = [];
        this.config = {
            stylesAdditiveUntilPrint: false,
            consoleLogFromChalkFile: false,
            supportTrueColor: true
        };
        this.Class = Chalk;
    }
    /*

    config consoleLogFromChalkFile : false
               console.log( ...chalk.red.write("ur fat").print() )

    config consoleLogFromChalkFile : true
                chalk.red.write("ur fat").print()
        
    */
    setConfig(configObject) {
        for (let key in configObject) {
            if (this.config[key] !== undefined) {
                const val = configObject[key];
                this.config[key] = val;
            }
        }
    }
    reset() {
        // this.printModifiers.push(Chalk.CSS.initial);
        this.writeModifiers.push(Chalk.CSS.initial);
        this.actionStack = [];
    }
    get bold() {
        return this._bold();
    }
    get dim() {
        return this._dim();
    }
    get italic() {
        return this._italic();
    }
    get underline() {
        return this._underline();
    }
    get inverse() {
        return this._inverse();
    }
    get strikethrough() {
        return this._strikethrough();
    }
    get black() {
        return this._black();
    }
    get red() {
        return this._red();
    }
    get green() {
        return this._green();
    }
    get yellow() {
        return this._yellow();
    }
    get blue() {
        return this._blue();
    }
    get magenta() {
        return this._magenta();
    }
    get cyan() {
        return this._cyan();
    }
    get white() {
        return this._white();
    }
    get gray() {
        return this._gray();
    }
    get grey() {
        return this._gray();
    }
    get bgBlack() {
        return this._bgBlack();
    }
    get bgRed() {
        return this._bgRed();
    }
    get bgGreen() {
        return this._bgGreen();
    }
    get bgYellow() {
        return this._bgYellow();
    }
    get bgBlue() {
        return this._bgBlue();
    }
    get bgMagenta() {
        return this._bgMagenta();
    }
    get bgCyan() {
        return this._bgCyan();
    }
    get bgWhite() {
        return this._bgWhite();
    }
    _clearInitial() {
        const checkInitial = this.writeModifiers.indexOf(Chalk.CSS.initial);
        if (checkInitial !== -1) {
            // console.info(this.writeModifiers);
            this.writeModifiers.splice(checkInitial);
            // console.info(this.writeModifiers, " cleared initial style");
        }
    }
    /**
     *
     * @param {(number | string)[]} colorDefinition
     * @param {"color" | "background-color"} type
     */
    _color(type, ...colorDefinition) {
        // console.log(colorDefinition);
        let output = undefined;
        if (colorDefinition.length === 3 && colorDefinition.every(item => typeof item === "number")) {
            // picks up raw decimal numerical RGB values
            let rgb = [];
            colorDefinition.map((item, index) => {
                const roundedItem = Math.round(item);
                rgb[index] = (roundedItem > 255) ? (255) : ((roundedItem < 0) ? (0) : (roundedItem));
            });
            output = `${type}: rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]})`;
        }
        else if (colorDefinition.length === 1 && typeof colorDefinition[0] === "string") {
            // used for defining hexideimal
            let colorString;
            const isHex = colorDefinition[0].match(/\0\x|\#/);
            if (isHex !== null && isHex.length > 0) {
                // is a #hex or 0xHex string
                colorString = colorDefinition[0].replace(isHex[0], "");
                output = `${type}: #${colorString}`;
            }
            else if (Chalk.CustomColors.has(colorDefinition[0])) {
                // Chalk class has this in ColorDefinitions?
                colorString = Chalk.CustomColors.get(colorDefinition[0]);
                output = `${type}: ${colorString}`;
            }
            else {
                // probably a css color literal string value
                // return that
                colorString = colorDefinition[0];
                output = `${type}: ${colorString}`;
            }
        }
        else {
            console.log(`${type} definition was of unknown type.`);
        }
        if (output !== undefined) {
            this._clearInitial();
        }
        // console.log(output);
        this.writeModifiers.push(output);
        this.actionStack.push((type === "color") ? ("color") : ("bgColor"));
        return this;
    }
    color(...colorDefinition) {
        return this._color("color", ...colorDefinition);
    }
    bgColor(...colorDefinition) {
        return this._color("background-color", ...colorDefinition);
    }
    _useCSS(key) {
        this._clearInitial();
        // console.info(`key = ${key}`);
        this.writeModifiers.push(Chalk.CSS[key]);
        this.actionStack.push(key);
        // console.info(`writeModifiers `, this.writeModifiers);
        return this;
    }
    _bold() {
        return this._useCSS("bold");
    }
    _dim() {
        return this._useCSS("dim");
    }
    _italic() {
        return this._useCSS("italic");
    }
    _underline() {
        return this._useCSS("underline");
    }
    _inverse() {
        return this._useCSS("inverse");
    }
    _strikethrough() {
        return this._useCSS("strikethrough");
    }
    _black() {
        return this._useCSS("black");
    }
    _red() {
        return this._useCSS("red");
    }
    _green() {
        return this._useCSS("green");
    }
    _yellow() {
        return this._useCSS("yellow");
    }
    _blue() {
        return this._useCSS("blue");
    }
    _magenta() {
        return this._useCSS("magenta");
    }
    _cyan() {
        return this._useCSS("cyan");
    }
    _white() {
        return this._useCSS("white");
    }
    _gray() {
        return this._useCSS("gray");
    }
    _grey() {
        return this._gray();
    }
    _bgBlack() {
        return this._useCSS("bgBlack");
    }
    _bgRed() {
        return this._useCSS("bgRed");
    }
    _bgGreen() {
        return this._useCSS("bgGreen");
    }
    _bgYellow() {
        return this._useCSS("bgYellow");
    }
    _bgBlue() {
        return this._useCSS("bgBlue");
    }
    _bgMagenta() {
        return this._useCSS("bgMagenta");
    }
    _bgCyan() {
        return this._useCSS("bgCyan");
    }
    _bgWhite() {
        return this._useCSS("bgWhite");
    }
    writeObject(obj) {
        this.objectStack.push(obj);
        return this.write("object");
    }
    write(...args) {
        let output = ``;
        this.actionStack.push("write");
        // console.log(`actionStack `, this.actionStack);
        let actionsBeforeWrite = this.actionStack.splice(0, this.actionStack.indexOf("write") + 1).filter((item) => item !== "write");
        // console.log(`actionsBeforeWrite `, actionsBeforeWrite);
        if (actionsBeforeWrite.length === 0) {
            throw new Error("not implemented");
        }
        else if (actionsBeforeWrite.length === 1 && actionsBeforeWrite[0] === "object") {
            output = this.objectStack.shift();
            this.actionStack.pop();
            this.writeModifiers.push(output);
        }
        else if (actionsBeforeWrite.length === 1) {
            // standard as below
            // if (args.length > 1) {
            // 	output = args.map((item) => {
            // 		return `%c${item}`;
            // 	}).join("");
            // } else if (args.length === 1) {
            // 	output = `%c${args.join("")}`;
            // }
            output = `%c${args.join("")}`;
        }
        else if (actionsBeforeWrite.length >= 2) {
            output = `%c${args.join("")}`;
            // console.log(`writeModifiers `, this.writeModifiers, `actionsBeforeWrite`, actionsBeforeWrite);
            // this.writeModifiers = this.writeModifiers.slice(
            // 	actionsBeforeWrite.length
            // );
            // console.log(`writeModifiers `, this.writeModifiers);
            this.writeModifiers = [this.writeModifiers.join("; ")];
            // console.log(`writeModifiers `, this.writeModifiers);
            // ^ end is undefined, hence automatically goes to end
        }
        this.printModifiers.push(...this.writeModifiers);
        this.writeModifiers = [];
        this.writeBuffer.push(output);
        return this;
    }
    w(...args) {
        return this.write(...args);
    }
    print() {
        this.printBuffer.push(this.writeBuffer.join(""));
        const output = this.printBuffer.join("");
        const copiedPrintModifiers = Array.from(this.printModifiers);
        let formattedPrintModifiers = [];
        if (this.config.stylesAdditiveUntilPrint) {
            for (let i = 0; i < copiedPrintModifiers.length; i += 1) {
                formattedPrintModifiers.push((() => {
                    let subarray = [];
                    for (let k = 0; k < i + 1; k += 1) {
                        subarray.push(copiedPrintModifiers[k]);
                    }
                    return subarray.join("; ");
                })());
            }
        }
        else {
            formattedPrintModifiers = [...copiedPrintModifiers];
        }
        // console.info(`formattedPrintModifiers `, formattedPrintModifiers);
        const formattedPrintBuffer = this.printBuffer.join("");
        this.writeModifiers = [];
        this.printModifiers = [];
        this.writeBuffer = [];
        this.printBuffer = [];
        if (this.config.consoleLogFromChalkFile) {
            // arguments.callee.apply(
            // 	console.log,
            // 	[output, ...formattedPrintModifiers]
            // );
            console.log.apply(console.log, [output, ...formattedPrintModifiers]);
            this.reset();
            return Object.assign({ formattedPrintBuffer }, formattedPrintModifiers);
        }
        else {
            this.reset();
            return [formattedPrintBuffer, ...formattedPrintModifiers];
        }
    }
    status(bgColor) {
        return this.bgColor(bgColor).write(" ").black.write(" ").black;
    }
}
Chalk.CSS = {
    "initial": "color: initial; font-style: initial; font-weight: initial; text-decoration: initial",
    "bold": "font-weight: 900",
    "dim": "font-weight: light",
    "italic": "font-style: italic",
    "underline": "text-decoration-line: underline",
    "inverse": "inverse",
    "strikethrough": "text-decoration-line: line-through",
    "black": "color: black",
    "red": "color: red",
    "green": "color: green",
    "yellow": "color: yellow",
    "blue": "color: blue",
    "magenta": "color: magenta",
    "cyan": "color: cyan",
    "white": "color: white",
    "gray": "color: gray",
    "bgBlack": "background-color: black",
    "bgRed": "background-color: red",
    "bgGreen": "background-color: green",
    "bgYellow": "background-color: yellow",
    "bgBlue": "background-color: blue",
    "bgMagenta": "background-color: magenta",
    "bgCyan": "background-color: cyan",
    "bgWhite": "background-color: white"
};
Chalk.DefaultConfig = {
    stylesAdditiveUntilPrint: false,
    consoleLogFromChalkFile: false,
    supportTrueColor: true
};
/**
 * @type {Map<string, string | number} CustomColors
 */
Chalk.CustomColors = new Map();
;
export const chalk = new Chalk();
// end of file
