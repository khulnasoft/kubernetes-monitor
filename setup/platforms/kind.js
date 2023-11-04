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
exports.validateRequiredEnvironment = exports.download = exports.clean = exports.loadImageInCluster = exports.exportKubeConfig = exports.deleteCluster = exports.createCluster = exports.setupTester = void 0;
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var exec_1 = require("../../helpers/exec");
var helpers_1 = require("./helpers");
var clusterName = 'kind';
function setupTester() {
    return __awaiter(this, void 0, void 0, function () {
        var osDistro;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    osDistro = (0, os_1.platform)();
                    return [4 /*yield*/, download(osDistro, 'v0.11.1')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setupTester = setupTester;
function createCluster(version) {
    return __awaiter(this, void 0, void 0, function () {
        var kindImageTag, kindImageArgument, clusterConfigPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    kindImageTag = version;
                    console.log("Creating cluster \"".concat(clusterName, "\" with Kind image tag ").concat(kindImageTag, "..."));
                    kindImageArgument = '';
                    if (kindImageTag !== 'latest') {
                        // not specifying the "--image" argument tells Kind to pick the latest image
                        // which does not necessarily have the "latest" tag
                        kindImageArgument = "--image=\"kindest/node:".concat(kindImageTag, "\"");
                    }
                    clusterConfigPath = 'test/setup/platforms/cluster-config.yaml';
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kind create cluster --name=\"".concat(clusterName, "\" ").concat(kindImageArgument, " --config=\"").concat(clusterConfigPath, "\""))];
                case 1:
                    _a.sent();
                    console.log("Created cluster ".concat(clusterName, "!"));
                    return [2 /*return*/];
            }
        });
    });
}
exports.createCluster = createCluster;
function deleteCluster() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Deleting cluster ".concat(clusterName, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kind delete cluster --name=".concat(clusterName))];
                case 1:
                    _a.sent();
                    console.log("Deleted cluster ".concat(clusterName, "!"));
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteCluster = deleteCluster;
function exportKubeConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var kubeconfigResult, kubeconfigContent, configPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Exporting K8s config...');
                    return [4 /*yield*/, (0, exec_1.execWrapper)('./kind get kubeconfig')];
                case 1:
                    kubeconfigResult = _a.sent();
                    kubeconfigContent = kubeconfigResult.stdout;
                    configPath = './kubeconfig-integration-test-kind';
                    (0, fs_1.writeFileSync)(configPath, kubeconfigContent);
                    process.env.KUBECONFIG = configPath;
                    console.log('Exported K8s config!');
                    return [2 /*return*/];
            }
        });
    });
}
exports.exportKubeConfig = exportKubeConfig;
function loadImageInCluster(imageNameAndTag) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Loading image ".concat(imageNameAndTag, " in KinD cluster..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kind load docker-image ".concat(imageNameAndTag))];
                case 1:
                    _a.sent();
                    console.log("Loaded image ".concat(imageNameAndTag));
                    return [2 /*return*/, imageNameAndTag];
            }
        });
    });
}
exports.loadImageInCluster = loadImageInCluster;
function clean() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // just delete the cluster instead
            throw new Error('Not implemented');
        });
    });
}
exports.clean = clean;
function download(osDistro, kindVersion) {
    return __awaiter(this, void 0, void 0, function () {
        var error_1, url;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 1, , 3]);
                    (0, fs_1.accessSync)((0, path_1.resolve)(process.cwd(), 'kind'), fs_1.constants.R_OK);
                    return [3 /*break*/, 3];
                case 1:
                    error_1 = _a.sent();
                    console.log("Downloading KinD ".concat(kindVersion, "..."));
                    url = "https://github.com/kubernetes-sigs/kind/releases/download/".concat(kindVersion, "/kind-").concat(osDistro, "-amd64");
                    return [4 /*yield*/, (0, exec_1.execWrapper)("curl -Lo ./kind ".concat(url))];
                case 2:
                    _a.sent();
                    (0, fs_1.chmodSync)('kind', 493); // rwxr-xr-x
                    console.log('KinD downloaded!');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.download = download;
function validateRequiredEnvironment() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('Checking for the required environment variables: DOCKER_HUB_RO_USERNAME, DOCKER_HUB_RO_PASSWORD');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('DOCKER_HUB_RO_USERNAME');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('DOCKER_HUB_RO_PASSWORD');
            return [2 /*return*/];
        });
    });
}
exports.validateRequiredEnvironment = validateRequiredEnvironment;
