"use strict";
exports.__esModule = true;
function default_1(child, exceptions, callback) {
    var info = {
        progress: 0,
        done: false
    };
    child.stdout.on('data', function (data) {
        data = JSON.parse(data.toString());
        info.progress = data['progress'];
        info.done = data['done'] === 1;
    });
    child.on('close', function (code) {
        var exception = exceptions[code];
        if (!exception && callback)
            callback();
        if (exception)
            throw new Error(exception);
    });
    return info;
}
exports["default"] = default_1;
//# sourceMappingURL=caller.js.map