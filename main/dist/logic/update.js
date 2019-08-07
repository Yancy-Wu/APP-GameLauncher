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
var patch_1 = require("../modules/patch");
var Interface = __importStar(require("./interface"));
var Update = /** @class */ (function (_super) {
    __extends(Update, _super);
    function Update() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Update.prototype.logic = function (action) {
        var _this = this;
        switch (action) {
            case 'Connecting':
                this.connecting(function () { return _this.logic('Indexing'); });
                break;
            case 'Indexing':
                this.indexing(function () { return _this.logic('Updating'); });
                break;
            case 'Updating':
                var size_1 = this.meta.map(function (v) { return v.patchSizeBytes; }).reduce(function (p, c) { return p + c; }, 0);
                var doUpdate_1 = function (index, done) {
                    if (index === _this.versions.length)
                        done();
                    var curMeta = _this.meta[index];
                    _this.subLogic('Downloading', curMeta, curMeta.patchSizeBytes / size_1, function () {
                        doUpdate_1(index + 1, done);
                    });
                };
                doUpdate_1(0, function () { return _this.logic('Done'); });
                break;
            case 'Done':
                this.done();
        }
    };
    Update.prototype.subLogic = function (action, meta, weight, done) {
        var _this = this;
        switch (action) {
            case 'Downloading':
                this.downloadingDisplay(weight * 0.8, download_1.downloadPatch(meta), function () {
                    _this.subLogic('Verifying', meta, weight, done);
                });
                break;
            case 'Verifying':
                this.verifyingDisplay(weight * 0.05, utils_1.checkPatch(meta), function () {
                    _this.subLogic('Patching', meta, weight, done);
                });
                break;
            case 'Patching':
                this.patchingDisplay(weight * 0.15, patch_1.patchClient(meta), function () {
                    done();
                });
        }
    };
    Update.prototype.connecting = function (done) {
        var _this = this;
        var REPLY = {
            type: 'info',
            what: 'Connecting',
            msg: '连接中, 请等待...'
        };
        this.send(REPLY);
        version_1.getToUpdateVersions(function (versions) {
            _this.versions = versions;
            done();
        });
    };
    Update.prototype.indexing = function (done) {
        var _this = this;
        var REPLY = {
            type: 'info',
            what: 'Indexing',
            msg: '获取元数据中，请等待...'
        };
        this.send(REPLY);
        var handled = 0;
        var metaAll = new Array(this.versions.length).slice();
        var info = {
            type: 'abstract',
            versions: this.versions,
            needDownload: 0
        };
        this.versions.forEach(function (version) {
            download_1.downloadMeta(version, function (meta) {
                info.needDownload += meta.patchSizeBytes;
                metaAll[_this.versions.indexOf(version)] = meta;
                ++handled;
                if (handled === _this.versions.length) {
                    _this.send(info);
                    _this.meta = metaAll;
                    done();
                }
            });
        });
    };
    Update.prototype.downloadingDisplay = function (weight, progress, done) {
        this.progressDisplay('Downloading', '正在下载中...', weight, progress, done);
    };
    Update.prototype.verifyingDisplay = function (weight, progress, done) {
        this.progressDisplay('Verifying', '正在校验数据中...', weight, progress, done);
    };
    Update.prototype.patchingDisplay = function (weight, progress, done) {
        this.progressDisplay('Patching', '正在打包Patch中...', weight, progress, done);
    };
    return Update;
}(Interface.Pipeline));
exports["default"] = Update;
//# sourceMappingURL=update.js.map