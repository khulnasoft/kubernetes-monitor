"use strict";
exports.__esModule = true;
exports.k8sApi = exports.currentClusterName = exports.kubeConfig = void 0;
var client_node_1 = require("@kubernetes/client-node");
var config_1 = require("../common/config");
var types_1 = require("./types");
function getKubeConfig() {
    var kc = new client_node_1.KubeConfig();
    kc.loadFromDefault();
    return kc;
}
// Gets the cluster name, passed as a config variable inside the app.
function getCurrentCluster() {
    return config_1.config.CLUSTER_NAME;
}
function getK8sApi(k8sConfig) {
    return new types_1.K8sClients(k8sConfig);
}
exports.kubeConfig = getKubeConfig();
exports.currentClusterName = getCurrentCluster();
exports.k8sApi = getK8sApi(exports.kubeConfig);
