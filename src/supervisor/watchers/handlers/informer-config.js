"use strict";
var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
exports.__esModule = true;
exports.workloadWatchMetadata = void 0;
var client_node_1 = require("@kubernetes/client-node");
var types_1 = require("../../types");
var pod = require("./pod");
var cronJob = require("./cron-job");
var daemonSet = require("./daemon-set");
var deployment = require("./deployment");
var job = require("./job");
var replicaSet = require("./replica-set");
var replicationController = require("./replication-controller");
var statefulSet = require("./stateful-set");
var deploymentConfig = require("./deployment-config");
var rollout = require("./argo-rollout");
/**
 * This map is used in combination with the kubernetes-client Informer API
 * to abstract which resources to watch, what their endpoint is, how to grab
 * a list of the resources, and which watch actions to handle (e.g. a newly added resource).
 *
 * The Informer API is just a wrapper around Kubernetes watches that makes sure the watch
 * gets restarted if it dies and it also efficiently tracks changes to the watched workloads
 * by comparing their resourceVersion.
 *
 * The map is keyed by the "WorkloadKind" -- the type of resource we want to watch.
 * Legal verbs for the "handlers" are pulled from '@kubernetes/client-node'. You can
 * set a different handler for every verb.
 * (e.g. ADD-ed workloads are processed differently than DELETE-d ones)
 *
 * The "listFunc" is a callback used by the kubernetes-client to grab the watched resource
 * whenever Kubernetes fires a "workload changed" event and it uses the result to figure out
 * if the workload actually changed (by inspecting the resourceVersion).
 */
exports.workloadWatchMetadata = (_a = {},
    _a[types_1.WorkloadKind.Pod] = {
        clusterEndpoint: '/api/v1/pods',
        namespacedEndpoint: '/api/v1/namespaces/{namespace}/pods',
        handlers: (_b = {},
            _b[client_node_1.ADD] = pod.podWatchHandler,
            _b[client_node_1.DELETE] = pod.podDeletedHandler,
            _b[client_node_1.UPDATE] = pod.podWatchHandler,
            _b),
        clusterListFactory: function () { return function () { return pod.paginatedClusterPodList(); }; },
        namespacedListFactory: function (namespace) { return function () {
            return pod.paginatedNamespacedPodList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.ReplicationController] = {
        clusterEndpoint: '/api/v1/replicationcontrollers',
        namespacedEndpoint: '/api/v1/namespaces/{namespace}/replicationcontrollers',
        handlers: (_c = {},
            _c[client_node_1.DELETE] = replicationController.replicationControllerWatchHandler,
            _c),
        clusterListFactory: function () { return function () {
            return replicationController.paginatedClusterReplicationControllerList();
        }; },
        namespacedListFactory: function (namespace) { return function () {
            return replicationController.paginatedNamespacedReplicationControllerList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.CronJob] = {
        clusterEndpoint: '/apis/batch/v1/cronjobs',
        namespacedEndpoint: '/apis/batch/v1/namespaces/{namespace}/cronjobs',
        handlers: (_d = {},
            _d[client_node_1.DELETE] = cronJob.cronJobWatchHandler,
            _d),
        clusterListFactory: function () { return function () { return cronJob.paginatedClusterCronJobList(); }; },
        namespacedListFactory: function (namespace) { return function () {
            return cronJob.paginatedNamespacedCronJobList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.CronJobV1Beta1] = {
        clusterEndpoint: '/apis/batch/v1beta1/cronjobs',
        namespacedEndpoint: '/apis/batch/v1beta1/namespaces/{namespace}/cronjobs',
        handlers: (_e = {},
            _e[client_node_1.DELETE] = cronJob.cronJobWatchHandler,
            _e),
        clusterListFactory: function () { return function () {
            return cronJob.paginatedClusterCronJobV1Beta1List();
        }; },
        namespacedListFactory: function (namespace) { return function () {
            return cronJob.paginatedNamespacedCronJobV1Beta1List(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.Job] = {
        clusterEndpoint: '/apis/batch/v1/jobs',
        namespacedEndpoint: '/apis/batch/v1/namespaces/{namespace}/jobs',
        handlers: (_f = {},
            _f[client_node_1.DELETE] = job.jobWatchHandler,
            _f),
        clusterListFactory: function () { return function () { return job.paginatedClusterJobList(); }; },
        namespacedListFactory: function (namespace) { return function () {
            return job.paginatedNamespacedJobList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.DaemonSet] = {
        clusterEndpoint: '/apis/apps/v1/daemonsets',
        namespacedEndpoint: '/apis/apps/v1/namespaces/{namespace}/daemonsets',
        handlers: (_g = {},
            _g[client_node_1.DELETE] = daemonSet.daemonSetWatchHandler,
            _g),
        clusterListFactory: function () { return function () { return daemonSet.paginatedClusterDaemonSetList(); }; },
        namespacedListFactory: function (namespace) { return function () {
            return daemonSet.paginatedNamespacedDaemonSetList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.Deployment] = {
        clusterEndpoint: '/apis/apps/v1/deployments',
        namespacedEndpoint: '/apis/apps/v1/namespaces/{namespace}/deployments',
        handlers: (_h = {},
            _h[client_node_1.DELETE] = deployment.deploymentWatchHandler,
            _h),
        clusterListFactory: function () { return function () { return deployment.paginatedClusterDeploymentList(); }; },
        namespacedListFactory: function (namespace) { return function () {
            return deployment.paginatedNamespacedDeploymentList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.ReplicaSet] = {
        clusterEndpoint: '/apis/apps/v1/replicasets',
        namespacedEndpoint: '/apis/apps/v1/namespaces/{namespace}/replicasets',
        handlers: (_j = {},
            _j[client_node_1.DELETE] = replicaSet.replicaSetWatchHandler,
            _j),
        clusterListFactory: function () { return function () { return replicaSet.paginatedClusterReplicaSetList(); }; },
        namespacedListFactory: function (namespace) { return function () {
            return replicaSet.paginatedNamespacedReplicaSetList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.StatefulSet] = {
        clusterEndpoint: '/apis/apps/v1/statefulsets',
        namespacedEndpoint: '/apis/apps/v1/namespaces/{namespace}/statefulsets',
        handlers: (_k = {},
            _k[client_node_1.DELETE] = statefulSet.statefulSetWatchHandler,
            _k),
        clusterListFactory: function () { return function () {
            return statefulSet.paginatedClusterStatefulSetList();
        }; },
        namespacedListFactory: function (namespace) { return function () {
            return statefulSet.paginatedNamespacedStatefulSetList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.DeploymentConfig] = {
        clusterEndpoint: '/apis/apps.openshift.io/v1/deploymentconfigs',
        /** https://docs.openshift.com/container-platform/4.7/rest_api/workloads_apis/deploymentconfig-apps-openshift-io-v1.html */
        namespacedEndpoint: '/apis/apps.openshift.io/v1/namespaces/{namespace}/deploymentconfigs',
        handlers: (_l = {},
            _l[client_node_1.DELETE] = deploymentConfig.deploymentConfigWatchHandler,
            _l),
        clusterListFactory: function () { return function () {
            return deploymentConfig.paginatedClusterDeploymentConfigList();
        }; },
        namespacedListFactory: function (namespace) { return function () {
            return deploymentConfig.paginatedNamespacedDeploymentConfigList(namespace);
        }; }
    },
    _a[types_1.WorkloadKind.ArgoRollout] = {
        clusterEndpoint: '/apis/argoproj.io/v1alpha1/rollouts',
        namespacedEndpoint: '/apis/argoproj.io/v1alpha1/namespaces/{namespace}/rollouts',
        handlers: (_m = {},
            _m[client_node_1.DELETE] = rollout.argoRolloutWatchHandler,
            _m),
        clusterListFactory: function () { return function () { return rollout.paginatedClusterArgoRolloutList(); }; },
        namespacedListFactory: function (namespace) { return function () {
            return rollout.paginatedNamespacedArgoRolloutList(namespace);
        }; }
    },
    _a);
