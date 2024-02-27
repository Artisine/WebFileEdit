var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
export const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
export const NUMBERS = "0123456789";
export function GenerateRandomLetters(charLimit = 8) {
    let output = "";
    const len = ALPHABET.length;
    for (let i = 0; i < charLimit; i += 1) {
        output += ALPHABET[Math.floor(Math.random() * len)];
    }
    return output;
}
;
export function Wait(timeMs) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(timeMs);
            }, timeMs);
        });
    });
}
;
/**
 *
 * @param {string} inputString
 */
export function AntiXSS_StripScripts(inputString) {
    const charactersToConvert = "<>\'\"[]()!+";
    let encodedStr = inputString.replace(/[\u00A0-\u9999<>\&]/g, function (i) {
        return "&#" + i.charCodeAt(0) + ";";
    });
    return encodedStr;
}
;
export function isNullish(thing) {
    return thing === undefined || thing === null;
}
;
export function isString(thing) {
    return typeof thing === "string";
}
;
// "End of File utility.js";
