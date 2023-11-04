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
var _a;
exports.__esModule = true;
exports.getSupportedWorkload = exports.getWorkloadReader = exports.SupportedWorkloadTypes = void 0;
var kubernetesApiWrappers = require("./kuberenetes-api-wrappers");
var cluster_1 = require("./cluster");
var types_1 = require("./types");
var logger_1 = require("../common/logger");
var workload_sanitization_1 = require("./workload-sanitization");
var state_1 = require("../state");
var deploymentReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, deploymentResult, deployment, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                        return cluster_1.k8sApi.appsClient.readNamespacedDeployment(workloadName, namespace);
                    })];
            case 1:
                deploymentResult = _a.sent();
                deployment = (0, workload_sanitization_1.trimWorkload)(deploymentResult.body);
                if (!deployment.metadata ||
                    !deployment.spec ||
                    !deployment.spec.template.metadata ||
                    !deployment.spec.template.spec ||
                    !deployment.status) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.Deployment,
                    objectMeta: deployment.metadata,
                    specMeta: deployment.spec.template.metadata,
                    ownerRefs: deployment.metadata.ownerReferences,
                    revision: deployment.status.observedGeneration
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
/** https://docs.openshift.com/container-platform/4.7/rest_api/workloads_apis/deploymentconfig-apps-openshift-io-v1.html */
var deploymentConfigReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, deploymentResult, deployment, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                        return cluster_1.k8sApi.customObjectsClient.getNamespacedCustomObject('apps.openshift.io', 'v1', namespace, 'deploymentconfigs', workloadName);
                    })];
            case 1:
                deploymentResult = _a.sent();
                deployment = (0, workload_sanitization_1.trimWorkload)(deploymentResult.body);
                if (!deployment.metadata ||
                    !deployment.spec ||
                    !deployment.spec.template.metadata ||
                    !deployment.spec.template.spec ||
                    !deployment.status) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.DeploymentConfig,
                    objectMeta: deployment.metadata,
                    specMeta: deployment.spec.template.metadata,
                    ownerRefs: deployment.metadata.ownerReferences,
                    revision: deployment.status.observedGeneration
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
var replicaSetReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, replicaSetResult, replicaSet, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                        return cluster_1.k8sApi.appsClient.readNamespacedReplicaSet(workloadName, namespace);
                    })];
            case 1:
                replicaSetResult = _a.sent();
                replicaSet = (0, workload_sanitization_1.trimWorkload)(replicaSetResult.body);
                if (!replicaSet.metadata ||
                    !replicaSet.spec ||
                    !replicaSet.spec.template ||
                    !replicaSet.spec.template.metadata ||
                    !replicaSet.spec.template.spec ||
                    !replicaSet.status) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.ReplicaSet,
                    objectMeta: replicaSet.metadata,
                    specMeta: replicaSet.spec.template.metadata,
                    ownerRefs: replicaSet.metadata.ownerReferences,
                    revision: replicaSet.status.observedGeneration
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
var statefulSetReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, statefulSetResult, statefulSet, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                        return cluster_1.k8sApi.appsClient.readNamespacedStatefulSet(workloadName, namespace);
                    })];
            case 1:
                statefulSetResult = _a.sent();
                statefulSet = (0, workload_sanitization_1.trimWorkload)(statefulSetResult.body);
                if (!statefulSet.metadata ||
                    !statefulSet.spec ||
                    !statefulSet.spec.template.metadata ||
                    !statefulSet.spec.template.spec ||
                    !statefulSet.status) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.StatefulSet,
                    objectMeta: statefulSet.metadata,
                    specMeta: statefulSet.spec.template.metadata,
                    ownerRefs: statefulSet.metadata.ownerReferences,
                    revision: statefulSet.status.observedGeneration
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
var daemonSetReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, daemonSetResult, daemonSet, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () { return cluster_1.k8sApi.appsClient.readNamespacedDaemonSet(workloadName, namespace); })];
            case 1:
                daemonSetResult = _a.sent();
                daemonSet = (0, workload_sanitization_1.trimWorkload)(daemonSetResult.body);
                if (!daemonSet.metadata ||
                    !daemonSet.spec ||
                    !daemonSet.spec.template.spec ||
                    !daemonSet.spec.template.metadata ||
                    !daemonSet.status) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.DaemonSet,
                    objectMeta: daemonSet.metadata,
                    specMeta: daemonSet.spec.template.metadata,
                    ownerRefs: daemonSet.metadata.ownerReferences,
                    revision: daemonSet.status.observedGeneration
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
var jobReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, jobResult, job, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                        return cluster_1.k8sApi.batchClient.readNamespacedJob(workloadName, namespace);
                    })];
            case 1:
                jobResult = _a.sent();
                job = (0, workload_sanitization_1.trimWorkload)(jobResult.body);
                if (!job.metadata ||
                    !job.spec ||
                    !job.spec.template.spec ||
                    !job.spec.template.metadata) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.Job,
                    objectMeta: job.metadata,
                    specMeta: job.spec.template.metadata,
                    ownerRefs: job.metadata.ownerReferences
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
// cronJobReader can read v1 and v1beta1 CronJobs
var cronJobReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, cronJobResult, cronJob, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers
                        .retryKubernetesApiRequest(function () {
                        return cluster_1.k8sApi.batchClient.readNamespacedCronJob(workloadName, namespace);
                    })["catch"](function () {
                        return kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                            return cluster_1.k8sApi.batchUnstableClient.readNamespacedCronJob(workloadName, namespace);
                        });
                    })];
            case 1:
                cronJobResult = _a.sent();
                cronJob = (0, workload_sanitization_1.trimWorkload)(cronJobResult.body);
                if (!cronJob.metadata ||
                    !cronJob.spec ||
                    !cronJob.spec.jobTemplate.metadata ||
                    !cronJob.spec.jobTemplate.spec ||
                    !cronJob.spec.jobTemplate.spec.template.spec) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.CronJob,
                    objectMeta: cronJob.metadata,
                    specMeta: cronJob.spec.jobTemplate.metadata,
                    ownerRefs: cronJob.metadata.ownerReferences
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
var replicationControllerReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, replicationControllerResult, replicationController, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                        return cluster_1.k8sApi.coreClient.readNamespacedReplicationController(workloadName, namespace);
                    })];
            case 1:
                replicationControllerResult = _a.sent();
                replicationController = (0, workload_sanitization_1.trimWorkload)(replicationControllerResult.body);
                if (!replicationController.metadata ||
                    !replicationController.spec ||
                    !replicationController.spec.template ||
                    !replicationController.spec.template.metadata ||
                    !replicationController.spec.template.spec ||
                    !replicationController.status) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.ReplicationController,
                    objectMeta: replicationController.metadata,
                    specMeta: replicationController.spec.template.metadata,
                    ownerRefs: replicationController.metadata.ownerReferences,
                    revision: replicationController.status.observedGeneration
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
var argoRolloutReader = function (workloadName, namespace) { return __awaiter(void 0, void 0, void 0, function () {
    var cachedMetadata, rolloutResult, rollout, metadata;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                cachedMetadata = (0, state_1.getCachedWorkloadMetadata)(workloadName, namespace);
                if (cachedMetadata !== undefined) {
                    return [2 /*return*/, cachedMetadata];
                }
                return [4 /*yield*/, kubernetesApiWrappers.retryKubernetesApiRequest(function () {
                        return cluster_1.k8sApi.customObjectsClient.getNamespacedCustomObject('argoproj.io', 'v1alpha1', namespace, 'rollouts', workloadName);
                    })];
            case 1:
                rolloutResult = _a.sent();
                rollout = (0, workload_sanitization_1.trimWorkload)(rolloutResult.body);
                if (!rollout.metadata ||
                    !rollout.spec ||
                    !rollout.spec.template.metadata ||
                    !rollout.spec.template.spec ||
                    !rollout.status) {
                    logIncompleteWorkload(workloadName, namespace);
                    return [2 /*return*/, undefined];
                }
                metadata = {
                    kind: types_1.WorkloadKind.ArgoRollout,
                    objectMeta: rollout.metadata,
                    specMeta: rollout.spec.template.metadata,
                    ownerRefs: rollout.metadata.ownerReferences,
                    revision: rollout.status.observedGeneration
                };
                (0, state_1.setCachedWorkloadMetadata)(workloadName, namespace, metadata);
                return [2 /*return*/, metadata];
        }
    });
}); };
function logIncompleteWorkload(workloadName, namespace) {
    logger_1.logger.info({ workloadName: workloadName, namespace: namespace }, 'kubernetes api could not return workload');
}
// Here we are using the "kind" property of a k8s object as a key to map it to a reader.
// This gives us a quick look up table where we can abstract away the internal implementation of reading a resource
// and just grab a generic handler/reader that does that for us (based on the "kind").
var workloadReader = (_a = {},
    _a[types_1.WorkloadKind.Deployment] = deploymentReader,
    _a[types_1.WorkloadKind.ArgoRollout] = argoRolloutReader,
    _a[types_1.WorkloadKind.ReplicaSet] = replicaSetReader,
    _a[types_1.WorkloadKind.StatefulSet] = statefulSetReader,
    _a[types_1.WorkloadKind.DaemonSet] = daemonSetReader,
    _a[types_1.WorkloadKind.Job] = jobReader,
    _a[types_1.WorkloadKind.CronJob] = cronJobReader,
    // ------------
    // Note: WorkloadKind.CronJobV1Beta1 is intentionally not listed here.
    // The WorkloadKind.CronJob reader can handle both v1 and v1beta1 API versions.
    // ------------
    _a[types_1.WorkloadKind.ReplicationController] = replicationControllerReader,
    _a[types_1.WorkloadKind.DeploymentConfig] = deploymentConfigReader,
    _a);
exports.SupportedWorkloadTypes = Object.keys(workloadReader);
function getWorkloadReader(workloadType) {
    return workloadReader[workloadType];
}
exports.getWorkloadReader = getWorkloadReader;
function getSupportedWorkload(ownerRefs) {
    return ownerRefs !== undefined
        ? ownerRefs.find(function (owner) { return exports.SupportedWorkloadTypes.includes(owner.kind); })
        : undefined;
}
exports.getSupportedWorkload = getSupportedWorkload;
