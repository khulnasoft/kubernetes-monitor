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
exports.clean = exports.exportKubeConfig = exports.deleteCluster = exports.createCluster = exports.returnUnchangedImageNameAndTag = exports.setupTester = exports.validateRequiredEnvironment = void 0;
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var needle_1 = require("needle");
var helpers_1 = require("./helpers");
var kubectl = require("../../helpers/kubectl");
var exec_1 = require("../../helpers/exec");
var OPENSHIFT_CLI_VERSION = '4.7.0';
function validateRequiredEnvironment() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('Checking for the required environment variables: OPENSHIFT4_USER, OPENSHIFT4_PASSWORD, OPENSHIFT4_CLUSTER_URL, DOCKER_HUB_RO_USERNAME, DOCKER_HUB_RO_PASSWORD');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('OPENSHIFT4_USER');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('OPENSHIFT4_PASSWORD');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('OPENSHIFT4_CLUSTER_URL');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('DOCKER_HUB_RO_USERNAME');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('DOCKER_HUB_RO_PASSWORD');
            return [2 /*return*/];
        });
    });
}
exports.validateRequiredEnvironment = validateRequiredEnvironment;
function setupTester() {
    return __awaiter(this, void 0, void 0, function () {
        var nodeJsPlatform, downloadUrl, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if ((0, fs_1.existsSync)((0, path_1.resolve)(process.cwd(), 'oc'))) {
                        console.log('OpenShift CLI exists locally, skipping download');
                        return [2 /*return*/];
                    }
                    nodeJsPlatform = (0, os_1.platform)();
                    downloadUrl = getDownloadUrlForOpenShiftCli(nodeJsPlatform, OPENSHIFT_CLI_VERSION);
                    console.log('Downloading OpenShift CLI...');
                    return [4 /*yield*/, (0, needle_1["default"])('get', downloadUrl, { follow_max: 5 })];
                case 1:
                    response = _a.sent();
                    return [4 /*yield*/, extractOpenShiftCli(response.body)];
                case 2:
                    _a.sent();
                    console.log('Downloaded OpenShift CLI!');
                    return [2 /*return*/];
            }
        });
    });
}
exports.setupTester = setupTester;
function returnUnchangedImageNameAndTag(imageNameAndTag) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            // For OpenShift, the image name requires no pre-processing or loading into a cluster, hence we don't modify it.
            return [2 /*return*/, imageNameAndTag];
        });
    });
}
exports.returnUnchangedImageNameAndTag = returnUnchangedImageNameAndTag;
function createCluster() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error('Not implemented');
        });
    });
}
exports.createCluster = createCluster;
function deleteCluster() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            throw new Error('Not implemented');
        });
    });
}
exports.deleteCluster = deleteCluster;
function exportKubeConfig() {
    return __awaiter(this, void 0, void 0, function () {
        var user, userPassword, clusterURL, tmp, kubeconfigPath, cmd, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    user = process.env['OPENSHIFT4_USER'];
                    userPassword = process.env['OPENSHIFT4_PASSWORD'];
                    clusterURL = process.env['OPENSHIFT4_CLUSTER_URL'];
                    tmp = (0, os_1.tmpdir)();
                    kubeconfigPath = "".concat(tmp, "/kubeconfig");
                    cmd = clusterURL === 'https://api.crc.testing:6443'
                        ? // TODO(ivanstanev): pin to a specific CA certificate
                            "./oc login -u \"".concat(user, "\" -p \"").concat(userPassword, "\" \"").concat(clusterURL, "\" --insecure-skip-tls-verify=true --kubeconfig ").concat(kubeconfigPath)
                        : "./oc login --token=\"".concat(userPassword, "\" \"").concat(clusterURL, "\" --kubeconfig ").concat(kubeconfigPath);
                    return [4 /*yield*/, (0, exec_1.execWrapper)(cmd)];
                case 1:
                    result = _a.sent();
                    console.log('oc login result:', result.stderr || result.stdout);
                    process.env.KUBECONFIG = kubeconfigPath;
                    return [2 /*return*/];
            }
        });
    });
}
exports.exportKubeConfig = exportKubeConfig;
function tryDescribingResourceToFile(kind, name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var description, fileName, filePath, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, kubectl.describeKubernetesResource(kind, name, namespace)];
                case 1:
                    description = _a.sent();
                    fileName = "".concat(kind, "-").concat(name, "-").concat(namespace);
                    filePath = process.env.CI
                        ? // The directory is generated by CircleCI config (see .circleci/config.yml).
                            "/tmp/logs/test/integration/openshift4/".concat(fileName)
                        : "".concat((0, os_1.tmpdir)(), "/").concat(fileName);
                    (0, fs_1.writeFileSync)(filePath, description);
                    console.log("Description for ".concat(kind, " ").concat(name, " is stored in ").concat(filePath));
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log("Could not describe ".concat(kind, " ").concat(name, " in namespace ").concat(namespace), { error: error_1 });
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function clean() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        tryDescribingResourceToFile('deployment', 'khulnasoft-operator', 'khulnasoft-monitor'),
                        tryDescribingResourceToFile('deployment', 'khulnasoft-monitor', 'khulnasoft-monitor'),
                        tryDescribingResourceToFile('catalogsource', 'khulnasoft-operator', 'openshift-marketplace'),
                        tryDescribingResourceToFile('subscription', 'khulnasoft-operator', 'khulnasoft-monitor'),
                    ])];
                case 1:
                    _a.sent();
                    // Kubernetes will be stuck trying to delete these resources if we don't clear the finalizers.
                    return [4 /*yield*/, Promise.all([
                            kubectl
                                .patchResourceFinalizers('customresourcedefinition', 'khulnasoftmonitors.charts.helm.k8s.io', 'khulnasoft-monitor')["catch"](function () { return undefined; }),
                            kubectl
                                .patchResourceFinalizers('khulnasoftmonitors.charts.helm.k8s.io', 'khulnasoft-monitor', 'khulnasoft-monitor')["catch"](function () { return undefined; }),
                        ])];
                case 2:
                    // Kubernetes will be stuck trying to delete these resources if we don't clear the finalizers.
                    _a.sent();
                    // Remove resources
                    return [4 /*yield*/, Promise.all([
                            kubectl
                                .deleteResource('customresourcedefinition', 'khulnasoftmonitors.charts.helm.k8s.io', 'default')["catch"](function () { return undefined; }),
                            kubectl
                                .deleteResource('catalogsource', 'khulnasoft-operator', 'openshift-marketplace')["catch"](function () { return undefined; }),
                            kubectl
                                .deleteResource('clusterrolebinding', 'khulnasoft-monitor', 'default')["catch"](function () { return undefined; }),
                            kubectl
                                .deleteResource('clusterrole', 'khulnasoft-monitor', 'default')["catch"](function () { return undefined; }),
                            kubectl
                                .deleteResource('--all', 'all,sa,cm,secret,pvc,rollouts', 'services')["catch"](function () { return undefined; }),
                            kubectl
                                .deleteResource('--all', 'all,sa,cm,secret,pvc,rollouts', 'argo-rollouts')["catch"](function () { return undefined; }),
                            kubectl
                                .deleteResource('--all', 'all,sa,cm,secret,pvc,subscription,installplan,csv', 'khulnasoft-monitor')["catch"](function () { return undefined; }),
                        ])];
                case 3:
                    // Remove resources
                    _a.sent();
                    // Kubernetes will be stuck trying to delete these namespaces if we don't clear the finalizers.
                    return [4 /*yield*/, Promise.all([
                            kubectl.patchNamespaceFinalizers('services')["catch"](function () { return undefined; }),
                            kubectl.patchNamespaceFinalizers('argo-rollouts')["catch"](function () { return undefined; }),
                            kubectl.patchNamespaceFinalizers('khulnasoft-monitor')["catch"](function () { return undefined; }),
                        ])];
                case 4:
                    // Kubernetes will be stuck trying to delete these namespaces if we don't clear the finalizers.
                    _a.sent();
                    // Remove namespaces
                    return [4 /*yield*/, Promise.all([
                            kubectl.deleteNamespace('services')["catch"](function () { return undefined; }),
                            kubectl.deleteNamespace('argo-rollouts')["catch"](function () { return undefined; }),
                            kubectl.deleteNamespace('khulnasoft-monitor')["catch"](function () { return undefined; }),
                        ])];
                case 5:
                    // Remove namespaces
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.clean = clean;
function extractOpenShiftCli(responseBody) {
    return __awaiter(this, void 0, void 0, function () {
        var tmp, temporaryTarLocation, currentLocation, openShiftCliLocation;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    tmp = (0, os_1.tmpdir)();
                    temporaryTarLocation = "".concat(tmp, "/openshift-cli");
                    (0, fs_1.writeFileSync)(temporaryTarLocation, responseBody);
                    currentLocation = process.cwd();
                    return [4 /*yield*/, (0, exec_1.execWrapper)("tar -C ".concat(currentLocation, " -xzvf ").concat(temporaryTarLocation, " oc"))];
                case 1:
                    _a.sent();
                    openShiftCliLocation = (0, path_1.resolve)(currentLocation, 'oc');
                    (0, fs_1.chmodSync)(openShiftCliLocation, 493); // rwxr-xr-x
                    return [2 /*return*/];
            }
        });
    });
}
function getDownloadUrlForOpenShiftCli(nodeJsPlatform, cliVersion) {
    var normalisedPlatform = nodeJsPlatform === 'darwin' ? 'mac' : nodeJsPlatform;
    return "https://mirror.openshift.com/pub/openshift-v4/clients/ocp/".concat(cliVersion, "/openshift-client-").concat(normalisedPlatform, "-").concat(cliVersion, ".tar.gz");
}
