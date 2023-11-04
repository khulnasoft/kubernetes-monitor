"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var child_process_promise_1 = require("child-process-promise");
var fs_1 = require("fs");
var os_1 = require("os");
var helmVersion = '3.0.0';
function downloadHelm(helmPath) {
    return __awaiter(this, void 0, void 0, function () {
        var os, res;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    os = (0, os_1.platform)();
                    return [4 /*yield*/, (0, child_process_promise_1.exec)("curl https://get.helm.sh/helm-v".concat(helmVersion, "-").concat(os, "-amd64.tar.gz | tar xfzO - ").concat(os, "-amd64/helm > ").concat(helmPath))];
                case 1:
                    res = _a.sent();
                    (0, fs_1.chmodSync)(helmPath, 493); // rwxr-xr-x
                    return [2 /*return*/];
            }
        });
    });
}
describe('helm chart parameter validation', function () {
    var helmPath = 'helm';
    var removeHelm = false;
    var helmChartPath = './khulnasoft-monitor';
    beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, child_process_promise_1.exec)("helm --help")["catch"](function (_) {
                        helmPath = './helm';
                        if ((0, fs_1.existsSync)('./helm')) {
                            return Promise.resolve();
                        }
                        removeHelm = true;
                        return downloadHelm(helmPath);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    afterAll(function () {
        if (removeHelm) {
            (0, fs_1.rmSync)(helmPath);
        }
    });
    it('should accept empty cluster name', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, child_process_promise_1.exec)(
                    // cannot use helm upgrade --install as that requires a cluster
                    "".concat(helmPath, " template khulnasoft-monitor ").concat(helmChartPath, " --namespace khulnasoft-monitor --dry-run"))];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should accept valid cluster name', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, child_process_promise_1.exec)(
                    // cannot use helm upgrade --install as that requires a cluster
                    "".concat(helmPath, " template khulnasoft-monitor ").concat(helmChartPath, " --namespace khulnasoft-monitor --dry-run ") +
                        '--set clusterName="Alpha Beta 12_345"')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); });
    it('should reject invalid cluster name', function () { return __awaiter(void 0, void 0, void 0, function () {
        var _1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, child_process_promise_1.exec)(
                        // cannot use helm upgrade --install as that requires a cluster
                        "".concat(helmPath, " template khulnasoft-monitor ").concat(helmChartPath, " --namespace khulnasoft-monitor --dry-run ") +
                            '--set clusterName="Alpha?Beta"')];
                case 1:
                    _a.sent();
                    fail('The name should have been rejected.');
                    return [3 /*break*/, 3];
                case 2:
                    _1 = _a.sent();
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
});
