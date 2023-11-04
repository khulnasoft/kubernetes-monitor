"use strict";
exports.__esModule = true;
exports.K8sClients = exports.WorkloadKind = void 0;
var client_node_1 = require("@kubernetes/client-node");
var WorkloadKind;
(function (WorkloadKind) {
    WorkloadKind["Deployment"] = "Deployment";
    WorkloadKind["ReplicaSet"] = "ReplicaSet";
    WorkloadKind["StatefulSet"] = "StatefulSet";
    WorkloadKind["DaemonSet"] = "DaemonSet";
    WorkloadKind["Job"] = "Job";
    /** Available since Kubernetes 1.20. */
    WorkloadKind["CronJob"] = "CronJob";
    /** @deprecated Will be removed in Kubernetes 1.25. */
    WorkloadKind["CronJobV1Beta1"] = "CronJobV1Beta1";
    WorkloadKind["ReplicationController"] = "ReplicationController";
    WorkloadKind["Pod"] = "Pod";
    WorkloadKind["DeploymentConfig"] = "DeploymentConfig";
    WorkloadKind["ArgoRollout"] = "Rollout";
})(WorkloadKind = exports.WorkloadKind || (exports.WorkloadKind = {}));
var K8sClients = /** @class */ (function () {
    function K8sClients(config) {
        this.appsClient = config.makeApiClient(client_node_1.AppsV1Api);
        this.coreClient = config.makeApiClient(client_node_1.CoreV1Api);
        this.batchClient = config.makeApiClient(client_node_1.BatchV1Api);
        this.batchUnstableClient = config.makeApiClient(client_node_1.BatchV1beta1Api);
        this.customObjectsClient = config.makeApiClient(client_node_1.CustomObjectsApi);
    }
    return K8sClients;
}());
exports.K8sClients = K8sClients;
