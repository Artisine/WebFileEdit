


abstract class Debounce {
	static debounces: string[] = [];
	static Add(label: string) {
		this.debounces.push(label);
	}
	static Has(label: string) {
		return this.debounces.includes(label);
	}
	static Remove(label: string) {
		if (this.Has(label)) {
			const index = this.debounces.indexOf(label);
			this.debounces.splice(index, 1);
		}
	}
}
export {Debounce};