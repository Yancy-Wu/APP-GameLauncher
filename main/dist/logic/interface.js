"use strict";
exports.__esModule = true;
var clear_1 = require("../modules/clear");
var Pipeline = /** @class */ (function () {
    function Pipeline(sender, name) {
        var _this = this;
        this.send = function (val) { return _this.sender.send(_this.replyEvent, val); };
        this.done = function () { return _this.send({ type: 'done' }); };
        this.progressTotal = 0;
        this.sender = sender;
        this.replyEvent = name + ".reply";
        clear_1.clearMeta(function () { return _this.logic('Connecting'); });
    }
    Pipeline.prototype.progressDisplay = function (what, msg, weight, progress, done) {
        var _this = this;
        this.timeId = setInterval(function () {
            _this.progressTotal += progress.progress * weight;
            var REPLY = {
                type: 'info',
                what: what,
                msg: msg,
                done: progress.done,
                progressCur: progress.progress,
                progressTotal: _this.progressTotal
            };
            _this.send(REPLY);
            if (progress.done) {
                clearInterval(_this.timeId);
                done();
            }
        }, 500);
    };
    return Pipeline;
}());
exports.Pipeline = Pipeline;
//# sourceMappingURL=interface.js.map