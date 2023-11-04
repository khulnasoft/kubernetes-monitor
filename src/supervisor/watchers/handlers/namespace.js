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
exports.trackNamespace = exports.trackNamespaces = void 0;
var client_node_1 = require("@kubernetes/client-node");
var sleep_promise_1 = require("sleep-promise");
var logger_1 = require("../../../common/logger");
var state_1 = require("../../../state");
var cluster_1 = require("../../cluster");
var kuberenetes_api_wrappers_1 = require("../../kuberenetes-api-wrappers");
var workload_sanitization_1 = require("../../workload-sanitization");
var types_1 = require("../types");
var error_1 = require("./error");
var pagination_1 = require("./pagination");
/**
 * We need to track all namespaces in the cluster so that we can detect usage of the namespaced annotated import.
 * For this feature there will be a special annotation on the namespace, which indicates that all workloads
 * in that namespace should be automatically imported.
 *
 * This function tracks changes to all namespaces in the cluster.
 *
 * @deprecated We prefer customers to move to workload auto-import with Rego policy.
 * This feature should be removed at some point!
 */
function trackNamespaces() {
    return __awaiter(this, void 0, void 0, function () {
        var logContext, endpoint, loggedListMethod, informer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logContext = {};
                    endpoint = '/api/v1/namespaces';
                    loggedListMethod = function () { return __awaiter(_this, void 0, void 0, function () {
                        var error_2;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, (0, kuberenetes_api_wrappers_1.retryKubernetesApiRequest)(function () { return paginatedNamespaceList(); })];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    error_2 = _a.sent();
                                    logger_1.logger.error(__assign(__assign({}, logContext), { error: error_2 }), 'error while listing namespaces in cluster');
                                    throw error_2;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    informer = (0, client_node_1.makeInformer)(cluster_1.kubeConfig, endpoint, loggedListMethod);
                    informer.on(client_node_1.ADD, state_1.storeNamespace);
                    informer.on(client_node_1.UPDATE, state_1.storeNamespace);
                    informer.on(client_node_1.DELETE, state_1.deleteNamespace);
                    informer.on(client_node_1.ERROR, (0, error_1.restartableErrorHandler)(informer, logContext));
                    return [4 /*yield*/, informer.start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.trackNamespaces = trackNamespaces;
/**
 * We need to track all namespaces in the cluster so that we can detect usage of the namespaced annotated import.
 * For this feature there will be a special annotation on the namespace, which indicates that all workloads
 * in that namespace should be automatically imported.
 *
 * This function tracks just a single namespace. It's used when the khulnasoft-monitor is deployed to monitor
 * just a single namespace.
 *
 * @deprecated We prefer customers to move to workload auto-import with Rego policy.
 * This feature should be removed at some point!
 */
function trackNamespace(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var logContext, endpoint, loggedListMethod, informer;
        var _this = this;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    logContext = {};
                    endpoint = "/api/v1/watch/namespaces/".concat(namespace);
                    loggedListMethod = function () { return __awaiter(_this, void 0, void 0, function () {
                        var error_3;
                        var _this = this;
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    _a.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, (0, kuberenetes_api_wrappers_1.retryKubernetesApiRequest)(function () { return __awaiter(_this, void 0, void 0, function () {
                                            var reply, list;
                                            var _a;
                                            return __generator(this, function (_b) {
                                                switch (_b.label) {
                                                    case 0: return [4 /*yield*/, cluster_1.k8sApi.coreClient.readNamespace(namespace)];
                                                    case 1:
                                                        reply = _b.sent();
                                                        list = new client_node_1.V1NamespaceList();
                                                        list.apiVersion = 'v1';
                                                        list.kind = 'NamespaceList';
                                                        list.items = new Array(reply.body);
                                                        list.metadata = new client_node_1.V1ListMeta();
                                                        list.metadata.resourceVersion = (_a = reply.body.metadata) === null || _a === void 0 ? void 0 : _a.resourceVersion;
                                                        return [2 /*return*/, {
                                                                response: reply.response,
                                                                body: list
                                                            }];
                                                }
                                            });
                                        }); })];
                                case 1: return [2 /*return*/, _a.sent()];
                                case 2:
                                    error_3 = _a.sent();
                                    logger_1.logger.error(__assign(__assign({}, logContext), { error: error_3 }), 'error while listing namespace');
                                    throw error_3;
                                case 3: return [2 /*return*/];
                            }
                        });
                    }); };
                    informer = (0, client_node_1.makeInformer)(cluster_1.kubeConfig, endpoint, loggedListMethod);
                    informer.on(client_node_1.ADD, state_1.storeNamespace);
                    informer.on(client_node_1.UPDATE, state_1.storeNamespace);
                    informer.on(client_node_1.DELETE, state_1.deleteNamespace);
                    informer.on(client_node_1.ERROR, (0, error_1.restartableErrorHandler)(informer, logContext));
                    return [4 /*yield*/, informer.start()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.trackNamespace = trackNamespace;
function paginatedNamespaceList() {
    return __awaiter(this, void 0, void 0, function () {
        var v1NamespaceList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    v1NamespaceList = new client_node_1.V1NamespaceList();
                    v1NamespaceList.apiVersion = 'v1';
                    v1NamespaceList.kind = 'NamespaceList';
                    v1NamespaceList.items = new Array();
                    return [4 /*yield*/, listPaginatedNamespaces(v1NamespaceList)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
/**
 * This function ensures that when listing workloads from the Kubernetes API, they are paginated in batches of 100.
 * The workloads collected are additionally trimmed to contain only the relevant data for vulnerability analysis.
 * The combination of both listing and trimming ensures we reduce our memory footprint and prevent overloading the API server.
 */
function listPaginatedNamespaces(list) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var continueToken, pretty, allowWatchBookmarks, fieldSelector, labelSelector, incomingMessage, listCall, trimmedItems, err_1, error, seconds, _c, seconds;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    continueToken = undefined;
                    pretty = undefined;
                    allowWatchBookmarks = undefined;
                    fieldSelector = undefined;
                    labelSelector = undefined;
                    incomingMessage = undefined;
                    _e.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 13];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 12]);
                    return [4 /*yield*/, cluster_1.k8sApi.coreClient.listNamespace(pretty, allowWatchBookmarks, continueToken, fieldSelector, labelSelector, pagination_1.PAGE_SIZE)];
                case 3:
                    listCall = _e.sent();
                    incomingMessage = listCall.response;
                    list.metadata = listCall.body.metadata;
                    if (Array.isArray(listCall.body.items)) {
                        trimmedItems = (0, workload_sanitization_1.trimWorkloads)(listCall.body.items);
                        (_d = list.items).push.apply(_d, trimmedItems);
                    }
                    continueToken = (_a = listCall.body.metadata) === null || _a === void 0 ? void 0 : _a._continue;
                    if (!continueToken) {
                        return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 12];
                case 4:
                    err_1 = _e.sent();
                    error = err_1;
                    if (!(types_1.RETRYABLE_NETWORK_ERROR_CODES.includes(error.code || '') ||
                        types_1.RETRYABLE_NETWORK_ERROR_MESSAGES.includes(error.message || ''))) return [3 /*break*/, 6];
                    seconds = (0, kuberenetes_api_wrappers_1.calculateSleepSeconds)();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(seconds)];
                case 5:
                    _e.sent();
                    return [3 /*break*/, 1];
                case 6:
                    _c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.statusCode;
                    switch (_c) {
                        case 410: return [3 /*break*/, 7];
                        case 429: return [3 /*break*/, 8];
                        case 502: return [3 /*break*/, 8];
                        case 503: return [3 /*break*/, 8];
                        case 504: return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 7: // Gone
                return [3 /*break*/, 13];
                case 8:
                    seconds = (0, kuberenetes_api_wrappers_1.calculateSleepSeconds)(error.response);
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(seconds)];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 1];
                case 10: throw err_1;
                case 11: return [3 /*break*/, 12];
                case 12: return [3 /*break*/, 1];
                case 13:
                    if (!incomingMessage) {
                        throw new Error('could not list workload');
                    }
                    return [2 /*return*/, {
                            response: incomingMessage,
                            body: list
                        }];
            }
        });
    });
}
