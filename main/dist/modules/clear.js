"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var os_1 = __importDefault(require("os"));
var fs_1 = __importDefault(require("fs"));
var define_1 = __importDefault(require("../exceptions/define"));
function clearMeta(callback) {
    var handled = 0;
    var tmpDir = os_1["default"].tmpdir();
    fs_1["default"].readdir(tmpDir, function (err, files) {
        if (err)
            throw new Error(define_1["default"].unknow);
        files.forEach(function (name) {
            var res = name.match(/.*\.meta\.json$/g);
            if (res)
                fs_1["default"].unlink(name, function (err) {
                    if (err)
                        throw new Error(define_1["default"].unknow);
                    handled++;
                    if (handled === files.length)
                        callback();
                });
        });
    });
}
exports.clearMeta = clearMeta;
//# sourceMappingURL=clear.js.map