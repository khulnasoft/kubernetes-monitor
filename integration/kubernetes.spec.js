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
exports.__esModule = true;
var client_node_1 = require("@kubernetes/client-node");
var setup = require("../setup");
var types_1 = require("../../src/supervisor/types");
var kubernetes_upstream_1 = require("../helpers/kubernetes-upstream");
var kubectl = require("../helpers/kubectl");
var exec_1 = require("../helpers/exec");
var integrationId;
var namespace;
var clusterName;
function teardown() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Begin removing the khulnasoft-monitor...');
                    return [4 /*yield*/, setup.removeMonitor()];
                case 1:
                    _a.sent();
                    console.log('Removed the khulnasoft-monitor!');
                    console.log('Begin removing "kind" network...');
                    return [4 /*yield*/, setup.removeUnusedKindNetwork()];
                case 2:
                    _a.sent();
                    console.log('Removed "kind" network');
                    return [2 /*return*/];
            }
        });
    });
}
afterAll(teardown);
test('clean up environment on start', teardown);
// Make sure this runs first -- deploying the monitor for the next tests
test('deploy khulnasoft-monitor', function () { return __awaiter(void 0, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                namespace = setup.khulnasoftMonitorNamespace();
                return [4 /*yield*/, setup.deployMonitor()];
            case 1:
                (_a = _b.sent(), integrationId = _a.integrationId, clusterName = _a.clusterName);
                return [2 /*return*/];
        }
    });
}); });
var cronJobValidator = function (workloads) {
    return workloads.find(function (workload) {
        return workload.name === 'cron-job' && workload.type === types_1.WorkloadKind.CronJob;
    }) !== undefined;
};
var cronJobV1Beta1Validator = function (workloads) {
    return workloads.find(function (workload) {
        return workload.name === 'cron-job-v1beta1' &&
            workload.type === types_1.WorkloadKind.CronJob;
    }) !== undefined;
};
var argoRolloutValidator = function (workloads) {
    return workloads.find(function (workload) {
        return workload.name === 'argo-rollout' &&
            workload.type === types_1.WorkloadKind.ArgoRollout;
    }) !== undefined;
};
var supported = {
    cronJobV1: true,
    cronJobV1Beta1: true,
    argoRollout: true
};
// Next we apply some sample workloads
test('deploy sample workloads', function () { return __awaiter(void 0, void 0, void 0, function () {
    var argoNamespace, servicesNamespace, someImageWithSha;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                argoNamespace = 'argo-rollouts';
                servicesNamespace = 'services';
                someImageWithSha = 'docker.io/library/alpine@sha256:7746df395af22f04212cd25a92c1d6dbc5a06a0ca9579a229ef43008d4d1302a';
                return [4 /*yield*/, Promise.allSettled([
                        kubectl.applyK8sYaml('./test/fixtures/alpine-pod.yaml'),
                        kubectl.applyK8sYaml('./test/fixtures/oci-dummy-pod.yaml'),
                        kubectl.applyK8sYaml('./test/fixtures/nginx-replicationcontroller.yaml'),
                        kubectl.applyK8sYaml('./test/fixtures/redis-deployment.yaml'),
                        kubectl.applyK8sYaml('./test/fixtures/centos-deployment.yaml'),
                        kubectl.applyK8sYaml('./test/fixtures/scratch-deployment.yaml'),
                        kubectl.applyK8sYaml('./test/fixtures/consul-deployment.yaml'),
                        kubectl.applyK8sYaml('./test/fixtures/cronjob.yaml')["catch"](function (error) {
                            console.log('CronJob is possibly unsupported', error);
                            supported.cronJobV1 = false;
                        }),
                        kubectl
                            .applyK8sYaml('./test/fixtures/cronjob-v1beta1.yaml')["catch"](function (error) {
                            console.log('CronJobV1Beta1 is possibly unsupported', error);
                            supported.cronJobV1Beta1 = false;
                        }),
                        kubectl.createPodFromImage('alpine-from-sha', someImageWithSha, servicesNamespace),
                        kubectl
                            .createNamespace(argoNamespace)
                            .then(function () {
                            return kubectl.applyK8sYaml(
                            //TODO: We pin to a earlier version due to a bug in Argo Rollout, we will revert to latest once the bug fix is deployed
                            // to a new version of argo-rollouts https://github.com/argoproj/argo-rollouts/issues/2568
                            'https://github.com/argoproj/argo-rollouts/releases/download/v1.3.2/install.yaml', argoNamespace);
                        })
                            .then(function () { return kubectl.applyK8sYaml('./test/fixtures/argo-rollout.yaml'); })["catch"](function (error) {
                            console.log('ArgoRollout is possibly unsupported', error);
                            supported.argoRollout = false;
                        }),
                    ])];
            case 1:
                _a.sent();
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor container started', function () { return __awaiter(void 0, void 0, void 0, function () {
    var kubeConfig, k8sApi, response, monitorPod;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                console.log('Getting KinD config...');
                kubeConfig = new client_node_1.KubeConfig();
                kubeConfig.loadFromDefault();
                k8sApi = kubeConfig.makeApiClient(client_node_1.CoreV1Api);
                console.log('Loaded KinD config!');
                console.log('Querying the khulnasoft-monitor...');
                return [4 /*yield*/, k8sApi.listNamespacedPod(namespace)];
            case 1:
                response = _b.sent();
                expect(response.body.items.length).toBeGreaterThan(0);
                monitorPod = response.body.items.find(function (pod) {
                    return pod.metadata !== undefined &&
                        pod.metadata.name !== undefined &&
                        pod.metadata.name.includes('khulnasoft-monitor');
                });
                expect(monitorPod).toBeDefined();
                expect(monitorPod === null || monitorPod === void 0 ? void 0 : monitorPod.status).toBeDefined();
                expect((_a = monitorPod === null || monitorPod === void 0 ? void 0 : monitorPod.status) === null || _a === void 0 ? void 0 : _a.phase).not.toEqual('Failed');
                console.log('Done -- khulnasoft-monitor exists!');
                return [2 /*return*/];
        }
    });
}); });
test('create local container registry and push an image', function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (process.env['TEST_PLATFORM'] !== 'kind') {
                    console.log("Not testing local container registry because we're not running in KinD");
                    return [2 /*return*/];
                }
                console.log('Creating local container registry...');
                return [4 /*yield*/, (0, exec_1.execWrapper)('docker run -d --restart=always -p "5000:5000" --name "kind-registry" registry:2')];
            case 1:
                _a.sent();
                return [4 /*yield*/, (0, exec_1.execWrapper)('docker network connect "kind" "kind-registry"')];
            case 2:
                _a.sent();
                console.log('Pushing python:rc-buster image to the local registry');
                //Note: this job takes a while and waitForJob() should be called before trying to access local registry image,
                //to make sure it completed
                return [4 /*yield*/, kubectl.applyK8sYaml('./test/fixtures/insecure-registries/push-dockerhub-image-to-local-registry.yaml')];
            case 3:
                //Note: this job takes a while and waitForJob() should be called before trying to access local registry image,
                //to make sure it completed
                _a.sent();
                console.log('successfully started a job to push image to a local registry');
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor sends data to kubernetes-upstream', function () { return __awaiter(void 0, void 0, void 0, function () {
    var validatorFn, metaValidator, workloadTestResult, workloadMetadataResult, busyboxScanResultsPath, scanResultsScratchImage, busyboxPluginResult, osScanResult, scanResultsConsulDeployment, scanResultsCronJobBeta, scanResultsCronJob, scanResultsArgoRollout;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                console.log("Begin polling kubernetes-upstream for the expected workloads with integration ID ".concat(integrationId, "..."));
                validatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'alpine' && workload.type === types_1.WorkloadKind.Pod;
                        }) !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'oci-dummy' && workload.type === types_1.WorkloadKind.Pod;
                        }) !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'nginx' &&
                                workload.type === types_1.WorkloadKind.ReplicationController;
                        }) !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'redis' &&
                                workload.type === types_1.WorkloadKind.Deployment;
                        }) !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'alpine-from-sha' &&
                                workload.type === types_1.WorkloadKind.Pod;
                        }) !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'busybox' &&
                                workload.type === types_1.WorkloadKind.Deployment;
                        }) !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'centos' &&
                                workload.type === types_1.WorkloadKind.Deployment;
                        }) !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'consul' &&
                                workload.type === types_1.WorkloadKind.Deployment;
                        }) !== undefined &&
                        // It's either there or unsupported
                        (argoRolloutValidator(workloads) || !supported.argoRollout) &&
                        // only one of the cronjob versions needs to be valid
                        (cronJobValidator(workloads) || cronJobV1Beta1Validator(workloads)));
                };
                metaValidator = function (workloadInfo) {
                    return (workloadInfo !== undefined &&
                        'revision' in workloadInfo &&
                        'labels' in workloadInfo &&
                        'specLabels' in workloadInfo &&
                        'annotations' in workloadInfo &&
                        'specAnnotations' in workloadInfo &&
                        'podSpec' in workloadInfo);
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(validatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/services"))];
            case 1:
                workloadTestResult = _a.sent();
                expect(workloadTestResult).toBeTruthy();
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredMetadata)(metaValidator, "api/v1/workload/".concat(integrationId, "/").concat(clusterName, "/services/Deployment/redis"))];
            case 2:
                workloadMetadataResult = _a.sent();
                expect(workloadMetadataResult).toBeTruthy();
                busyboxScanResultsPath = "api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/services/Deployment/busybox");
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)(busyboxScanResultsPath)];
            case 3:
                scanResultsScratchImage = _a.sent();
                expect(scanResultsScratchImage).toEqual({
                    workloadScanResults: {
                        'docker.io/library/busybox': expect.any(Array)
                    }
                });
                busyboxPluginResult = scanResultsScratchImage.workloadScanResults['docker.io/library/busybox'];
                osScanResult = busyboxPluginResult[0];
                expect(osScanResult.facts).toEqual(expect.arrayContaining([
                    { type: 'depGraph', data: expect.any(Object) },
                    { type: 'imageId', data: expect.any(String) },
                    { type: 'imageLayers', data: expect.any(Array) },
                    { type: 'rootFs', data: expect.any(Array) },
                ]));
                expect(osScanResult.target.image).toEqual('docker-image|docker.io/library/busybox');
                expect(osScanResult.identity.type).toEqual('linux');
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/services/Deployment/consul"))];
            case 4:
                scanResultsConsulDeployment = _a.sent();
                expect(scanResultsConsulDeployment.workloadScanResults['docker.io/khulnasoft/runtime-fixtures']).toEqual([
                    {
                        identity: { type: 'apk', args: { platform: 'linux/amd64' } },
                        facts: expect.any(Array),
                        target: { image: 'docker-image|docker.io/khulnasoft/runtime-fixtures' }
                    },
                    {
                        identity: { type: 'gomodules', targetFile: '/bin/consul' },
                        facts: expect.arrayContaining([
                            { type: 'depGraph', data: expect.any(Object) },
                        ]),
                        target: { image: 'docker-image|docker.io/khulnasoft/runtime-fixtures' }
                    },
                ]);
                if (!supported.cronJobV1Beta1) return [3 /*break*/, 6];
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/services/CronJob/cron-job-v1beta1"))];
            case 5:
                scanResultsCronJobBeta = _a.sent();
                expect(scanResultsCronJobBeta.workloadScanResults['busybox']).toEqual([
                    {
                        identity: { type: 'linux', args: { platform: 'linux/amd64' } },
                        facts: expect.any(Array),
                        target: { image: 'docker-image|busybox' }
                    },
                ]);
                _a.label = 6;
            case 6:
                if (!supported.cronJobV1) return [3 /*break*/, 8];
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/services/CronJob/cron-job"))];
            case 7:
                scanResultsCronJob = _a.sent();
                expect(scanResultsCronJob.workloadScanResults['busybox']).toEqual([
                    {
                        identity: { type: 'linux', args: { platform: 'linux/amd64' } },
                        facts: expect.any(Array),
                        target: { image: 'docker-image|busybox' }
                    },
                ]);
                _a.label = 8;
            case 8:
                if (!supported.argoRollout) return [3 /*break*/, 10];
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/services/Rollout/argo-rollout"))];
            case 9:
                scanResultsArgoRollout = _a.sent();
                expect(scanResultsArgoRollout.workloadScanResults['argoproj/rollouts-demo']).toEqual([
                    {
                        identity: { type: 'linux', args: { platform: 'linux/amd64' } },
                        facts: expect.any(Array),
                        target: { image: 'docker-image|argoproj/rollouts-demo' }
                    },
                    expect.any(Object),
                ]);
                _a.label = 10;
            case 10: return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor sends binary hashes to kubernetes-upstream after adding another deployment', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deploymentName, namespace, deploymentType, workloadLocatorValidatorFn, scanResultsValidatorFn, testResult, isWorkloadStored, scanResultsResponse, nodePluginResult, nodeOsScanResult, nodeHashes, openjdkPluginResult, openjdkOsScanResult, openjdkHashes;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deploymentName = 'binaries-deployment';
                namespace = 'services';
                deploymentType = types_1.WorkloadKind.Deployment;
                return [4 /*yield*/, kubectl.applyK8sYaml('./test/fixtures/binaries-deployment.yaml')];
            case 1:
                _a.sent();
                console.log("Begin polling kubernetes-upstream for the expected workloads with integration ID ".concat(integrationId, "..."));
                workloadLocatorValidatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === deploymentName &&
                                workload.type === types_1.WorkloadKind.Deployment;
                        }) !== undefined);
                };
                scanResultsValidatorFn = function (workloadScanResults) {
                    return (workloadScanResults !== undefined &&
                        workloadScanResults['docker.io/library/node'] !== undefined &&
                        workloadScanResults['docker.io/library/openjdk'] !== undefined);
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(workloadLocatorValidatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace))];
            case 2:
                testResult = _a.sent();
                expect(testResult).toBeTruthy();
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredScanResults)(scanResultsValidatorFn, "api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace, "/").concat(deploymentType, "/").concat(deploymentName))];
            case 3:
                isWorkloadStored = _a.sent();
                expect(isWorkloadStored).toBeTruthy();
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace, "/").concat(deploymentType, "/").concat(deploymentName))];
            case 4:
                scanResultsResponse = _a.sent();
                expect(scanResultsResponse).toEqual({
                    workloadScanResults: {
                        'docker.io/library/node': expect.any(Array),
                        'docker.io/library/openjdk': expect.any(Array)
                    }
                });
                nodePluginResult = scanResultsResponse.workloadScanResults['docker.io/library/node'];
                nodeOsScanResult = nodePluginResult[0];
                nodeHashes = nodeOsScanResult.facts.find(function (fact) { return fact.type === 'keyBinariesHashes'; }).data;
                expect(nodeHashes).toHaveLength(1);
                expect(nodeHashes[0]).toEqual('6d5847d3cd69dfdaaf9dd2aa8a3d30b1a9b3bfa529a1f5c902a511e1aa0b8f55');
                openjdkPluginResult = scanResultsResponse.workloadScanResults['docker.io/library/openjdk'];
                openjdkOsScanResult = openjdkPluginResult[0];
                openjdkHashes = openjdkOsScanResult.facts.find(function (fact) { return fact.type === 'keyBinariesHashes'; }).data;
                expect(openjdkHashes).toEqual([
                    '99503bfc6faed2da4fd35f36a5698d62676f886fb056fb353064cc78b1186195',
                    '00a90dcce9ca53be1630a21538590cfe15676f57bfe8cf55de0099ee80bbeec4',
                ]);
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor pulls images from a private gcr.io registry and sends data to kubernetes-upstream', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deploymentName, namespace, deploymentType, imageName, validatorFn, testResult, scanResultsResponse, scanResults;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deploymentName = 'debian-gcr-io';
                namespace = 'services';
                deploymentType = types_1.WorkloadKind.Deployment;
                imageName = 'gcr.io/khulnasoft-k8s-fixtures/debian';
                return [4 /*yield*/, kubectl.applyK8sYaml('./test/fixtures/private-registries/debian-deployment-gcr-io.yaml')];
            case 1:
                _a.sent();
                console.log("Begin polling upstream for the expected private gcr.io image with integration ID ".concat(integrationId, "..."));
                validatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === deploymentName &&
                                workload.type === types_1.WorkloadKind.Deployment;
                        }) !== undefined);
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(validatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace))];
            case 2:
                testResult = _a.sent();
                expect(testResult).toBeTruthy();
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace, "/").concat(deploymentType, "/").concat(deploymentName))];
            case 3:
                scanResultsResponse = _a.sent();
                expect(scanResultsResponse).toBeTruthy();
                scanResults = scanResultsResponse.workloadScanResults[imageName];
                expect(scanResults[0].facts).toEqual(expect.arrayContaining([
                    { type: 'depGraph', data: expect.any(Object) },
                    { type: 'imageId', data: expect.any(String) },
                    { type: 'imageLayers', data: expect.any(Array) },
                    { type: 'rootFs', data: expect.any(Array) },
                ]));
                expect(scanResults[0].identity.type).toEqual('deb');
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor pulls images from a private ECR and sends data to kubernetes-upstream', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deploymentName, namespace, deploymentType, imageName, validatorFn, testResult, scanResultsResponse;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (process.env['TEST_PLATFORM'] !== 'eks') {
                    console.log("Not testing private ECR images because we're not running in EKS");
                    return [2 /*return*/];
                }
                deploymentName = 'debian-ecr';
                namespace = 'services';
                deploymentType = types_1.WorkloadKind.Deployment;
                imageName = '291964488713.dkr.ecr.us-east-2.amazonaws.com/khulnasoft/debian';
                return [4 /*yield*/, kubectl.applyK8sYaml('./test/fixtures/private-registries/debian-deployment-ecr.yaml')];
            case 1:
                _b.sent();
                console.log("Begin polling upstream for the expected private ECR image with integration ID ".concat(integrationId, "..."));
                validatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === deploymentName &&
                                workload.type === types_1.WorkloadKind.Deployment;
                        }) !== undefined);
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(validatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace))];
            case 2:
                testResult = _b.sent();
                expect(testResult).toBeTruthy();
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace, "/").concat(deploymentType, "/").concat(deploymentName))];
            case 3:
                scanResultsResponse = _b.sent();
                expect(scanResultsResponse).toEqual({
                    workloadScanResults: (_a = {},
                        _a[imageName] = expect.any(Array),
                        _a)
                });
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor scans DeploymentConfigs', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deploymentConfigName, namespace, deploymentType, imageName, validatorFn, testResult, scanResultsResponse;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (process.env['TEST_PLATFORM'] !== 'openshift4') {
                    console.log('Not testing DeploymentConfigs outside of OpenShift');
                    return [2 /*return*/];
                }
                deploymentConfigName = 'deployment-config';
                namespace = 'services';
                deploymentType = types_1.WorkloadKind.DeploymentConfig;
                imageName = 'docker.io/library/hello-world';
                return [4 /*yield*/, kubectl.applyK8sYaml('test/fixtures/hello-world-deploymentconfig.yaml')];
            case 1:
                _b.sent();
                console.log("Begin polling upstream for the expected DeploymentConfig with integration ID ".concat(integrationId, "..."));
                validatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === deploymentConfigName &&
                                workload.type === deploymentType;
                        }) !== undefined);
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(validatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace))];
            case 2:
                testResult = _b.sent();
                expect(testResult).toBeTruthy();
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace, "/").concat(deploymentType, "/").concat(deploymentConfigName))];
            case 3:
                scanResultsResponse = _b.sent();
                expect(scanResultsResponse).toEqual({
                    workloadScanResults: (_a = {},
                        _a[imageName] = expect.any(Array),
                        _a)
                });
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor pulls images from a local registry and sends data to kubernetes-upstream', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deploymentName, namespace, deploymentType, imageName, validatorFn, testResult, scanResultsResponse, scanResults;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (process.env['TEST_PLATFORM'] !== 'kind') {
                    console.log("Not testing local container registry because we're not running in KinD");
                    return [2 /*return*/];
                }
                deploymentName = 'python-local';
                namespace = 'services';
                deploymentType = types_1.WorkloadKind.Deployment;
                imageName = 'kind-registry:5000/python';
                return [4 /*yield*/, kubectl.waitForJob('push-to-local-registry', 'default')];
            case 1:
                _a.sent();
                console.log('Applying local registry workload...');
                return [4 /*yield*/, kubectl.applyK8sYaml('./test/fixtures/insecure-registries/python-local-deployment.yaml')];
            case 2:
                _a.sent();
                console.log("Begin polling upstream for the expected kind-registry:5000 image with integration ID ".concat(integrationId, "..."));
                validatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === deploymentName && workload.type === deploymentType;
                        }) !== undefined);
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(validatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace))];
            case 3:
                testResult = _a.sent();
                expect(testResult).toBeTruthy();
                return [4 /*yield*/, (0, kubernetes_upstream_1.getUpstreamResponseBody)("api/v1/scan-results/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace, "/").concat(deploymentType, "/").concat(deploymentName))];
            case 4:
                scanResultsResponse = _a.sent();
                scanResults = scanResultsResponse.workloadScanResults[imageName];
                expect(scanResults[0].facts).toEqual(expect.arrayContaining([
                    { type: 'depGraph', data: expect.any(Object) },
                    { type: 'imageId', data: expect.any(String) },
                    { type: 'imageLayers', data: expect.any(Array) },
                    { type: 'rootFs', data: expect.any(Array) },
                ]));
                expect(scanResults[0].identity.type).toEqual('deb');
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor sends deleted workload to kubernetes-upstream', function () { return __awaiter(void 0, void 0, void 0, function () {
    var deploymentValidatorFn, testResult, deploymentName, namespace, deleteValidatorFn, deleteTestResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                deploymentValidatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'binaries-deployment' &&
                                workload.type === types_1.WorkloadKind.Deployment;
                        }) !== undefined);
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(deploymentValidatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/services"))];
            case 1:
                testResult = _a.sent();
                expect(testResult).toBeTruthy();
                deploymentName = 'binaries-deployment';
                namespace = 'services';
                return [4 /*yield*/, kubectl.deleteDeployment(deploymentName, namespace)];
            case 2:
                _a.sent();
                deleteValidatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.every(function (workload) { return workload.name !== 'binaries-deployment'; }));
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(deleteValidatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace))];
            case 3:
                deleteTestResult = _a.sent();
                expect(deleteTestResult).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor has resource limits', function () { return __awaiter(void 0, void 0, void 0, function () {
    var khulnasoftMonitorDeployment, monitorResources;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, kubectl.getDeploymentJson('khulnasoft-monitor', namespace)];
            case 1:
                khulnasoftMonitorDeployment = _a.sent();
                monitorResources = khulnasoftMonitorDeployment.spec.template.spec.containers[0].resources;
                expect(monitorResources).toEqual(expect.objectContaining({
                    requests: {
                        cpu: expect.any(String),
                        memory: expect.any(String)
                    },
                    limits: {
                        cpu: expect.any(String),
                        memory: expect.any(String)
                    }
                }));
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor has log level', function () { return __awaiter(void 0, void 0, void 0, function () {
    var khulnasoftMonitorDeployment, env, logLevel;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!['Helm', 'YAML'].includes(process.env.DEPLOYMENT_TYPE || '')) {
                    console.log("Not testing LOG_LEVEL existence because we're not installing with Helm or Yaml");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, kubectl.getDeploymentJson('khulnasoft-monitor', namespace)];
            case 1:
                khulnasoftMonitorDeployment = _a.sent();
                env = khulnasoftMonitorDeployment.spec.template.spec.containers[0].env;
                logLevel = env.find(function (_a) {
                    var name = _a.name;
                    return name === 'LOG_LEVEL';
                });
                expect(logLevel.name).toBeTruthy();
                expect(logLevel.value).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor has keep-alive', function () { return __awaiter(void 0, void 0, void 0, function () {
    var khulnasoftMonitorDeployment, env, useKeepAlive;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (!['Helm'].includes(process.env.DEPLOYMENT_TYPE || '')) {
                    console.log("Not testing USE_KEEPALIVE existence because we're not installing with Helm");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, kubectl.getDeploymentJson('khulnasoft-monitor', namespace)];
            case 1:
                khulnasoftMonitorDeployment = _a.sent();
                env = khulnasoftMonitorDeployment.spec.template.spec.containers[0].env;
                useKeepAlive = env.find(function (_a) {
                    var name = _a.name;
                    return name === 'USE_KEEPALIVE';
                });
                expect(useKeepAlive.name).toBeTruthy();
                expect(useKeepAlive.value).toBe('true');
                return [2 /*return*/];
        }
    });
}); });
test('service account has annotations that were set on deployment', function () { return __awaiter(void 0, void 0, void 0, function () {
    var khulnasoftMonitorServiceAccount;
    var _a;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                if (process.env.DEPLOYMENT_TYPE !== 'Helm') {
                    console.log("Not testing annotations existence because we're not installing with Helm");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, kubectl.getServiceAccountJson('khulnasoft-monitor', namespace)];
            case 1:
                khulnasoftMonitorServiceAccount = _b.sent();
                expect((_a = khulnasoftMonitorServiceAccount.metadata) === null || _a === void 0 ? void 0 : _a.annotations).toEqual(expect.objectContaining({
                    foo: 'bar'
                }));
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor has nodeSelector', function () { return __awaiter(void 0, void 0, void 0, function () {
    var khulnasoftMonitorDeployment, spec;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (process.env['DEPLOYMENT_TYPE'] !== 'Helm') {
                    console.log("Not testing nodeSelector because we're not installing with Helm");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, kubectl.getDeploymentJson('khulnasoft-monitor', 'khulnasoft-monitor')];
            case 1:
                khulnasoftMonitorDeployment = _a.sent();
                spec = khulnasoftMonitorDeployment.spec.template.spec;
                expect(spec).toEqual(expect.objectContaining({ nodeSelector: expect.any(Object) }));
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor has nodeAffinity', function () { return __awaiter(void 0, void 0, void 0, function () {
    var khulnasoftMonitorDeployment, khulnasoftMonitorPodSpec;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                if (process.env['DEPLOYMENT_TYPE'] !== 'Helm') {
                    console.log("Not testing nodeAffinity because we're not installing with Helm");
                    return [2 /*return*/];
                }
                return [4 /*yield*/, kubectl.getDeploymentJson('khulnasoft-monitor', 'khulnasoft-monitor')];
            case 1:
                khulnasoftMonitorDeployment = _a.sent();
                khulnasoftMonitorPodSpec = khulnasoftMonitorDeployment.spec.template.spec;
                expect(khulnasoftMonitorPodSpec).toEqual(expect.objectContaining({
                    affinity: {
                        nodeAffinity: {
                            requiredDuringSchedulingIgnoredDuringExecution: {
                                nodeSelectorTerms: [
                                    {
                                        matchExpressions: [
                                            {
                                                key: 'kubernetes.io/arch',
                                                operator: 'In',
                                                values: ['amd64']
                                            },
                                            {
                                                key: 'kubernetes.io/os',
                                                operator: 'In',
                                                values: ['linux']
                                            },
                                            {
                                                key: 'beta.kubernetes.io/arch',
                                                operator: 'In',
                                                values: ['amd64']
                                            },
                                            {
                                                key: 'beta.kubernetes.io/os',
                                                operator: 'In',
                                                values: ['linux']
                                            },
                                        ]
                                    },
                                ]
                            }
                        }
                    }
                }));
                return [2 /*return*/];
        }
    });
}); });
test('khulnasoft-monitor secure configuration is as expected', function () { return __awaiter(void 0, void 0, void 0, function () {
    var kubeConfig, k8sApi, response, deployment;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
        switch (_e.label) {
            case 0:
                kubeConfig = new client_node_1.KubeConfig();
                kubeConfig.loadFromDefault();
                k8sApi = kubeConfig.makeApiClient(client_node_1.AppsV1Api);
                return [4 /*yield*/, k8sApi.readNamespacedDeployment('khulnasoft-monitor', namespace)];
            case 1:
                response = _e.sent();
                deployment = response.body;
                expect((_d = (_c = (_b = (_a = deployment.spec) === null || _a === void 0 ? void 0 : _a.template) === null || _b === void 0 ? void 0 : _b.spec) === null || _c === void 0 ? void 0 : _c.containers) === null || _d === void 0 ? void 0 : _d[0]).toEqual(expect.objectContaining({
                    securityContext: {
                        capabilities: expect.objectContaining({
                            drop: ['ALL'],
                            add: expect.not.arrayContaining(['SYS_ADMIN'])
                        }),
                        readOnlyRootFilesystem: true,
                        allowPrivilegeEscalation: false,
                        privileged: false,
                        runAsNonRoot: true
                    },
                    volumeMounts: expect.arrayContaining([
                        expect.objectContaining({
                            name: 'temporary-storage',
                            mountPath: '/var/tmp'
                        }),
                        expect.objectContaining({
                            name: 'docker-config',
                            mountPath: '/srv/app/.docker',
                            readOnly: true
                        }),
                        expect.objectContaining({
                            name: 'workload-policies',
                            mountPath: '/tmp/policies',
                            readOnly: true
                        }),
                    ]),
                    env: expect.arrayContaining([{ name: 'HOME', value: '/srv/app' }])
                }));
                return [2 /*return*/];
        }
    });
}); });
/**
 * The khulnasoft-monitor should detect that a Pod which doesn't have
 * a parent (OwnerReference) is deleted and should notify upstream.
 *
 * This is the only special case of a workload, where the Pod
 * itself is the workload (because it was created on its own).
 */
test('notify upstream of deleted pods that have no OwnerReference', function () { return __awaiter(void 0, void 0, void 0, function () {
    var podName, namespace, validatorFn, validationResult;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                podName = 'alpine';
                namespace = 'services';
                return [4 /*yield*/, kubectl.deletePod(podName, namespace)];
            case 1:
                _a.sent();
                validatorFn = function (workloads) {
                    return (workloads !== undefined &&
                        workloads.find(function (workload) {
                            return workload.name === 'alpine' && workload.type === types_1.WorkloadKind.Pod;
                        }) === undefined);
                };
                return [4 /*yield*/, (0, kubernetes_upstream_1.validateUpstreamStoredData)(validatorFn, "api/v2/workloads/".concat(integrationId, "/").concat(clusterName, "/").concat(namespace))];
            case 2:
                validationResult = _a.sent();
                expect(validationResult).toBeTruthy();
                return [2 /*return*/];
        }
    });
}); });
