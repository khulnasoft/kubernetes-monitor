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
exports.getEvents = exports.waitForJob = exports.waitForCRD = exports.waitForServiceAccount = exports.waitForDeployment = exports.getPodLogs = exports.getNamespaces = exports.getPodNames = exports.getServiceAccountJson = exports.getDeploymentJson = exports.describeKubernetesResource = exports.deletePod = exports.deleteDeployment = exports.deleteResource = exports.patchNamespaceFinalizers = exports.patchResourceFinalizers = exports.createPodFromImage = exports.applyK8sYaml = exports.createConfigMap = exports.createSecret = exports.deleteNamespace = exports.createNamespace = exports.downloadKubectl = void 0;
var fs_1 = require("fs");
var os_1 = require("os");
var path_1 = require("path");
var needle_1 = require("needle");
var sleep_promise_1 = require("sleep-promise");
var exec_1 = require("./exec");
/**
 * @param version For example: "v1.18.0"
 */
function downloadKubectl(version) {
    return __awaiter(this, void 0, void 0, function () {
        var kubectlPath, requestOptions, k8sRelease, _a, osDistro, bodyData;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    kubectlPath = (0, path_1.resolve)(process.cwd(), 'kubectl');
                    if ((0, fs_1.existsSync)(kubectlPath)) {
                        (0, fs_1.unlinkSync)(kubectlPath);
                    }
                    console.log("Downloading kubectl ".concat(version, "..."));
                    requestOptions = { follow_max: 2 };
                    if (!(version === 'latest')) return [3 /*break*/, 2];
                    return [4 /*yield*/, getLatestStableK8sRelease()];
                case 1:
                    _a = _b.sent();
                    return [3 /*break*/, 3];
                case 2:
                    _a = version;
                    _b.label = 3;
                case 3:
                    k8sRelease = _a;
                    osDistro = (0, os_1.platform)();
                    bodyData = null;
                    return [4 /*yield*/, (0, needle_1["default"])('get', 'https://storage.googleapis.com/kubernetes-release/release/' +
                            "".concat(k8sRelease, "/bin/").concat(osDistro, "/amd64/kubectl"), bodyData, requestOptions).then(function (response) {
                            (0, fs_1.writeFileSync)('kubectl', response.body);
                            (0, fs_1.chmodSync)('kubectl', 493); // rwxr-xr-x
                        })];
                case 4:
                    _b.sent();
                    console.log('kubectl downloaded');
                    return [2 /*return*/];
            }
        });
    });
}
exports.downloadKubectl = downloadKubectl;
function createNamespace(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Creating namespace ".concat(namespace, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl create namespace ".concat(namespace))];
                case 1:
                    _a.sent();
                    console.log("Created namespace ".concat(namespace));
                    return [2 /*return*/];
            }
        });
    });
}
exports.createNamespace = createNamespace;
function deleteNamespace(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Deleting namespace ".concat(namespace, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl delete namespace ".concat(namespace, " --ignore-not-found"))];
                case 1:
                    _a.sent();
                    console.log("Deleted namespace ".concat(namespace));
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteNamespace = deleteNamespace;
function createSecret(secretName, namespace, secrets, secretsKeyPrefix, secretType) {
    if (secretsKeyPrefix === void 0) { secretsKeyPrefix = '--from-literal='; }
    if (secretType === void 0) { secretType = 'generic'; }
    return __awaiter(this, void 0, void 0, function () {
        var secretsAsKubectlArgument;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Creating secret ".concat(secretName, " in namespace ").concat(namespace, "..."));
                    secretsAsKubectlArgument = Object.keys(secrets).reduce(function (prev, key) { return "".concat(prev, " ").concat(secretsKeyPrefix).concat(key, "='").concat(secrets[key], "'"); }, '');
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl create secret ".concat(secretType, " ").concat(secretName, " -n ").concat(namespace, " ").concat(secretsAsKubectlArgument))];
                case 1:
                    _a.sent();
                    console.log("Created secret ".concat(secretName));
                    return [2 /*return*/];
            }
        });
    });
}
exports.createSecret = createSecret;
function createConfigMap(configMapName, namespace, filePath) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Creating config map ".concat(configMapName, " in namespace ").concat(namespace, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl create configmap ".concat(configMapName, " -n ").concat(namespace, " --from-file=").concat(filePath))];
                case 1:
                    _a.sent();
                    console.log("Created config map ".concat(configMapName));
                    return [2 /*return*/];
            }
        });
    });
}
exports.createConfigMap = createConfigMap;
function applyK8sYaml(pathToYamlDeployment, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!namespace) return [3 /*break*/, 2];
                    console.log("Applying ".concat(pathToYamlDeployment, " to namespace ").concat(namespace, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl apply -f ".concat(pathToYamlDeployment, " -n ").concat(namespace))];
                case 1:
                    _a.sent();
                    console.log("Applied ".concat(pathToYamlDeployment, " to namespace ").concat(namespace));
                    return [2 /*return*/];
                case 2:
                    console.log("Applying ".concat(pathToYamlDeployment, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl apply -f ".concat(pathToYamlDeployment))];
                case 3:
                    _a.sent();
                    console.log("Applied ".concat(pathToYamlDeployment));
                    return [2 /*return*/];
            }
        });
    });
}
exports.applyK8sYaml = applyK8sYaml;
function createPodFromImage(name, image, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Letting Kubernetes decide how to manage image ".concat(image, " with name ").concat(name));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl run ".concat(name, " --image=").concat(image, " -n ").concat(namespace, " -- sleep 999999999"))];
                case 1:
                    _a.sent();
                    console.log("Done Letting Kubernetes decide how to manage image ".concat(image, " with name ").concat(name));
                    return [2 /*return*/];
            }
        });
    });
}
exports.createPodFromImage = createPodFromImage;
function patchResourceFinalizers(kind, name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Patching resource finalizers for ".concat(kind, " ").concat(name, " in namespace ").concat(namespace, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl patch ".concat(kind, " ").concat(name, " -p '{\"metadata\":{\"finalizers\":[]}}' --type=merge -n ").concat(namespace))];
                case 1:
                    _a.sent();
                    console.log("Patched resources finalizers for ".concat(kind, " ").concat(name));
                    return [2 /*return*/];
            }
        });
    });
}
exports.patchResourceFinalizers = patchResourceFinalizers;
/**
 * https://github.com/kubernetes/kubernetes/issues/90438
 * Namespaces cannot be modified with `kubectl patch` mechanism, using proxy and API
 * @param name namespace to patch finalizers
 */
function patchNamespaceFinalizers(name) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Patching resource finalizers for namespace ".concat(name));
                    // Run proxy in background
                    return [4 /*yield*/, (0, exec_1.execWrapper)('nohup ./oc proxy > /dev/null 2>&1 &')];
                case 1:
                    // Run proxy in background
                    _a.sent();
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get ns ".concat(name, " -o json | jq '.spec = {\"finalizers\":[]}' > ").concat(name, ".json"))];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, exec_1.execWrapper)("curl -k -H \"Content-Type: application/json\" -X PUT --data-binary @".concat(name, ".json http://127.0.0.1:8001/api/v1/namespaces/").concat(name, "/finalize"))];
                case 3:
                    _a.sent();
                    // Clean up
                    return [4 /*yield*/, (0, exec_1.execWrapper)("kill -9 $(ps aux | grep proxy | head -n 1 | awk '{ print $2 }')")];
                case 4:
                    // Clean up
                    _a.sent();
                    return [4 /*yield*/, (0, exec_1.execWrapper)('rm -rf ${name}.json')];
                case 5:
                    _a.sent();
                    console.log("Patched namespace finalizers for ".concat(name));
                    return [2 /*return*/];
            }
        });
    });
}
exports.patchNamespaceFinalizers = patchNamespaceFinalizers;
function deleteResource(kind, name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Deleting ".concat(kind, " ").concat(name, " in namespace ").concat(namespace, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl delete ".concat(kind, " ").concat(name, " -n ").concat(namespace))];
                case 1:
                    _a.sent();
                    console.log("Deleted ".concat(kind, " ").concat(name));
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteResource = deleteResource;
function deleteDeployment(deploymentName, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Deleting deployment ".concat(deploymentName, " in namespace ").concat(namespace, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl delete deployment ".concat(deploymentName, " -n ").concat(namespace))];
                case 1:
                    _a.sent();
                    console.log("Deleted deployment ".concat(deploymentName));
                    return [2 /*return*/];
            }
        });
    });
}
exports.deleteDeployment = deleteDeployment;
function deletePod(podName, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Deleting pod ".concat(podName, " in namespace ").concat(namespace, "..."));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl delete pod ".concat(podName, " -n ").concat(namespace))];
                case 1:
                    _a.sent();
                    console.log("Deleted pod ".concat(podName));
                    return [2 /*return*/];
            }
        });
    });
}
exports.deletePod = deletePod;
function describeKubernetesResource(kind, name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl describe ".concat(kind, " ").concat(name, " -n ").concat(namespace))];
                case 1:
                    result = _a.sent();
                    return [2 /*return*/, result.stdout];
            }
        });
    });
}
exports.describeKubernetesResource = describeKubernetesResource;
function getDeploymentJson(deploymentName, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var getDeploymentResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get deployment ".concat(deploymentName, " -n ").concat(namespace, " -o json"))];
                case 1:
                    getDeploymentResult = _a.sent();
                    return [2 /*return*/, JSON.parse(getDeploymentResult.stdout)];
            }
        });
    });
}
exports.getDeploymentJson = getDeploymentJson;
function getServiceAccountJson(name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var getDeploymentResult;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get serviceaccount ".concat(name, " -n ").concat(namespace, " -o json"))];
                case 1:
                    getDeploymentResult = _a.sent();
                    return [2 /*return*/, JSON.parse(getDeploymentResult.stdout)];
            }
        });
    });
}
exports.getServiceAccountJson = getServiceAccountJson;
function getPodNames(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var commandPrefix, onlyNames, podsOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commandPrefix = "./kubectl -n ".concat(namespace, " get pods");
                    onlyNames = ' --template \'{{range .items}}{{.metadata.name}}{{"\\n"}}{{end}}\'';
                    return [4 /*yield*/, (0, exec_1.execWrapper)(commandPrefix + onlyNames)];
                case 1:
                    podsOutput = _a.sent();
                    return [2 /*return*/, podsOutput.stdout.split('\n')];
            }
        });
    });
}
exports.getPodNames = getPodNames;
function getNamespaces() {
    return __awaiter(this, void 0, void 0, function () {
        var commandPrefix, onlyNames, nsOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    commandPrefix = "./kubectl get ns";
                    onlyNames = ' --template \'{{range .items}}{{.metadata.name}}{{"\\n"}}{{end}}\'';
                    return [4 /*yield*/, (0, exec_1.execWrapper)(commandPrefix + onlyNames)];
                case 1:
                    nsOutput = _a.sent();
                    return [2 /*return*/, nsOutput.stdout.split('\n')];
            }
        });
    });
}
exports.getNamespaces = getNamespaces;
function getPodLogs(podName, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var logsOutput;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl -n ".concat(namespace, " logs ").concat(podName))];
                case 1:
                    logsOutput = _a.sent();
                    return [2 /*return*/, logsOutput.stdout];
            }
        });
    });
}
exports.getPodLogs = getPodLogs;
function waitForDeployment(name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, error_1, error_2, deployments, describe_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Trying to find deployment ".concat(name, " in namespace ").concat(namespace));
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 180)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get deployment.apps/".concat(name, " -n ").concat(namespace))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_1 = _a.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(1000)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log("Found deployment ".concat(name, " in namespace ").concat(namespace));
                    console.log("Begin waiting for deployment ".concat(name, " in namespace ").concat(namespace));
                    _a.label = 8;
                case 8:
                    _a.trys.push([8, 10, , 13]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl wait --for=condition=available deployment.apps/".concat(name, " -n ").concat(namespace, " --timeout=240s"))];
                case 9:
                    _a.sent();
                    return [3 /*break*/, 13];
                case 10:
                    error_2 = _a.sent();
                    console.log('Failed waiting deployment to become available', { error: error_2 });
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get deployment -n ".concat(namespace, " -o wide"))];
                case 11:
                    deployments = (_a.sent()).stdout;
                    console.log("Deployments info:", { deployments: deployments });
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl describe deployment.apps/".concat(name, " -n ").concat(namespace))];
                case 12:
                    describe_1 = (_a.sent()).stdout;
                    console.log("deployment.apps/".concat(name, " description:"), { describe: describe_1 });
                    throw error_2;
                case 13:
                    console.log("Deployment ".concat(name, " in namespace ").concat(namespace, " is available"));
                    return [2 /*return*/];
            }
        });
    });
}
exports.waitForDeployment = waitForDeployment;
function waitForServiceAccount(name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Trying to find ServiceAccount ".concat(name, " in namespace ").concat(namespace));
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 60)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get serviceaccount ".concat(name, " -n ").concat(namespace))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    err_1 = _a.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(500)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.waitForServiceAccount = waitForServiceAccount;
function waitForCRD(name) {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Trying to find CRD ".concat(name));
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 60)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get crd ".concat(name))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 4:
                    err_2 = _a.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(500)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.waitForCRD = waitForCRD;
function waitForJob(name, namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log("Trying to find job ".concat(name, " in namespace ").concat(namespace));
                    attempt = 0;
                    _a.label = 1;
                case 1:
                    if (!(attempt < 60)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get jobs/".concat(name, " -n ").concat(namespace))];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4:
                    error_3 = _a.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(1000)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7:
                    console.log("Found job ".concat(name, " in namespace ").concat(namespace));
                    console.log("Begin waiting for job ".concat(name, " in namespace ").concat(namespace, " to complete"));
                    return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl wait --for=condition=complete jobs/".concat(name, " -n ").concat(namespace, " --timeout=240s"))];
                case 8:
                    _a.sent();
                    console.log("Job ".concat(name, " in namespace ").concat(namespace, " is complete"));
                    return [2 /*return*/];
            }
        });
    });
}
exports.waitForJob = waitForJob;
function getEvents(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var events;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, exec_1.execWrapper)("./kubectl get events -n ".concat(namespace))];
                case 1:
                    events = _a.sent();
                    return [2 /*return*/, events.stdout];
            }
        });
    });
}
exports.getEvents = getEvents;
function getLatestStableK8sRelease() {
    return __awaiter(this, void 0, void 0, function () {
        var k8sRelease;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, needle_1["default"])('get', 'https://storage.googleapis.com/kubernetes-release/release/stable.txt', null).then(function (response) { return response.body.replace(/[\n\t\r]/g, '').trim(); })];
                case 1:
                    k8sRelease = _a.sent();
                    console.log("The latest stable K8s release is ".concat(k8sRelease));
                    return [2 /*return*/, k8sRelease];
            }
        });
    });
}
