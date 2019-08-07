"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
exports.__esModule = true;
var download_1 = require("../modules/download");
var utils_1 = require("../modules/utils");
var version_1 = require("../modules/version");
var Interface = __importStar(require("./interface"));
var Install = /** @class */ (function (_super) {
    __extends(Install, _super);
    function Install() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Install.prototype.logic = function (action) {
        var _this = this;
        switch (action) {
            case 'Connecting':
                this.connecting(function () { return _this.logic('Indexing'); });
                break;
            case 'Indexing':
                this.indexing(function () { return _this.logic('Downloading'); });
                break;
            case 'Downloading':
                this.downloadingDisplay(download_1.downloadClient(this.meta), function () { return _this.logic('Verifying'); });
                break;
            case 'Verifying':
                this.verifyingDisplay(utils_1.checkExe(this.meta), function () { return _this.logic('Installing'); });
                break;
            case 'Installing':
                this.installingDisplay(utils_1.unzipClient(this.meta), function () { return _this.logic('Done'); });
                break;
            case 'Done':
                this.done();
        }
    };
    Install.prototype.connecting = function (done) {
        var _this = this;
        var REPLY = {
            type: 'info',
            what: 'Connecting',
            msg: '连接中, 请等待...'
        };
        this.send(REPLY);
        version_1.getNewestClientVersion(function (version) {
            _this.version = version;
            done();
        });
    };
    Install.prototype.indexing = function (done) {
        var _this = this;
        var REPLY = {
            type: 'info',
            what: 'Indexing',
            msg: '获取元数据中，请等待...'
        };
        this.send(REPLY);
        download_1.downloadMeta(this.version, function (meta) {
            var info = {
                type: 'abstract',
                version: _this.version,
                needDownload: meta.exeSizeBytes
            };
            _this.send(info);
            done();
        });
    };
    Install.prototype.downloadingDisplay = function (progress, done) {
        this.progressDisplay('Downloading', '正在下载数据中...', 0.8, progress, done);
    };
    Install.prototype.verifyingDisplay = function (progress, done) {
        this.progressDisplay('Verifying', '正在校验数据中...', 0.8, progress, done);
    };
    Install.prototype.installingDisplay = function (progress, done) {
        this.progressDisplay('Installing', '正在安装客户端中...', 0.8, progress, done);
    };
    return Install;
}(Interface.Pipeline));
exports["default"] = Install;
//# sourceMappingURL=install.js.map