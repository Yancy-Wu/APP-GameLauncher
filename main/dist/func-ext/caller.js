"use strict";
exports.__esModule = true;
function default_1(child, exceptions, callback, dataFilter) {
    var info = {
        progress: 0,
        done: false
    };
    child.stdout.on('data', function (progress) {
        progress = progress.toString();
        if (dataFilter)
            progress = dataFilter(progress);
        info.progress = progress;
    });
    child.on('close', function (code) {
        var exception = exceptions[code];
        if (exception)
            throw new Error(exception);
        else {
            info.done = true;
            if (callback)
                callback();
        }
    });
    return info;
}
exports["default"] = default_1;
//# sourceMappingURL=caller.js.map