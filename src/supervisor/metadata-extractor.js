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
exports.buildMetadataForWorkload = exports.isPodAssociatedWithParent = exports.buildWorkloadMetadata = exports.buildImageMetadata = void 0;
var cluster_1 = require("./cluster");
var types_1 = require("./types");
var workload_reader_1 = require("./workload-reader");
var logger_1 = require("../common/logger");
var config_1 = require("../common/config");
var loopingThreshold = 20;
// Constructs the workload metadata based on a variety of k8s properties.
// https://www.notion.so/khulnasoft/Kubernetes-workload-fields-we-should-collect-c60c8f0395f241978282173f4c133a34
function buildImageMetadata(workloadMeta, containerStatuses) {
    var kind = workloadMeta.kind, objectMeta = workloadMeta.objectMeta, specMeta = workloadMeta.specMeta, revision = workloadMeta.revision, podSpec = workloadMeta.podSpec;
    var name = objectMeta.name, namespace = objectMeta.namespace, labels = objectMeta.labels, annotations = objectMeta.annotations, uid = objectMeta.uid;
    var containerNameToSpec = {};
    if (podSpec.containers) {
        for (var _i = 0, _a = podSpec.containers; _i < _a.length; _i++) {
            var container = _a[_i];
            delete container.args;
            delete container.env;
            delete container.command;
            //! would container.envFrom also include sensitive data?
            containerNameToSpec[container.name] = container;
        }
    }
    var containerNameToStatus = {};
    for (var _b = 0, containerStatuses_1 = containerStatuses; _b < containerStatuses_1.length; _b++) {
        var containerStatus = containerStatuses_1[_b];
        containerNameToStatus[containerStatus.name] = containerStatus;
    }
    var images = [];
    for (var _c = 0, containerStatuses_2 = containerStatuses; _c < containerStatuses_2.length; _c++) {
        var containerStatus = containerStatuses_2[_c];
        if (!(containerStatus.name in containerNameToSpec)) {
            logger_1.logger.debug({
                workloadName: workloadMeta.objectMeta.name,
                workloadType: workloadMeta.kind,
                workloadNamespace: workloadMeta.objectMeta.namespace,
                containerName: containerStatus.name,
                image: containerStatus.image,
                imageId: containerStatus.imageID
            }, 'container name is not in containerNameToSpec lists');
            continue;
        }
        images.push({
            type: kind,
            name: name || 'unknown',
            namespace: namespace,
            labels: labels || {},
            annotations: annotations || {},
            uid: uid,
            specLabels: specMeta.labels || {},
            specAnnotations: specMeta.annotations || {},
            containerName: containerStatus.name,
            imageName: containerNameToSpec[containerStatus.name].image,
            imageId: containerNameToStatus[containerStatus.name].imageID,
            cluster: cluster_1.currentClusterName,
            revision: revision,
            podSpec: podSpec
        });
    }
    return images;
}
exports.buildImageMetadata = buildImageMetadata;
function findParentWorkload(podSpec, ownerRefs, namespace) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var ownerReferences, parentMetadata, i, supportedWorkload, workloadReader, workloadMetadata, err_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    ownerReferences = ownerRefs;
                    i = 0;
                    _c.label = 1;
                case 1:
                    if (!(i < loopingThreshold)) return [3 /*break*/, 6];
                    supportedWorkload = (0, workload_reader_1.getSupportedWorkload)(ownerReferences);
                    if (supportedWorkload === undefined) {
                        // Reached the top (or an unsupported workload): return the current parent metadata.
                        return [2 /*return*/, parentMetadata];
                    }
                    workloadReader = (0, workload_reader_1.getWorkloadReader)(supportedWorkload.kind);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, workloadReader(supportedWorkload.name, namespace)];
                case 3:
                    workloadMetadata = _c.sent();
                    if (workloadMetadata === undefined) {
                        // Could not extract data for the next parent, so return whatever we have so far.
                        return [2 /*return*/, parentMetadata];
                    }
                    parentMetadata = __assign(__assign({}, workloadMetadata), { podSpec: podSpec });
                    ownerReferences = parentMetadata.ownerRefs;
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _c.sent();
                    if (((_b = (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.response) === null || _a === void 0 ? void 0 : _a.body) === null || _b === void 0 ? void 0 : _b.code) === 404) {
                        logger_1.logger.info({
                            supportedWorkloadName: supportedWorkload.name,
                            supportedWorkloadKind: supportedWorkload.kind,
                            namespace: namespace
                        }, 'could not find workload, it probably no longer exists');
                        return [2 /*return*/, undefined];
                    }
                    throw err_1;
                case 5:
                    i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, undefined];
            }
        });
    });
}
function buildWorkloadMetadata(kubernetesMetadata) {
    if (!kubernetesMetadata.objectMeta ||
        kubernetesMetadata.objectMeta.namespace === undefined ||
        kubernetesMetadata.objectMeta.name === undefined) {
        throw new Error("can't build workload metadata for object");
    }
    return {
        type: kubernetesMetadata.kind,
        name: kubernetesMetadata.objectMeta.name,
        namespace: kubernetesMetadata.objectMeta.namespace
    };
}
exports.buildWorkloadMetadata = buildWorkloadMetadata;
function isPodAssociatedWithParent(pod) {
    return pod.metadata !== undefined &&
        pod.metadata.ownerReferences !== undefined
        ? pod.metadata.ownerReferences.some(function (owner) { return !!owner.kind; })
        : false;
}
exports.isPodAssociatedWithParent = isPodAssociatedWithParent;
function buildMetadataForWorkload(pod) {
    var _a, _b, _c, _d, _e, _f, _g;
    return __awaiter(this, void 0, void 0, function () {
        var isAssociatedWithParent, logContext, hasJobOwnerRef, podOwner, hasNodeOwnerRef;
        return __generator(this, function (_h) {
            switch (_h.label) {
                case 0:
                    isAssociatedWithParent = isPodAssociatedWithParent(pod);
                    if (!pod.metadata || pod.metadata.namespace === undefined || !pod.spec) {
                        logContext = {
                            workloadName: (_a = pod.metadata) === null || _a === void 0 ? void 0 : _a.name,
                            workloadType: pod.kind,
                            workloadNamespace: (_b = pod.metadata) === null || _b === void 0 ? void 0 : _b.namespace,
                            clusterName: (_c = pod.metadata) === null || _c === void 0 ? void 0 : _c.clusterName
                        };
                        logger_1.logger.debug(logContext, 'cannot build metadata for workload without pod information');
                        // Some required parameters are missing, we cannot process further
                        return [2 /*return*/, undefined];
                    }
                    if (!(pod.status && pod.status.containerStatuses)) {
                        logger_1.logger.warn({ podMetadata: pod.metadata }, 'pod lacks status or status.containerStatus');
                        return [2 /*return*/, undefined];
                    }
                    // Pods that are not associated with any workloads
                    // do not need to be read with the API (we already have their meta+spec)
                    // so just return the information directly.
                    if (!isAssociatedWithParent) {
                        return [2 /*return*/, buildImageMetadata({
                                kind: 'Pod',
                                objectMeta: pod.metadata,
                                // Notice the pod.metadata repeats; this is because pods
                                // do not have the "template" property.
                                specMeta: pod.metadata,
                                ownerRefs: [],
                                podSpec: pod.spec
                            }, pod.status.containerStatuses)];
                    }
                    hasJobOwnerRef = (_e = (_d = pod.metadata) === null || _d === void 0 ? void 0 : _d.ownerReferences) === null || _e === void 0 ? void 0 : _e.find(function (owner) { return owner.kind === types_1.WorkloadKind.Job; });
                    if (hasJobOwnerRef && config_1.config.SKIP_K8S_JOBS) {
                        logger_1.logger.info({ podMetadata: pod.metadata }, 'pod associated with job but jobs are skipped from processing. not building metadata.');
                        return [2 /*return*/, undefined];
                    }
                    return [4 /*yield*/, findParentWorkload(pod.spec, pod.metadata.ownerReferences, pod.metadata.namespace)];
                case 1:
                    podOwner = _h.sent();
                    hasNodeOwnerRef = (_g = (_f = pod.metadata) === null || _f === void 0 ? void 0 : _f.ownerReferences) === null || _g === void 0 ? void 0 : _g.find(function (owner) { return owner.kind === 'Node'; });
                    if (hasNodeOwnerRef && podOwner === undefined) {
                        logger_1.logger.info({ podMetadata: pod.metadata }, 'pod associated with owner, but owner not found. returning pod metadata.');
                        return [2 /*return*/, buildImageMetadata({
                                kind: 'Pod',
                                objectMeta: pod.metadata,
                                // Notice the pod.metadata repeats; this is because pods
                                // do not have the "template" property.
                                specMeta: pod.metadata,
                                ownerRefs: [],
                                podSpec: pod.spec
                            }, pod.status.containerStatuses)];
                    }
                    if (podOwner === undefined) {
                        logger_1.logger.info({ podMetadata: pod.metadata }, 'pod associated with owner, but owner not found. not building metadata.');
                        return [2 /*return*/, undefined];
                    }
                    return [2 /*return*/, buildImageMetadata(podOwner, pod.status.containerStatuses)];
            }
        });
    });
}
exports.buildMetadataForWorkload = buildMetadataForWorkload;
