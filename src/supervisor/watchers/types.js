"use strict";
exports.__esModule = true;
exports.RETRYABLE_NETWORK_ERROR_MESSAGES = exports.RETRYABLE_NETWORK_ERROR_CODES = exports.PodPhase = void 0;
var PodPhase;
(function (PodPhase) {
    // The pod has been accepted by the Kubernetes system, but one or more of the container images has not been created.
    PodPhase["Pending"] = "Pending";
    // The pod has been bound to a node, and all of the containers have been created.
    PodPhase["Running"] = "Running";
    // All containers in the pod have terminated in success, and will not be restarted.
    PodPhase["Succeeded"] = "Succeeded";
    // All containers in the pod have terminated, and at least one container has terminated in failure.
    PodPhase["Failed"] = "Failed";
    // For some reason the state of the pod could not be obtained.
    PodPhase["Unknown"] = "Unknown";
})(PodPhase = exports.PodPhase || (exports.PodPhase = {}));
exports.RETRYABLE_NETWORK_ERROR_CODES = [
    'ECONNREFUSED',
    'ETIMEDOUT',
    'ECONNRESET',
];
exports.RETRYABLE_NETWORK_ERROR_MESSAGES = [
    'Too Many Requests',
];
