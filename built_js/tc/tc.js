export var tc;
(function (tc) {
    function boolean(value) {
        return typeof value === "boolean";
    }
    ;
    function number(value) {
        return typeof value === "number";
    }
    ;
    function string(value) {
        return typeof value === "string";
    }
    ;
    function object(value) {
        return typeof value === "object";
    }
    ;
    function symbol(value) {
        return typeof value === "symbol";
    }
    ;
    function function_(value) {
        return typeof value === "function";
    }
    ;
    function array(value) {
        return Array.isArray(value);
    }
    ;
    function undefined_(value) {
        return value === undefined;
    }
    ;
    function null_(value) {
        return value === null;
    }
    ;
    function nullish(value) {
        return value === undefined || value === null;
    }
    ;
    function notNullish(value) {
        return value !== undefined && value !== null;
    }
    ;
    function notUndefined(value) {
        return value !== undefined;
    }
    ;
    function notNull(value) {
        return value !== null;
    }
    ;
    function notNullishOrEmpty(value) {
        return value.length > 0;
    }
    ;
})(tc || (tc = {}));
;
// "End of File";
