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
exports.isClusterArgoRolloutSupported = exports.isNamespacedArgoRolloutSupported = exports.argoRolloutWatchHandler = exports.paginatedClusterArgoRolloutList = exports.paginatedNamespacedArgoRolloutList = void 0;
var workload_1 = require("./workload");
var types_1 = require("../../types");
var types_2 = require("./types");
var pagination_1 = require("./pagination");
var cluster_1 = require("../../cluster");
var state_1 = require("../../../state");
var kuberenetes_api_wrappers_1 = require("../../kuberenetes-api-wrappers");
var logger_1 = require("../../../common/logger");
var queue_1 = require("./queue");
var workload_sanitization_1 = require("../../workload-sanitization");
function paginatedNamespacedArgoRolloutList(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var rolloutList;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rolloutList = new types_2.V1alpha1RolloutList();
                    rolloutList.apiVersion = 'argoproj.io/v1alpha1';
                    rolloutList.kind = 'RolloutList';
                    rolloutList.items = new Array();
                    return [4 /*yield*/, (0, pagination_1.paginatedNamespacedList)(namespace, rolloutList, function (namespace, pretty, _allowWatchBookmarks, _continue, fieldSelector, labelSelector, limit) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, cluster_1.k8sApi.customObjectsClient.listNamespacedCustomObject('argoproj.io', 'v1alpha1', namespace, 'rollouts', pretty, false, _continue, fieldSelector, labelSelector, limit)];
                            });
                        }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.paginatedNamespacedArgoRolloutList = paginatedNamespacedArgoRolloutList;
function paginatedClusterArgoRolloutList() {
    return __awaiter(this, void 0, void 0, function () {
        var rolloutList;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rolloutList = new types_2.V1alpha1RolloutList();
                    rolloutList.apiVersion = 'argoproj.io/v1';
                    rolloutList.kind = 'RolloutList';
                    rolloutList.items = new Array();
                    return [4 /*yield*/, (0, pagination_1.paginatedClusterList)(rolloutList, function (_allowWatchBookmarks, _continue, fieldSelector, labelSelector, limit, pretty) { return __awaiter(_this, void 0, void 0, function () {
                            return __generator(this, function (_a) {
                                return [2 /*return*/, cluster_1.k8sApi.customObjectsClient.listClusterCustomObject('argoproj.io', 'v1alpha1', 'rollouts', pretty, false, _continue, fieldSelector, labelSelector, limit)];
                            });
                        }); })];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.paginatedClusterArgoRolloutList = paginatedClusterArgoRolloutList;
function argoRolloutWatchHandler(rollout) {
    return __awaiter(this, void 0, void 0, function () {
        var workloadAlreadyScanned, workloadName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    rollout = (0, workload_sanitization_1.trimWorkload)(rollout);
                    if (!rollout.metadata ||
                        !rollout.spec ||
                        !rollout.spec.template.metadata ||
                        !rollout.spec.template.spec ||
                        !rollout.status) {
                        return [2 /*return*/];
                    }
                    workloadAlreadyScanned = (0, state_1.kubernetesObjectToWorkloadAlreadyScanned)(rollout);
                    if (workloadAlreadyScanned !== undefined) {
                        (0, state_1.deleteWorkloadAlreadyScanned)(workloadAlreadyScanned);
                        (0, state_1.deleteWorkloadImagesAlreadyScanned)(__assign(__assign({}, workloadAlreadyScanned), { imageIds: rollout.spec.template.spec.containers
                                .filter(function (container) { return container.image !== undefined; })
                                .map(function (container) { return container.image; }) }));
                        (0, queue_1.deleteWorkloadFromScanQueue)(workloadAlreadyScanned);
                    }
                    workloadName = rollout.metadata.name || types_2.FALSY_WORKLOAD_NAME_MARKER;
                    return [4 /*yield*/, (0, workload_1.deleteWorkload)({
                            kind: types_1.WorkloadKind.ArgoRollout,
                            objectMeta: rollout.metadata,
                            specMeta: rollout.spec.template.metadata,
                            ownerRefs: rollout.metadata.ownerReferences,
                            revision: rollout.status.observedGeneration,
                            podSpec: rollout.spec.template.spec
                        }, workloadName)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.argoRolloutWatchHandler = argoRolloutWatchHandler;
function isNamespacedArgoRolloutSupported(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var pretty_1, continueToken_1, fieldSelector_1, labelSelector_1, limit_1, resourceVersion_1, timeoutSeconds_1, attemptedApiCall, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pretty_1 = undefined;
                    continueToken_1 = undefined;
                    fieldSelector_1 = undefined;
                    labelSelector_1 = undefined;
                    limit_1 = 1;
                    resourceVersion_1 = undefined;
                    timeoutSeconds_1 = 10;
                    return [4 /*yield*/, (0, kuberenetes_api_wrappers_1.retryKubernetesApiRequest)(function () {
                            return cluster_1.k8sApi.customObjectsClient.listNamespacedCustomObject('argoproj.io', 'v1alpha1', namespace, 'rollouts', pretty_1, false, continueToken_1, fieldSelector_1, labelSelector_1, limit_1, resourceVersion_1, undefined, timeoutSeconds_1);
                        })];
                case 1:
                    attemptedApiCall = _a.sent();
                    return [2 /*return*/, (attemptedApiCall !== undefined &&
                            attemptedApiCall.response !== undefined &&
                            attemptedApiCall.response.statusCode !== undefined &&
                            attemptedApiCall.response.statusCode >= 200 &&
                            attemptedApiCall.response.statusCode < 300)];
                case 2:
                    error_1 = _a.sent();
                    logger_1.logger.debug({ error: error_1, workloadKind: types_1.WorkloadKind.ArgoRollout }, 'Failed on Kubernetes API call to list namespaced argoproj.io/Rollout');
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.isNamespacedArgoRolloutSupported = isNamespacedArgoRolloutSupported;
function isClusterArgoRolloutSupported() {
    return __awaiter(this, void 0, void 0, function () {
        var pretty_2, continueToken_2, fieldSelector_2, labelSelector_2, limit_2, resourceVersion_2, timeoutSeconds_2, attemptedApiCall, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    pretty_2 = undefined;
                    continueToken_2 = undefined;
                    fieldSelector_2 = undefined;
                    labelSelector_2 = undefined;
                    limit_2 = 1;
                    resourceVersion_2 = undefined;
                    timeoutSeconds_2 = 10;
                    return [4 /*yield*/, (0, kuberenetes_api_wrappers_1.retryKubernetesApiRequest)(function () {
                            return cluster_1.k8sApi.customObjectsClient.listClusterCustomObject('argoproj.io', 'v1alpha1', 'rollouts', pretty_2, false, continueToken_2, fieldSelector_2, labelSelector_2, limit_2, resourceVersion_2, undefined, timeoutSeconds_2);
                        })];
                case 1:
                    attemptedApiCall = _a.sent();
                    return [2 /*return*/, (attemptedApiCall !== undefined &&
                            attemptedApiCall.response !== undefined &&
                            attemptedApiCall.response.statusCode !== undefined &&
                            attemptedApiCall.response.statusCode >= 200 &&
                            attemptedApiCall.response.statusCode < 300)];
                case 2:
                    error_2 = _a.sent();
                    logger_1.logger.debug({ error: error_2, workloadKind: types_1.WorkloadKind.ArgoRollout }, 'Failed on Kubernetes API call to list cluster argoproj.io/Rollout');
                    return [2 /*return*/, false];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.isClusterArgoRolloutSupported = isClusterArgoRolloutSupported;
