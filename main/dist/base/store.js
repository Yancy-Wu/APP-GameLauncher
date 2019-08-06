"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var electron_store_1 = __importDefault(require("electron-store"));
var store = new electron_store_1["default"]();
function get(key) {
    return store.get(key, undefined);
}
exports.get = get;
function set(key, value) {
    if (!value)
        store["delete"](key);
    else
        store.set(key, value);
}
exports.set = set;
//# sourceMappingURL=store.js.map