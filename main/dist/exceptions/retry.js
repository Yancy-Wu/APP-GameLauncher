"use strict";
exports.__esModule = true;
function retry(code, exceptions, onRetry, onSuccess) {
    var num = 1;
    var loop = function () {
        try {
            code();
        }
        catch (err) {
            if (!(err.message in exceptions))
                throw err;
            if (!onRetry(err.message, num++))
                loop();
        }
    };
    loop();
    onSuccess();
}
exports["default"] = retry;
//# sourceMappingURL=retry.js.map