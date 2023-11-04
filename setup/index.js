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
exports.deployMonitor = exports.removeUnusedKindNetwork = exports.removeLocalContainerRegistry = exports.removeMonitor = exports.khulnasoftMonitorNamespace = void 0;
var fs = require("fs");
var crypto_1 = require("crypto");
var sleep_promise_1 = require("sleep-promise");
var platforms_1 = require("./platforms");
var deployers_1 = require("./deployers");
var kubectl = require("../helpers/kubectl");
var exec_1 = require("../helpers/exec");
var testPlatform = process.env['TEST_PLATFORM'] || 'kind';
var createCluster = process.env['CREATE_CLUSTER'] === 'true';
var deploymentType = process.env['DEPLOYMENT_TYPE'] || 'YAML';
function getIntegrationId() {
    var integrationId = process.env.INTEGRATION_TESTS_INTEGRATION_ID;
    console.log("using integration ID ".concat(integrationId, " for integration tests"));
    return integrationId;
}
function getClusterName() {
    var clusterName = "cluster_".concat((0, crypto_1.randomUUID)());
    console.log("Generated new Cluster Name ".concat(clusterName));
    return clusterName;
}
function getServiceAccountApiToken() {
    var serviceAccountApiToken = process.env.INTEGRATION_TESTS_SERVICE_ACCOUNT_API_TOKEN;
    return serviceAccountApiToken;
}
function getEnvVariableOrDefault(envVarName, defaultValue) {
    var value = process.env[envVarName];
    return value === undefined || value === '' ? defaultValue : value;
}
function khulnasoftMonitorNamespace() {
    var namespace = 'khulnasoft-monitor';
    if (testPlatform === 'kindolm') {
        namespace = 'marketplace';
    }
    return namespace;
}
exports.khulnasoftMonitorNamespace = khulnasoftMonitorNamespace;
function removeMonitor() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: 
                // Credentials may have expired on certain platforms (OpenShift 4), try to regenerate them.
                return [4 /*yield*/, platforms_1["default"][testPlatform].config()["catch"](function () { return undefined; })];
                case 1:
                    // Credentials may have expired on certain platforms (OpenShift 4), try to regenerate them.
                    _a.sent();
                    return [4 /*yield*/, dumpLogs()["catch"](function () { return undefined; })];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 8, , 9]);
                    if (!createCluster) return [3 /*break*/, 5];
                    return [4 /*yield*/, platforms_1["default"][testPlatform]["delete"]()];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 5: return [4 /*yield*/, platforms_1["default"][testPlatform].clean()];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [3 /*break*/, 9];
                case 8:
                    error_1 = _a.sent();
                    console.log("Could not remove the Kubernetes-Monitor: ".concat(error_1.message));
                    return [3 /*break*/, 9];
                case 9: return [2 /*return*/];
            }
        });
    });
}
exports.removeMonitor = removeMonitor;
function removeLocalContainerRegistry() {
    return __awaiter(this, void 0, void 0, function () {
        var error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)('docker rm kind-registry --force')];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    console.log("Could not remove container registry, it probably did not exist: ".concat(error_2.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.removeLocalContainerRegistry = removeLocalContainerRegistry;
function removeUnusedKindNetwork() {
    return __awaiter(this, void 0, void 0, function () {
        var error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)('docker network rm kind')];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    console.log("Could not remove \"kind\" network: ".concat(error_3.message));
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.removeUnusedKindNetwork = removeUnusedKindNetwork;
function createEnvironment() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, kubectl.createNamespace('services')];
                case 1:
                    _a.sent();
                    // Small hack to prevent timing problems in CircleCI...
                    // TODO: should be replaced by actively waiting for the namespace to be created
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(5000)];
                case 2:
                    // Small hack to prevent timing problems in CircleCI...
                    // TODO: should be replaced by actively waiting for the namespace to be created
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function predeploy(integrationId, serviceAccountApiToken, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var secretName, error_4, gcrDockercfg, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 7, , 8]);
                    secretName = 'khulnasoft-monitor';
                    console.log("Creating namespace ".concat(namespace, " and secret ").concat(secretName));
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, kubectl.createNamespace(namespace)];
                case 2:
                    _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    error_4 = _a.sent();
                    console.log("Namespace ".concat(namespace, " already exist"));
                    return [3 /*break*/, 4];
                case 4:
                    gcrDockercfg = process.env['PRIVATE_REGISTRIES_DOCKERCFG'] || '{}';
                    return [4 /*yield*/, kubectl.createSecret(secretName, namespace, {
                            'dockercfg.json': gcrDockercfg,
                            integrationId: integrationId,
                            serviceAccountApiToken: serviceAccountApiToken
                        })];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, createRegistriesConfigMap(namespace)];
                case 6:
                    _a.sent();
                    console.log("Namespace ".concat(namespace, " and secret ").concat(secretName, " created"));
                    return [3 /*break*/, 8];
                case 7:
                    error_5 = _a.sent();
                    console.log('Could not create namespace and secret, they probably already exist');
                    return [3 /*break*/, 8];
                case 8: return [2 /*return*/];
            }
        });
    });
}
/** This is used in order to avoid Docker Hub rate limiting on our integration tests. */
function createSecretForDockerHubAccess() {
    return __awaiter(this, void 0, void 0, function () {
        var secretName, secretsKeyPrefix, secretType;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    secretName = 'docker-io';
                    secretsKeyPrefix = '--';
                    secretType = 'docker-registry';
                    return [4 /*yield*/, kubectl.createSecret(secretName, 'services', {
                            'docker-server': 'https://docker.io',
                            'docker-username': getEnvVariableOrDefault('DOCKER_HUB_RO_USERNAME', ''),
                            'docker-email': 'runtime@khulnasoft.com',
                            'docker-password': getEnvVariableOrDefault('DOCKER_HUB_RO_PASSWORD', '')
                        }, secretsKeyPrefix, secretType)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createSecretForGcrIoAccess() {
    return __awaiter(this, void 0, void 0, function () {
        var gcrSecretName, gcrKubectlSecretsKeyPrefix, gcrSecretType, gcrToken;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    gcrSecretName = 'gcr-io';
                    gcrKubectlSecretsKeyPrefix = '--';
                    gcrSecretType = 'docker-registry';
                    gcrToken = getEnvVariableOrDefault('GCR_IO_SERVICE_ACCOUNT', '{}');
                    return [4 /*yield*/, kubectl.createSecret(gcrSecretName, 'services', {
                            'docker-server': 'https://gcr.io',
                            'docker-username': '_json_key',
                            'docker-email': 'egg@khulnasoft.com',
                            'docker-password': gcrToken
                        }, gcrKubectlSecretsKeyPrefix, gcrSecretType)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function createRegistriesConfigMap(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, kubectl.createConfigMap('khulnasoft-monitor-registries-conf', namespace, './test/fixtures/insecure-registries/registries.conf')];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
function deployMonitor() {
    return __awaiter(this, void 0, void 0, function () {
        var namespace, imageNameAndTag, kubernetesVersion, remoteImageName, integrationId, serviceAccountApiToken, imagePullPolicy, deploymentImageOptions, clusterName, deploymentOptions, attempt, _a, err_1, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log('Begin deploying the khulnasoft-monitor...');
                    namespace = khulnasoftMonitorNamespace();
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 24, , 30]);
                    return [4 /*yield*/, platforms_1["default"][testPlatform].validateRequiredEnvironment()];
                case 2:
                    _b.sent();
                    imageNameAndTag = getEnvVariableOrDefault('KUBERNETES_MONITOR_IMAGE_NAME_AND_TAG', 
                    // the default, determined by ./script/build-image.sh
                    'khulnasoft/kubernetes-monitor:local');
                    console.log("platform chosen is ".concat(testPlatform, ", createCluster===").concat(createCluster));
                    kubernetesVersion = (0, platforms_1.getKubernetesVersionForPlatform)(testPlatform);
                    return [4 /*yield*/, kubectl.downloadKubectl(kubernetesVersion)];
                case 3:
                    _b.sent();
                    return [4 /*yield*/, platforms_1["default"][testPlatform].setupTester()];
                case 4:
                    _b.sent();
                    if (!createCluster) return [3 /*break*/, 7];
                    return [4 /*yield*/, platforms_1["default"][testPlatform].create(kubernetesVersion)];
                case 5:
                    _b.sent();
                    return [4 /*yield*/, platforms_1["default"][testPlatform].config()];
                case 6:
                    _b.sent();
                    return [3 /*break*/, 10];
                case 7: return [4 /*yield*/, platforms_1["default"][testPlatform].config()];
                case 8:
                    _b.sent();
                    return [4 /*yield*/, platforms_1["default"][testPlatform].clean()];
                case 9:
                    _b.sent();
                    _b.label = 10;
                case 10: return [4 /*yield*/, platforms_1["default"][testPlatform].loadImage(imageNameAndTag)];
                case 11:
                    remoteImageName = _b.sent();
                    return [4 /*yield*/, createEnvironment()];
                case 12:
                    _b.sent();
                    return [4 /*yield*/, createSecretForGcrIoAccess()];
                case 13:
                    _b.sent();
                    return [4 /*yield*/, createSecretForDockerHubAccess()];
                case 14:
                    _b.sent();
                    integrationId = getIntegrationId();
                    serviceAccountApiToken = getServiceAccountApiToken();
                    return [4 /*yield*/, predeploy(integrationId, serviceAccountApiToken, namespace)];
                case 15:
                    _b.sent();
                    imagePullPolicy = testPlatform === 'kind' || testPlatform === 'kindolm'
                        ? 'Never'
                        : 'Always';
                    deploymentImageOptions = {
                        nameAndTag: remoteImageName,
                        pullPolicy: imagePullPolicy
                    };
                    clusterName = getClusterName();
                    deploymentOptions = {
                        clusterName: clusterName
                    };
                    return [4 /*yield*/, deployers_1["default"][deploymentType].deploy(deploymentImageOptions, deploymentOptions)];
                case 16:
                    _b.sent();
                    attempt = 0;
                    _b.label = 17;
                case 17:
                    if (!(attempt < 180)) return [3 /*break*/, 23];
                    _b.label = 18;
                case 18:
                    _b.trys.push([18, 20, , 22]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get deployment.apps/khulnasoft-monitor -n ".concat(namespace))];
                case 19:
                    _b.sent();
                    return [3 /*break*/, 23];
                case 20:
                    _a = _b.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(1000)];
                case 21:
                    _b.sent();
                    return [3 /*break*/, 22];
                case 22:
                    attempt++;
                    return [3 /*break*/, 17];
                case 23:
                    console.log("Deployed the khulnasoft-monitor with integration ID: ".concat(integrationId, ", in cluster name: ").concat(clusterName));
                    return [2 /*return*/, { integrationId: integrationId, clusterName: clusterName }];
                case 24:
                    err_1 = _b.sent();
                    console.error(err_1);
                    _b.label = 25;
                case 25:
                    _b.trys.push([25, 27, 28, 29]);
                    return [4 /*yield*/, removeMonitor()];
                case 26:
                    _b.sent();
                    return [3 /*break*/, 29];
                case 27:
                    error_6 = _b.sent();
                    return [3 /*break*/, 29];
                case 28:
                    // ... but make sure the test suite doesn't proceed if the setup failed
                    process.exit(-1);
                    return [7 /*endfinally*/];
                case 29: return [3 /*break*/, 30];
                case 30: return [2 /*return*/];
            }
        });
    });
}
exports.deployMonitor = deployMonitor;
function dumpLogs() {
    return __awaiter(this, void 0, void 0, function () {
        var logDir, podNames, khulnasoftMonitorPod, logs, logPath;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logDir = "/tmp/logs/test/integration/".concat(testPlatform);
                    if (!fs.existsSync(logDir)) {
                        console.log('not dumping logs because', logDir, 'does not exist');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, kubectl.getPodNames('khulnasoft-monitor')["catch"](function () { return []; })];
                case 1:
                    podNames = _a.sent();
                    khulnasoftMonitorPod = podNames.find(function (name) {
                        return name.startsWith('khulnasoft-monitor');
                    });
                    if (khulnasoftMonitorPod === undefined) {
                        console.log('not dumping logs because khulnasoft-monitor pod does not exist');
                        return [2 /*return*/];
                    }
                    return [4 /*yield*/, kubectl.getPodLogs(khulnasoftMonitorPod, 'khulnasoft-monitor')];
                case 2:
                    logs = _a.sent();
                    logPath = "".concat(logDir, "/kubernetes-monitor.log");
                    console.log('dumping logs to', logPath);
                    fs.writeFileSync(logPath, logs);
                    return [2 /*return*/];
            }
        });
    });
}
