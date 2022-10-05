function SayHello<T>(msg: T): string {
	const out = String(msg);
	console.log(out);
	return out;
}

function AddThings(a: number, b: number) {
	try {
		return (a + b);
	} catch(err) {
		return undefined;
	}
}


console.log("Hello World!");




console.log("Typescript setup???");

// End of file