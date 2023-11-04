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
exports.helmDeployer = void 0;
var os_1 = require("os");
var fs_1 = require("fs");
var exec_1 = require("../../helpers/exec");
var helmVersion = '3.0.0';
var helmPath = './helm';
var helmChartPath = './khulnasoft-monitor';
exports.helmDeployer = {
    deploy: deployKubernetesMonitor
};
function deployKubernetesMonitor(imageOptions, deployOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var imageNameAndTag, imageName, imageTag, imagePullPolicy;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!!(0, fs_1.existsSync)(helmPath)) return [3 /*break*/, 2];
                    return [4 /*yield*/, downloadHelm()];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2:
                    imageNameAndTag = imageOptions.nameAndTag.split(':');
                    imageName = imageNameAndTag[0];
                    imageTag = imageNameAndTag[1];
                    imagePullPolicy = imageOptions.pullPolicy;
                    return [4 /*yield*/, (0, exec_1.execWrapper)("".concat(helmPath, " upgrade --install khulnasoft-monitor ").concat(helmChartPath, " --namespace khulnasoft-monitor ") +
                            "--set image.repository=".concat(imageName, " ") +
                            "--set image.tag=".concat(imageTag, " ") +
                            "--set image.pullPolicy=".concat(imagePullPolicy, " ") +
                            '--set integrationApi=https://api.dev.khulnasoft.com/v2/kubernetes-upstream ' +
                            "--set clusterName=".concat(deployOptions.clusterName, " ") +
                            '--set nodeSelector."kubernetes\\.io/os"=linux ' +
                            '--set pvc.enabled=true ' +
                            '--set pvc.create=true ' +
                            '--set log_level="INFO" ' +
                            '--set rbac.serviceAccount.annotations."foo"="bar" ' +
                            '--set volumes.projected.serviceAccountToken=true ' +
                            '--set securityContext.fsGroup=65534 ' +
                            '--set skopeo.compression.level=1 ' +
                            '--set workers.count=5 ' +
                            '--set sysdig.enabled=true ')];
                case 3:
                    _a.sent();
                    console.log("Deployed ".concat(imageOptions.nameAndTag, " with pull policy ").concat(imageOptions.pullPolicy));
                    return [2 /*return*/];
            }
        });
    });
}
function downloadHelm() {
    return __awaiter(this, void 0, void 0, function () {
        var os;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Downloading Helm ".concat(helmVersion, "..."));
                    os = (0, os_1.platform)();
                    return [4 /*yield*/, (0, exec_1.execWrapper)("curl https://get.helm.sh/helm-v".concat(helmVersion, "-").concat(os, "-amd64.tar.gz | tar xfzO - ").concat(os, "-amd64/helm > ").concat(helmPath))];
                case 1:
                    _a.sent();
                    (0, fs_1.chmodSync)(helmPath, 493); // rwxr-xr-x
                    console.log('Downloaded Helm');
                    return [2 /*return*/];
            }
        });
    });
}
