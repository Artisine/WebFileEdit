"use strict";
function SayHello(msg) {
    var out = String(msg);
    console.log(out);
    return out;
}
function AddThings(a, b) {
    try {
        return (a + b);
    }
    catch (err) {
        return undefined;
    }
}
console.log("Hello World!");
console.log("Typescript setup???");
// End of file
