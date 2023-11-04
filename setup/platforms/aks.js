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
exports.clean = exports.loadImageInCluster = exports.exportKubeConfig = exports.deleteCluster = exports.createCluster = exports.setupTester = exports.validateRequiredEnvironment = void 0;
var helpers_1 = require("./helpers");
var kubectl = require("../../helpers/kubectl");
var exec_1 = require("../../helpers/exec");
function validateRequiredEnvironment() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            console.log('Checking for the required environment variables: AZ_SP_APP_ID, AZ_SP_TENANT, AZ_SP_PASSWORD, AZ_ACR_REGISTRY, AZ_SUBSCRIPTION, AZ_RESOURCE_NAME, AZ_RESOURCE_GROUP');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('AZ_SP_APP_ID');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('AZ_SP_TENANT');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('AZ_SP_PASSWORD');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('AZ_ACR_REGISTRY');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('AZ_SUBSCRIPTION');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('AZ_RESOURCE_NAME');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('AZ_RESOURCE_GROUP');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('DOCKER_HUB_RO_USERNAME');
            (0, helpers_1.throwIfEnvironmentVariableUnset)('DOCKER_HUB_RO_PASSWORD');
            return [2 /*return*/];
        });
    });
}
exports.validateRequiredEnvironment = validateRequiredEnvironment;
function setupTester() {
    return __awaiter(this, void 0, void 0, function () {
        var _a, AZ_SP_APP_ID, AZ_SP_PASSWORD, AZ_SP_TENANT, AZ_RESOURCE_GROUP, AZ_RESOURCE_NAME, AZ_SUBSCRIPTION;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = process.env, AZ_SP_APP_ID = _a.AZ_SP_APP_ID, AZ_SP_PASSWORD = _a.AZ_SP_PASSWORD, AZ_SP_TENANT = _a.AZ_SP_TENANT, AZ_RESOURCE_GROUP = _a.AZ_RESOURCE_GROUP, AZ_RESOURCE_NAME = _a.AZ_RESOURCE_NAME, AZ_SUBSCRIPTION = _a.AZ_SUBSCRIPTION;
                    return [4 /*yield*/, (0, exec_1.execWrapper)("az login --service-principal --username ".concat(AZ_SP_APP_ID, " --password ").concat(AZ_SP_PASSWORD, " --tenant ").concat(AZ_SP_TENANT))];
                case 1:
                    _b.sent();
                    return [4 /*yield*/, (0, exec_1.execWrapper)("az account set --subscription ".concat(AZ_SUBSCRIPTION))];
                case 2:
                    _b.sent();
                    return [4 /*yield*/, (0, exec_1.execWrapper)("az aks get-credentials --resource-group ".concat(AZ_RESOURCE_GROUP, " --name ").concat(AZ_RESOURCE_NAME))];
                case 3:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setupTester = setupTester;
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
        var HOME;
        return __generator(this, function (_a) {
            HOME = process.env.HOME;
            process.env.KUBECONFIG = "".concat(HOME, "/.kube/config");
            return [2 /*return*/];
        });
    });
}
exports.exportKubeConfig = exportKubeConfig;
function loadImageInCluster(imageNameAndTag) {
    return __awaiter(this, void 0, void 0, function () {
        var AZ_ACR_REGISTRY, targetImage;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    AZ_ACR_REGISTRY = process.env.AZ_ACR_REGISTRY;
                    console.log("Loading image ".concat(imageNameAndTag, " in ACR..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("az acr login --name ".concat(AZ_ACR_REGISTRY))];
                case 1:
                    _a.sent();
                    targetImage = "".concat(AZ_ACR_REGISTRY, ".azurecr.io/").concat(imageNameAndTag);
                    return [4 /*yield*/, (0, exec_1.execWrapper)("docker tag ".concat(imageNameAndTag, " ").concat(targetImage))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, exec_1.execWrapper)("docker push ".concat(targetImage))];
                case 3:
                    _a.sent();
                    console.log("Loaded image in ACR");
                    return [2 /*return*/, targetImage];
            }
        });
    });
}
exports.loadImageInCluster = loadImageInCluster;
function clean() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, Promise.all([
                        kubectl.deleteNamespace('services'),
                        kubectl.deleteNamespace('argo-rollouts'),
                        kubectl.deleteNamespace('khulnasoft-monitor'),
                    ])];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.clean = clean;
