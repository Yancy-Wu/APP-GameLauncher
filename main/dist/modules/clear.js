"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var os_1 = __importDefault(require("os"));
var fs_1 = __importDefault(require("fs"));
function clearMeta(callback) {
    var handled = 0;
    var tmpDir = os_1["default"].tmpdir();
    fs_1["default"].readdir(tmpDir, function (_, files) {
        files.forEach(function (v, i) {
            console.log(v);
            var res = v.match(/.*\.meta\.json$/g);
            if (res)
                fs_1["default"].unlink(v, function (_) {
                    handled++;
                    if (handled === files.length)
                        callback();
                });
        });
    });
}
exports.clearMeta = clearMeta;
//# sourceMappingURL=clear.js.map