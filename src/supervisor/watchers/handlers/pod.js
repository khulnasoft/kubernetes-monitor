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
exports.podDeletedHandler = exports.podWatchHandler = exports.paginatedClusterPodList = exports.paginatedNamespacedPodList = exports.isPodReady = exports.handleReadyPod = void 0;
var client_node_1 = require("@kubernetes/client-node");
var logger_1 = require("../../../common/logger");
var transmitter_1 = require("../../../transmitter");
var payload_1 = require("../../../transmitter/payload");
var metadata_extractor_1 = require("../../metadata-extractor");
var types_1 = require("../types");
var state_1 = require("../../../state");
var types_2 = require("./types");
var types_3 = require("../../types");
var workload_1 = require("./workload");
var cluster_1 = require("../../cluster");
var pagination_1 = require("./pagination");
var workload_sanitization_1 = require("../../workload-sanitization");
var queue_1 = require("./queue");
/** Exported for testing */
function handleReadyPod(workloadMetadata) {
    return __awaiter(this, void 0, void 0, function () {
        var workloadToScan, _i, workloadMetadata_1, workload_2, scanned, workload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workloadToScan = [];
                    for (_i = 0, workloadMetadata_1 = workloadMetadata; _i < workloadMetadata_1.length; _i++) {
                        workload_2 = workloadMetadata_1[_i];
                        scanned = (0, state_1.getWorkloadImageAlreadyScanned)(workload_2, workload_2.imageName, workload_2.imageId);
                        // ImageID contains the resolved image digest.
                        // ImageName may contain a tag. The image behind this tag can be mutated and can change over time.
                        // We need to compare on ImageID which will reliably tell us if the image has changed.
                        if (scanned === workload_2.imageId) {
                            logger_1.logger.debug({ workloadToScan: workloadToScan, imageId: workload_2.imageId }, 'image already scanned');
                            continue;
                        }
                        logger_1.logger.debug({ workloadToScan: workloadToScan, imageId: workload_2.imageId }, 'image has not been scanned');
                        (0, state_1.setWorkloadImageAlreadyScanned)(workload_2, workload_2.imageName, workload_2.imageId);
                        workloadToScan.push(workload_2);
                    }
                    workload = workloadToScan[0];
                    if (!(workloadToScan.length > 0)) return [3 /*break*/, 2];
                    return [4 /*yield*/, queue_1.workloadsToScanQueue.pushAsync({
                            key: workload.uid,
                            workloadMetadata: workloadToScan,
                            enqueueTimestampMs: Date.now()
                        })];
                case 1:
                    _a.sent();
                    _a.label = 2;
                case 2: return [2 /*return*/];
            }
        });
    });
}
exports.handleReadyPod = handleReadyPod;
function isPodReady(pod) {
    var _a, _b, _c, _d;
    var isTerminating = ((_a = pod.metadata) === null || _a === void 0 ? void 0 : _a.deletionTimestamp) !== undefined;
    var podStatusPhase = ((_b = pod.status) === null || _b === void 0 ? void 0 : _b.phase) === types_1.PodPhase.Running;
    var containerReadyStatuses = Boolean((_d = (_c = pod.status) === null || _c === void 0 ? void 0 : _c.containerStatuses) === null || _d === void 0 ? void 0 : _d.every(function (container) { var _a; return ((_a = container.state) === null || _a === void 0 ? void 0 : _a.running) !== undefined; }));
    var logContext = {
        isTerminating: isTerminating,
        podStatusPhase: podStatusPhase,
        containerReadyStatuses: containerReadyStatuses
    };
    logger_1.logger.debug(logContext, 'checking to see if pod is ready to process');
    return !isTerminating && podStatusPhase && containerReadyStatuses;
}
exports.isPodReady = isPodReady;
function paginatedNamespacedPodList(namespace) {
    return __awaiter(this, void 0, void 0, function () {
        var v1PodList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    v1PodList = new client_node_1.V1PodList();
                    v1PodList.apiVersion = 'v1';
                    v1PodList.kind = 'PodList';
                    v1PodList.items = new Array();
                    return [4 /*yield*/, (0, pagination_1.paginatedNamespacedList)(namespace, v1PodList, cluster_1.k8sApi.coreClient.listNamespacedPod.bind(cluster_1.k8sApi.coreClient))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.paginatedNamespacedPodList = paginatedNamespacedPodList;
function paginatedClusterPodList() {
    return __awaiter(this, void 0, void 0, function () {
        var v1PodList;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    v1PodList = new client_node_1.V1PodList();
                    v1PodList.apiVersion = 'v1';
                    v1PodList.kind = 'PodList';
                    v1PodList.items = new Array();
                    return [4 /*yield*/, (0, pagination_1.paginatedClusterList)(v1PodList, cluster_1.k8sApi.coreClient.listPodForAllNamespaces.bind(cluster_1.k8sApi.coreClient))];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}
exports.paginatedClusterPodList = paginatedClusterPodList;
function podWatchHandler(pod) {
    return __awaiter(this, void 0, void 0, function () {
        var podName, workloadMetadata, workloadMember, workloadMetadataPayload, workloadRevision, scannedRevision, isRevisionDifferent, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    // This tones down the number of scans whenever a Pod is about to be scheduled by K8s
                    if (!isPodReady(pod)) {
                        return [2 /*return*/];
                    }
                    pod = (0, workload_sanitization_1.trimWorkload)(pod);
                    podName = pod.metadata && pod.metadata.name
                        ? pod.metadata.name
                        : types_2.FALSY_WORKLOAD_NAME_MARKER;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    return [4 /*yield*/, (0, metadata_extractor_1.buildMetadataForWorkload)(pod)];
                case 2:
                    workloadMetadata = _a.sent();
                    if (workloadMetadata === undefined || workloadMetadata.length === 0) {
                        logger_1.logger.warn({ podName: podName }, 'could not process pod, the workload is possibly unsupported or deleted');
                        return [2 /*return*/];
                    }
                    workloadMember = workloadMetadata[0];
                    workloadMetadataPayload = (0, payload_1.constructWorkloadMetadata)(workloadMember);
                    workloadRevision = workloadMember.revision
                        ? workloadMember.revision.toString()
                        : '';
                    scannedRevision = (0, state_1.getWorkloadAlreadyScanned)(workloadMember);
                    isRevisionDifferent = scannedRevision === undefined ||
                        Number(workloadRevision) > Number(scannedRevision);
                    if (!isRevisionDifferent) return [3 /*break*/, 4];
                    (0, state_1.setWorkloadAlreadyScanned)(workloadMember, workloadRevision);
                    return [4 /*yield*/, (0, transmitter_1.sendWorkloadMetadata)(workloadMetadataPayload)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4: return [4 /*yield*/, handleReadyPod(workloadMetadata)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 7];
                case 6:
                    error_1 = _a.sent();
                    logger_1.logger.error({ error: error_1, podName: podName }, 'could not build image metadata for pod');
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.podWatchHandler = podWatchHandler;
function podDeletedHandler(pod) {
    return __awaiter(this, void 0, void 0, function () {
        var workloadAlreadyScanned, workloadName;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!pod.metadata || !pod.spec) {
                        return [2 /*return*/];
                    }
                    workloadAlreadyScanned = (0, state_1.kubernetesObjectToWorkloadAlreadyScanned)(pod);
                    if (workloadAlreadyScanned !== undefined) {
                        (0, state_1.deleteWorkloadAlreadyScanned)(workloadAlreadyScanned);
                        (0, state_1.deleteWorkloadImagesAlreadyScanned)(__assign(__assign({}, workloadAlreadyScanned), { imageIds: pod.spec.containers
                                .filter(function (container) { return container.image !== undefined; })
                                .map(function (container) { return container.image; }) }));
                        (0, queue_1.deleteWorkloadFromScanQueue)(workloadAlreadyScanned);
                    }
                    workloadName = pod.metadata.name || types_2.FALSY_WORKLOAD_NAME_MARKER;
                    return [4 /*yield*/, (0, workload_1.deleteWorkload)({
                            kind: types_3.WorkloadKind.Pod,
                            objectMeta: pod.metadata,
                            specMeta: pod.metadata,
                            ownerRefs: pod.metadata.ownerReferences,
                            podSpec: pod.spec
                        }, workloadName)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.podDeletedHandler = podDeletedHandler;
