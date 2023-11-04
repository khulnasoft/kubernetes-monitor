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
exports.daemonSetWatchHandler = exports.paginatedClusterDaemonSetList = exports.paginatedNamespacedDaemonSetList = void 0;
var client_node_1 = require("@kubernetes/client-node");
var workload_1 = require("./workload");
var types_1 = require("../../types");
var types_2 = require("./types");
var cluster_1 = require("../../cluster");
var pagination_1 = require("./pagination");
var state_1 = require("../../../state");
var workload_sanitization_1 = require("../../workload-sanitization");
var queue_1 = require("./queue");
function paginatedNamespacedDaemonSetList(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var v1DaemonSetList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    v1DaemonSetList = new client_node_1.V1DaemonSetList();
                    v1DaemonSetList.apiVersion = 'apps/v1';
                    v1DaemonSetList.kind = 'DaemonSetList';
                    v1DaemonSetList.items = new Array();
                    return [4 /*yield*/, (0, pagination_1.paginatedNamespacedList)(namespace, v1DaemonSetList, cluster_1.k8sApi.appsClient.listNamespacedDaemonSet.bind(cluster_1.k8sApi.appsClient))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.paginatedNamespacedDaemonSetList = paginatedNamespacedDaemonSetList;
function paginatedClusterDaemonSetList() {
    return __awaiter(this, void 0, void 0, function () {
        var v1DaemonSetList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    v1DaemonSetList = new client_node_1.V1DaemonSetList();
                    v1DaemonSetList.apiVersion = 'apps/v1';
                    v1DaemonSetList.kind = 'DaemonSetList';
                    v1DaemonSetList.items = new Array();
                    return [4 /*yield*/, (0, pagination_1.paginatedClusterList)(v1DaemonSetList, cluster_1.k8sApi.appsClient.listDaemonSetForAllNamespaces.bind(cluster_1.k8sApi.appsClient))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.paginatedClusterDaemonSetList = paginatedClusterDaemonSetList;
function daemonSetWatchHandler(daemonSet) {
    return __awaiter(this, void 0, void 0, function () {
        var workloadAlreadyScanned, workloadName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    daemonSet = (0, workload_sanitization_1.trimWorkload)(daemonSet);
                    if (!daemonSet.metadata ||
                        !daemonSet.spec ||
                        !daemonSet.spec.template.metadata ||
                        !daemonSet.spec.template.spec ||
                        !daemonSet.status) {
                        return [2 /*return*/];
                    }
                    workloadAlreadyScanned = (0, state_1.kubernetesObjectToWorkloadAlreadyScanned)(daemonSet);
                    if (workloadAlreadyScanned !== undefined) {
                        (0, state_1.deleteWorkloadAlreadyScanned)(workloadAlreadyScanned);
                        (0, state_1.deleteWorkloadImagesAlreadyScanned)(__assign(__assign({}, workloadAlreadyScanned), { imageIds: daemonSet.spec.template.spec.containers
                                .filter(function (container) { return container.image !== undefined; })
                                .map(function (container) { return container.image; }) }));
                        (0, queue_1.deleteWorkloadFromScanQueue)(workloadAlreadyScanned);
                    }
                    workloadName = daemonSet.metadata.name || types_2.FALSY_WORKLOAD_NAME_MARKER;
                    return [4 /*yield*/, (0, workload_1.deleteWorkload)({
                            kind: types_1.WorkloadKind.DaemonSet,
                            objectMeta: daemonSet.metadata,
                            specMeta: daemonSet.spec.template.metadata,
                            ownerRefs: daemonSet.metadata.ownerReferences,
                            revision: daemonSet.status.observedGeneration,
                            podSpec: daemonSet.spec.template.spec
                        }, workloadName)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.daemonSetWatchHandler = daemonSetWatchHandler;
