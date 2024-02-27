
export const ALPHABET = "abcdefghijklmnopqrstuvwxyz";
export const NUMBERS = "0123456789";
export function GenerateRandomLetters(charLimit=8) {
	let output = "";
	const len = ALPHABET.length;
	for (let i=0; i<charLimit; i+=1) {
		output += ALPHABET[Math.floor(Math.random()*len)];
	}
	return output;
};
export async function Wait(timeMs: number) {
	return new Promise((resolve, reject)=>{
		setTimeout(()=>{
			resolve(timeMs);
		}, timeMs);
	});
};

/**
 * 
 * @param {string} inputString 
 */
export function AntiXSS_StripScripts(inputString: string) {
	const charactersToConvert = "<>\'\"[]()!+";
	let encodedStr = inputString.replace(/[\u00A0-\u9999<>\&]/g, function(i) {
		return "&#"+i.charCodeAt(0)+";";
	});
	return encodedStr;
};


export function isNullish(thing: unknown): thing is (undefined|null) {
	return thing === undefined || thing === null;
};
export function isString(thing: unknown): thing is string {
	return typeof thing === "string";
};

// "End of File utility.js";