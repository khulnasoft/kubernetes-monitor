"use strict";
exports.__esModule = true;
exports.trimMetadata = exports.trimWorkload = exports.trimWorkloads = void 0;
var logger_1 = require("../common/logger");
function trimWorkloads(items) {
    return items.map(trimWorkload);
}
exports.trimWorkloads = trimWorkloads;
/**
 * Pick only the minimum relevant data from the workload. Sometimes the workload
 * spec may be bloated with server-side information that is not necessary for vulnerability analysis.
 * This ensures that any data we hold in memory is minimal, which in turn allows us to hold more workloads to scan.
 */
function trimWorkload(workload) {
    logger_1.logger.debug({ workloadMetadata: workload.metadata }, 'workload metadata state before trimming');
    return {
        apiVersion: workload.apiVersion,
        kind: workload.kind,
        metadata: trimMetadata(workload.metadata),
        spec: workload.spec,
        status: workload.status
    };
}
exports.trimWorkload = trimWorkload;
function trimMetadata(metadata) {
    var trimmedMetadata = {
        name: metadata === null || metadata === void 0 ? void 0 : metadata.name,
        namespace: metadata === null || metadata === void 0 ? void 0 : metadata.namespace,
        annotations: metadata === null || metadata === void 0 ? void 0 : metadata.annotations,
        labels: metadata === null || metadata === void 0 ? void 0 : metadata.labels,
        ownerReferences: metadata === null || metadata === void 0 ? void 0 : metadata.ownerReferences,
        uid: metadata === null || metadata === void 0 ? void 0 : metadata.uid,
        resourceVersion: metadata === null || metadata === void 0 ? void 0 : metadata.resourceVersion,
        generation: metadata === null || metadata === void 0 ? void 0 : metadata.generation
    };
    logger_1.logger.debug(trimmedMetadata, 'workload metadata state after trimming');
    return trimmedMetadata;
}
exports.trimMetadata = trimMetadata;
