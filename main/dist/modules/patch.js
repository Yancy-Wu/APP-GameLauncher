"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var patch_1 = __importDefault(require("../func-ext/patch"));
var config_1 = __importDefault(require("../config"));
var filepath_1 = require("./filepath");
var Store = __importStar(require("../func-int/store"));
function patchClient(meta, callback) {
    return patch_1["default"](Store.get(config_1["default"].schema.gamePath), filepath_1.patchSavedPath(meta), callback);
}
exports.patchClient = patchClient;
//# sourceMappingURL=patch.js.map