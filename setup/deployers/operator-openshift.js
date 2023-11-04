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
exports.operatorDeployer = void 0;
var sleep_promise_1 = require("sleep-promise");
var fs_1 = require("fs");
var yaml_1 = require("yaml");
var kubectl = require("../../helpers/kubectl");
var exec_1 = require("../../helpers/exec");
exports.operatorDeployer = {
    deploy: deployKubernetesMonitor
};
function deployKubernetesMonitor(_imageOptions, deployOptions) {
    return __awaiter(this, void 0, void 0, function () {
        var overriddenOperatorSource, overriddenCustomResource;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    overriddenOperatorSource = 'khulnasoft-monitor-catalog-source.yaml';
                    createTestOperatorSource(overriddenOperatorSource);
                    return [4 /*yield*/, kubectl.applyK8sYaml(overriddenOperatorSource)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, kubectl.applyK8sYaml('./test/fixtures/operator/installation.yaml')];
                case 2:
                    _a.sent();
                    // Await for the Operator to become available, only then
                    // the Operator can start processing the custom resource.
                    return [4 /*yield*/, deploymentIsReady('khulnasoft-operator', 'khulnasoft-monitor')];
                case 3:
                    // Await for the Operator to become available, only then
                    // the Operator can start processing the custom resource.
                    _a.sent();
                    overriddenCustomResource = 'khulnasoft-monitor-custom-resource.yaml';
                    createTestCustomResource(overriddenCustomResource, deployOptions.clusterName);
                    return [4 /*yield*/, kubectl.applyK8sYaml(overriddenCustomResource)];
                case 4:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deploymentIsReady(name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 180)) return [3 /*break*/, 8];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 7]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get deployment.apps/".concat(name, " -n ").concat(namespace))];
                case 3:
                    _a.sent();
                    // Give the deployment enough time to settle and apply the CRD
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(60000)];
                case 4:
                    // Give the deployment enough time to settle and apply the CRD
                    _a.sent();
                    return [2 /*return*/, true];
                case 5:
                    error_1 = _a.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(1000)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 7:
                    attempt++;
                    return [3 /*break*/, 1];
                case 8: return [2 /*return*/, false];
            }
        });
    });
}
function createTestOperatorSource(newYamlPath) {
    var _a;
    console.log('Creating YAML CatalogSource...');
    var operatorVersion = (_a = process.env.OPERATOR_VERSION) !== null && _a !== void 0 ? _a : (0, fs_1.readFileSync)('./.operator_version', 'utf8');
    var originalCatalogSourceYaml = (0, fs_1.readFileSync)('./test/fixtures/operator/catalog-source.yaml', 'utf8');
    var catalogSource = (0, yaml_1.parse)(originalCatalogSourceYaml);
    catalogSource.spec.image = catalogSource.spec.image.replace('TAG_OVERRIDE', operatorVersion);
    (0, fs_1.writeFileSync)(newYamlPath, (0, yaml_1.stringify)(catalogSource));
    console.log('Created YAML CatalogSource');
}
function createTestCustomResource(newYamlPath, clusterName) {
    console.log('Creating YAML CustomResource...');
    var originalCustomResourceYaml = (0, fs_1.readFileSync)('./test/fixtures/operator/custom-resource.yaml', 'utf8');
    var customResource = (0, yaml_1.parse)(originalCustomResourceYaml);
    customResource.spec.clusterName = clusterName;
    (0, fs_1.writeFileSync)(newYamlPath, (0, yaml_1.stringify)(customResource));
    console.log('Created YAML CustomResource');
}
