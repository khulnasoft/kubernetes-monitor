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
exports.__esModule = true;
exports.constructRuntimeData = exports.constructWorkloadEventsPolicy = exports.constructDeleteWorkload = exports.constructWorkloadMetadata = exports.constructScanResults = exports.constructDepGraph = void 0;
var config_1 = require("../common/config");
var cluster_1 = require("../supervisor/cluster");
var state_1 = require("../state");
var internal_namespaces_1 = require("../supervisor/watchers/internal-namespaces");
var logger_1 = require("../common/logger");
function constructDepGraph(scannedImages, workloadMetadata) {
    var results = scannedImages.map(function (scannedImage) {
        // We know that .find() won't return undefined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        var kubeWorkload = workloadMetadata.find(function (meta) { return meta.imageName === scannedImage.imageWithTag; });
        var cluster = kubeWorkload.cluster, namespace = kubeWorkload.namespace, type = kubeWorkload.type, name = kubeWorkload.name;
        var imageLocator = {
            userLocator: config_1.config.INTEGRATION_ID,
            imageId: scannedImage.image,
            imageWithDigest: scannedImage.imageWithDigest,
            cluster: cluster,
            namespace: namespace,
            type: type,
            name: name
        };
        return {
            imageLocator: imageLocator,
            agentId: config_1.config.AGENT_ID,
            dependencyGraph: JSON.stringify(scannedImage.pluginResult)
        };
    });
    return results;
}
exports.constructDepGraph = constructDepGraph;
function constructScanResults(scannedImages, workloadMetadata, telemetry) {
    return scannedImages.map(function (scannedImage) {
        // We know that .find() won't return undefined
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        var kubeWorkload = workloadMetadata.find(function (meta) { return meta.imageName === scannedImage.imageWithTag; });
        var cluster = kubeWorkload.cluster, namespace = kubeWorkload.namespace, type = kubeWorkload.type, name = kubeWorkload.name;
        var imageLocator = {
            userLocator: config_1.config.INTEGRATION_ID,
            imageId: scannedImage.image,
            imageWithDigest: scannedImage.imageWithDigest,
            cluster: cluster,
            namespace: namespace,
            type: type,
            name: name
        };
        return {
            telemetry: telemetry,
            imageLocator: imageLocator,
            agentId: config_1.config.AGENT_ID,
            scanResults: scannedImage.scanResults
        };
    });
}
exports.constructScanResults = constructScanResults;
function constructWorkloadMetadata(workload) {
    var _a, _b;
    if (!workload) {
        throw new Error("can't build workload metadata payload for undefined workload");
    }
    var workloadLocator = {
        userLocator: config_1.config.INTEGRATION_ID,
        cluster: workload.cluster,
        namespace: workload.namespace,
        type: workload.type,
        name: workload.name
    };
    var workloadMetadata = {
        labels: workload.labels,
        specLabels: workload.specLabels,
        annotations: workload.annotations,
        specAnnotations: workload.specAnnotations,
        namespaceAnnotations: (_b = (_a = state_1.state.watchedNamespaces[workload.namespace]) === null || _a === void 0 ? void 0 : _a.metadata) === null || _b === void 0 ? void 0 : _b.annotations,
        revision: workload.revision,
        podSpec: workload.podSpec
    };
    return { workloadLocator: workloadLocator, agentId: config_1.config.AGENT_ID, workloadMetadata: workloadMetadata };
}
exports.constructWorkloadMetadata = constructWorkloadMetadata;
function constructDeleteWorkload(localWorkloadLocator) {
    return {
        workloadLocator: __assign(__assign({}, localWorkloadLocator), { userLocator: config_1.config.INTEGRATION_ID, cluster: cluster_1.currentClusterName }),
        agentId: config_1.config.AGENT_ID
    };
}
exports.constructDeleteWorkload = constructDeleteWorkload;
function constructWorkloadEventsPolicy(policy) {
    return {
        policy: policy,
        userLocator: config_1.config.INTEGRATION_ID,
        cluster: cluster_1.currentClusterName,
        agentId: config_1.config.AGENT_ID
    };
}
exports.constructWorkloadEventsPolicy = constructWorkloadEventsPolicy;
var workloadKindMap = {
    deployment: 'Deployment',
    replicaset: 'ReplicaSet',
    statefulset: 'StatefulSet',
    daemonset: 'DaemonSet',
    job: 'Job',
    cronjob: 'CronJob',
    replicationcontroller: 'ReplicationController',
    deploymentconfig: 'DeploymentConfig',
    pod: 'Pod',
    rollout: 'Rollout'
};
function constructRuntimeData(runtimeResults) {
    var filteredRuntimeResults = runtimeResults.reduce(function (acc, runtimeResult) {
        if (!(0, internal_namespaces_1.isExcludedNamespace)(runtimeResult.namespace)) {
            var mappedWorkloadKind = workloadKindMap[runtimeResult.workloadKind.toLowerCase()];
            if (mappedWorkloadKind) {
                runtimeResult.workloadKind = mappedWorkloadKind;
                acc.push(runtimeResult);
            }
            else {
                logger_1.logger.error({
                    imageID: runtimeResult.imageID,
                    namespace: runtimeResult.namespace,
                    workloadName: runtimeResult.workloadName,
                    workloadKind: runtimeResult.workloadKind
                }, 'invalid Sysdig workload kind');
            }
        }
        return acc;
    }, []);
    var dataFact = {
        type: 'loadedPackages',
        data: filteredRuntimeResults
    };
    return {
        identity: {
            type: 'sysdig'
        },
        target: {
            agentId: config_1.config.AGENT_ID,
            userLocator: config_1.config.INTEGRATION_ID,
            cluster: cluster_1.currentClusterName
        },
        facts: [dataFact]
    };
}
exports.constructRuntimeData = constructRuntimeData;
