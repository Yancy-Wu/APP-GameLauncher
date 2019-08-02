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
var filepath_1 = require("./filepath");
var patch_1 = require("../base/patch");
var config_1 = __importDefault(require("../config"));
var Store = __importStar(require("../base/store"));
function patchClient(meta, callback) {
    patch_1.patch(Store.get(config_1["default"].schema.gamePath), filepath_1.patchSavedPath(meta), callback);
}
exports.patchClient = patchClient;
//# sourceMappingURL=patch.js.map