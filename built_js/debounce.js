class Debounce {
    static Add(label) {
        this.debounces.push(label);
    }
    static Has(label) {
        return this.debounces.includes(label);
    }
    static Remove(label) {
        if (this.Has(label)) {
            const index = this.debounces.indexOf(label);
            this.debounces.splice(index, 1);
        }
    }
}
Debounce.debounces = [];
export { Debounce };
