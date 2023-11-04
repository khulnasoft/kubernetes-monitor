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
exports.beginWatchingWorkloads = void 0;
var logger_1 = require("../../common/logger");
var config_1 = require("../../common/config");
var types_1 = require("../types");
var handlers_1 = require("./handlers");
var cluster_1 = require("../cluster");
var internal_namespaces_1 = require("./internal-namespaces");
var namespace_1 = require("./handlers/namespace");
function setupWatchesForNamespace(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var namespaceName, _i, _a, workloadKind, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    namespaceName = (0, internal_namespaces_1.extractNamespaceName)(namespace);
                    logger_1.logger.info({ namespace: namespaceName }, 'setting up namespaced informers');
                    return [4 /*yield*/, (0, namespace_1.trackNamespace)(namespaceName)];
                case 1:
                    _b.sent();
                    _i = 0, _a = Object.values(types_1.WorkloadKind);
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    workloadKind = _a[_i];
                    // Disable handling events for k8s Jobs for debug purposes
                    if (config_1.config.SKIP_K8S_JOBS === true && workloadKind === types_1.WorkloadKind.Job) {
                        return [3 /*break*/, 6];
                    }
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, handlers_1.setupNamespacedInformer)(namespaceName, workloadKind)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_1 = _b.sent();
                    logger_1.logger.warn({ namespace: namespace, workloadKind: workloadKind }, 'could not setup namespaced workload informer, skipping');
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function setupWatchesForCluster() {
    return __awaiter(this, void 0, void 0, function () {
        var _i, _a, workloadKind, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logger_1.logger.info({}, 'setting up cluster informers');
                    return [4 /*yield*/, (0, namespace_1.trackNamespaces)()];
                case 1:
                    _b.sent();
                    _i = 0, _a = Object.values(types_1.WorkloadKind);
                    _b.label = 2;
                case 2:
                    if (!(_i < _a.length)) return [3 /*break*/, 7];
                    workloadKind = _a[_i];
                    // Disable handling events for k8s Jobs for debug purposes
                    if (config_1.config.SKIP_K8S_JOBS === true && workloadKind === types_1.WorkloadKind.Job) {
                        return [3 /*break*/, 6];
                    }
                    _b.label = 3;
                case 3:
                    _b.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, (0, handlers_1.setupClusterInformer)(workloadKind)];
                case 4:
                    _b.sent();
                    return [3 /*break*/, 6];
                case 5:
                    error_2 = _b.sent();
                    logger_1.logger.warn({ workloadKind: workloadKind }, 'could not setup cluster workload informer, skipping');
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function beginWatchingWorkloads() {
    return __awaiter(this, void 0, void 0, function () {
        var namespaceResponse, err_1, namespace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!config_1.config.WATCH_NAMESPACE) return [3 /*break*/, 6];
                    logger_1.logger.info({ namespace: config_1.config.WATCH_NAMESPACE }, 'kubernetes-monitor restricted to specific namespace');
                    namespaceResponse = void 0;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, cluster_1.k8sApi.coreClient.readNamespace(config_1.config.WATCH_NAMESPACE)];
                case 2:
                    namespaceResponse = _a.sent();
                    return [3 /*break*/, 4];
                case 3:
                    err_1 = _a.sent();
                    logger_1.logger.error({ watchedNamespace: config_1.config.WATCH_NAMESPACE, err: err_1 }, 'failed to read the namespace');
                    return [2 /*return*/];
                case 4:
                    namespace = namespaceResponse.body;
                    return [4 /*yield*/, setupWatchesForNamespace(namespace)];
                case 5:
                    _a.sent();
                    return [2 /*return*/];
                case 6: return [4 /*yield*/, setupWatchesForCluster()];
                case 7:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.beginWatchingWorkloads = beginWatchingWorkloads;
