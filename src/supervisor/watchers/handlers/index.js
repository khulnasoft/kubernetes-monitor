"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.setupClusterInformer = exports.setupNamespacedInformer = void 0;
var client_node_1 = require("@kubernetes/client-node");
var logger_1 = require("../../../common/logger");
var types_1 = require("../../types");
var cronJob = require("./cron-job");
var deploymentConfig = require("./deployment-config");
var rollout = require("./argo-rollout");
var cluster_1 = require("../../cluster");
var kubernetesApiWrappers = require("../../kuberenetes-api-wrappers");
var types_2 = require("./types");
var informer_config_1 = require("./informer-config");
var error_1 = require("./error");
var internal_namespaces_1 = require("../internal-namespaces");
function isSupportedNamespacedWorkload(namespace, workloadKind) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = workloadKind;
                    switch (_a) {
                        case types_1.WorkloadKind.ArgoRollout: return [3 /*break*/, 1];
                        case types_1.WorkloadKind.DeploymentConfig: return [3 /*break*/, 3];
                        case types_1.WorkloadKind.CronJobV1Beta1: return [3 /*break*/, 5];
                        case types_1.WorkloadKind.CronJob: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 1: return [4 /*yield*/, rollout.isNamespacedArgoRolloutSupported(namespace)];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, deploymentConfig.isNamespacedDeploymentConfigSupported(namespace)];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, cronJob.isNamespacedCronJobSupported(workloadKind, namespace)];
                case 6: return [2 /*return*/, _b.sent()];
                case 7: return [4 /*yield*/, cronJob.isNamespacedCronJobSupported(workloadKind, namespace)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9: return [2 /*return*/, true];
            }
        });
    });
}
function isSupportedClusterWorkload(workloadKind) {
    return __awaiter(this, void 0, void 0, function () {
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _a = workloadKind;
                    switch (_a) {
                        case types_1.WorkloadKind.DeploymentConfig: return [3 /*break*/, 1];
                        case types_1.WorkloadKind.ArgoRollout: return [3 /*break*/, 3];
                        case types_1.WorkloadKind.CronJobV1Beta1: return [3 /*break*/, 5];
                        case types_1.WorkloadKind.CronJob: return [3 /*break*/, 7];
                    }
                    return [3 /*break*/, 9];
                case 1: return [4 /*yield*/, deploymentConfig.isClusterDeploymentConfigSupported()];
                case 2: return [2 /*return*/, _b.sent()];
                case 3: return [4 /*yield*/, rollout.isClusterArgoRolloutSupported()];
                case 4: return [2 /*return*/, _b.sent()];
                case 5: return [4 /*yield*/, cronJob.isClusterCronJobSupported(workloadKind)];
                case 6: return [2 /*return*/, _b.sent()];
                case 7: return [4 /*yield*/, cronJob.isClusterCronJobSupported(workloadKind)];
                case 8: return [2 /*return*/, _b.sent()];
                case 9: return [2 /*return*/, true];
            }
        });
    });
}
function setupNamespacedInformer(namespace, workloadKind) {
    return __awaiter(this, void 0, void 0, function () {
        var logContext, isSupported, workloadMetadata, endpoint, listMethod, loggedListMethod, informer, _loop_1, _i, _a, informerVerb;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logContext = { namespace: namespace, workloadKind: workloadKind };
                    return [4 /*yield*/, isSupportedNamespacedWorkload(namespace, workloadKind)];
                case 1:
                    isSupported = _b.sent();
                    if (!isSupported) {
                        logger_1.logger.debug(logContext, 'The Kubernetes cluster does not support this workload');
                        return [2 /*return*/];
                    }
                    workloadMetadata = informer_config_1.workloadWatchMetadata[workloadKind];
                    endpoint = workloadMetadata.namespacedEndpoint.replace('{namespace}', namespace);
                    listMethod = workloadMetadata.namespacedListFactory(namespace);
                    loggedListMethod = function () { return __awaiter(_this, void 0, void 0, function () {
                        var error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                                            return listMethod();
                                        })];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    error_2 = _a.sent();
                                    logger_1.logger.error(__assign(__assign({}, logContext), { error: error_2 }), 'error while listing workloads in namespace');
                                    throw error_2;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    informer = (0, client_node_1.makeInformer)(cluster_1.kubeConfig, endpoint, loggedListMethod);
                    informer.on(client_node_1.ERROR, (0, error_1.restartableErrorHandler)(informer, logContext));
                    _loop_1 = function (informerVerb) {
                        informer.on(informerVerb, function (watchedWorkload) { return __awaiter(_this, void 0, void 0, function () {
                            var error_3, name_1;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        _a.trys.push([0, 2, , 3]);
                                        return [4 /*yield*/, workloadMetadata.handlers[informerVerb](watchedWorkload)];
                                    case 1:
                                        _a.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_3 = _a.sent();
                                        name_1 = (watchedWorkload.metadata && watchedWorkload.metadata.name) ||
                                            types_2.FALSY_WORKLOAD_NAME_MARKER;
                                        logger_1.logger.warn(__assign(__assign({}, logContext), { error: error_3, workloadName: name_1 }), 'could not execute the namespaced informer handler for a workload');
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    for (_i = 0, _a = Object.keys(workloadMetadata.handlers); _i < _a.length; _i++) {
                        informerVerb = _a[_i];
                        _loop_1(informerVerb);
                    }
                    return [4 /*yield*/, informer.start()];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setupNamespacedInformer = setupNamespacedInformer;
function setupClusterInformer(workloadKind) {
    return __awaiter(this, void 0, void 0, function () {
        var logContext, isSupported, workloadMetadata, endpoint, listMethod, loggedListMethod, informer, _loop_2, _i, _a, informerVerb;
        var _this = this;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logContext = { workloadKind: workloadKind };
                    return [4 /*yield*/, isSupportedClusterWorkload(workloadKind)];
                case 1:
                    isSupported = _b.sent();
                    if (!isSupported) {
                        logger_1.logger.debug(logContext, 'The Kubernetes cluster does not support this workload');
                        return [2 /*return*/];
                    }
                    workloadMetadata = informer_config_1.workloadWatchMetadata[workloadKind];
                    endpoint = workloadMetadata.clusterEndpoint;
                    listMethod = workloadMetadata.clusterListFactory();
                    loggedListMethod = function () { return __awaiter(_this, void 0, void 0, function () {
                        var error_4;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                                            return listMethod();
                                        })];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    error_4 = _a.sent();
                                    logger_1.logger.error(__assign(__assign({}, logContext), { error: error_4 }), 'error while listing workloads in cluster');
                                    throw error_4;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    informer = (0, client_node_1.makeInformer)(cluster_1.kubeConfig, endpoint, loggedListMethod);
                    informer.on(client_node_1.ERROR, (0, error_1.restartableErrorHandler)(informer, logContext));
                    _loop_2 = function (informerVerb) {
                        informer.on(informerVerb, function (watchedWorkload) { return __awaiter(_this, void 0, void 0, function () {
                            var error_5, name_2;
                            var _a;
                            return __generator(this, function (_b) {
                                switch (_b.label) {
                                    case 0:
                                        _b.trys.push([0, 2, , 3]);
                                        if ((0, internal_namespaces_1.isExcludedNamespace)(((_a = watchedWorkload.metadata) === null || _a === void 0 ? void 0 : _a.namespace) || '')) {
                                            return [2 /*return*/];
                                        }
                                        return [4 /*yield*/, workloadMetadata.handlers[informerVerb](watchedWorkload)];
                                    case 1:
                                        _b.sent();
                                        return [3 /*break*/, 3];
                                    case 2:
                                        error_5 = _b.sent();
                                        name_2 = (watchedWorkload.metadata && watchedWorkload.metadata.name) ||
                                            types_2.FALSY_WORKLOAD_NAME_MARKER;
                                        logger_1.logger.warn(__assign(__assign({}, logContext), { error: error_5, workloadName: name_2 }), 'could not execute the cluster informer handler for a workload');
                                        return [3 /*break*/, 3];
                                    case 3: return [2 /*return*/];
                                }
                            });
                        }); });
                    };
                    for (_i = 0, _a = Object.keys(workloadMetadata.handlers); _i < _a.length; _i++) {
                        informerVerb = _a[_i];
                        _loop_2(informerVerb);
                    }
                    return [4 /*yield*/, informer.start()];
                case 2:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.setupClusterInformer = setupClusterInformer;
