


export namespace tc {


	function boolean(value: unknown): value is boolean {
		return typeof value === "boolean";
	};
	function number(value: unknown): value is number {
		return typeof value === "number";
	};
	function string(value: unknown): value is string {
		return typeof value === "string";
	};
	function object(value: unknown): value is object {
		return typeof value === "object";
	};
	function symbol(value: unknown): value is symbol {
		return typeof value === "symbol";
	};
	function function_(value: unknown): value is Function {
		return typeof value === "function";
	};
	function array(value: unknown): value is Array<unknown> {
		return Array.isArray(value);
	};
	function undefined_(value: unknown): value is undefined {
		return value === undefined;
	};
	function null_(value: unknown): value is null {
		return value === null;
	};
	function nullish(value: unknown): value is (undefined|null) {
		return value === undefined || value === null;
	};
	function notNullish<T>(value: T): value is Exclude<T, (undefined|null)> {
		return value !== undefined && value !== null;
	};
	function notUndefined<T>(value: T): value is Exclude<T, undefined> {
		return value !== undefined;
	};
	function notNull<T>(value: T): value is Exclude<T, null> {
		return value !== null;
	};
	function notNullishOrEmpty<T extends unknown[]>(value: T): value is T {
		return value.length > 0;
	};


	
};


// "End of File";