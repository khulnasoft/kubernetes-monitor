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
var nock_1 = require("nock");
var util_1 = require("util");
var crypto_1 = require("crypto");
var fsExtra = require("fs-extra");
var sleep_promise_1 = require("sleep-promise");
var path_1 = require("path");
var fs_1 = require("fs");
var kubectl = require("../helpers/kubectl");
var kind = require("../setup/platforms/kind");
var exec_1 = require("../helpers/exec");
var copyFileAsync = (0, util_1.promisify)(fs_1.copyFile);
var readFileAsync = (0, util_1.promisify)(fs_1.readFile);
var mkdirAsync = (0, util_1.promisify)(fs_1.mkdir);
var existsAsync = (0, util_1.promisify)(fs_1.exists);
/**
 * TODO graceful shutdown
 * We abruptly close the connection to the K8s API server during shutdown, which can result in exceptions.
 * For now we ignore them in this specific case, but in the future we must implement a clean shutdown that we can invoke.
 *
 * Don't be alarmed if you see anything like this in the Jest logs, it is expected for now:
 *   Unhandled error
 *     at process.uncaught (node_modules/jest-jasmine2/build/jasmine/Env.js:248:21)
 *   Error: Client network socket disconnected before secure TLS connection was established
 */
var state_1 = require("../../src/state");
var kubernetesApiWrappers = require("../../src/supervisor/kuberenetes-api-wrappers");
var config_1 = require("../../src/common/config");
function tearDown() {
    return __awaiter(this, void 0, void 0, function () {
        var err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('Begin removing the khulnasoft-monitor...');
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 4, , 5]);
                    return [4 /*yield*/, kind.deleteCluster()];
                case 2:
                    _a.sent();
                    // Workaround. Tests are failing, cos deleting cluster finishes after the test
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(15 * 1000)];
                case 3:
                    // Workaround. Tests are failing, cos deleting cluster finishes after the test
                    _a.sent();
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    console.log('Could not cleanly tear down the environment', err_1.message);
                    return [3 /*break*/, 5];
                case 5:
                    console.log('Removed the khulnasoft-monitor!');
                    return [2 /*return*/];
            }
        });
    });
}
beforeAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, tearDown()];
            case 1:
                _a.sent();
                config_1.config.SERVICE_ACCOUNT_API_TOKEN = 'test-service-account-token';
                return [2 /*return*/];
        }
    });
}); });
afterAll(function () { return __awaiter(void 0, void 0, void 0, function () {
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                jest.restoreAllMocks();
                state_1.state.shutdownInProgress = true;
                return [4 /*yield*/, tearDown()];
            case 1:
                _a.sent();
                config_1.config.SERVICE_ACCOUNT_API_TOKEN = '';
                return [2 /*return*/];
        }
    });
}); });
test('Kubernetes-Monitor with KinD', function () { return __awaiter(void 0, void 0, void 0, function () {
    var emptyDirSyncStub, agentId, retryKubernetesApiRequestMock, err_2, kubernetesVersion, regoPolicyFixturePath, expectedPoliciesPath, expectedHeader, regoPolicyContents, retries;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                emptyDirSyncStub = jest
                    .spyOn(fsExtra, 'emptyDirSync')
                    .mockReturnValue({});
                agentId = (0, crypto_1.randomUUID)();
                retryKubernetesApiRequestMock = jest
                    .spyOn(kubernetesApiWrappers, 'retryKubernetesApiRequestIndefinitely')
                    .mockResolvedValueOnce({
                    body: {
                        metadata: {
                            uid: agentId
                        }
                    }
                });
                _a.label = 1;
            case 1:
                _a.trys.push([1, 3, , 4]);
                return [4 /*yield*/, (0, exec_1.execWrapper)('which skopeo')];
            case 2:
                _a.sent();
                console.log('Skopeo already installed :tada:');
                return [3 /*break*/, 4];
            case 3:
                err_2 = _a.sent();
                throw new Error('Please install skopeo on your machine');
            case 4:
                kubernetesVersion = 'latest';
                // kubectl
                return [4 /*yield*/, kubectl.downloadKubectl(kubernetesVersion)];
            case 5:
                // kubectl
                _a.sent();
                // KinD
                return [4 /*yield*/, kind.setupTester()];
            case 6:
                // KinD
                _a.sent();
                return [4 /*yield*/, kind.createCluster(kubernetesVersion)];
            case 7:
                _a.sent();
                return [4 /*yield*/, kind.exportKubeConfig()];
            case 8:
                _a.sent();
                return [4 /*yield*/, Promise.all([
                        kubectl.createNamespace('khulnasoft-monitor'),
                        kubectl.createNamespace('services'),
                    ])];
            case 9:
                _a.sent();
                // wait for default service account
                return [4 /*yield*/, kubectl.waitForServiceAccount('default', 'default')];
            case 10:
                // wait for default service account
                _a.sent();
                // Services
                return [4 /*yield*/, Promise.all([
                        kubectl.applyK8sYaml((0, path_1.resolve)('./test/fixtures/java-deployment.yaml')),
                        kubectl.waitForDeployment('java', 'services'),
                    ])];
            case 11:
                // Services
                _a.sent();
                regoPolicyFixturePath = (0, path_1.resolve)('./test/fixtures/workload-events.rego');
                expectedPoliciesPath = (0, path_1.resolve)('/tmp/policies');
                return [4 /*yield*/, existsAsync(expectedPoliciesPath)];
            case 12:
                if (!!(_a.sent())) return [3 /*break*/, 14];
                return [4 /*yield*/, mkdirAsync(expectedPoliciesPath)];
            case 13:
                _a.sent();
                _a.label = 14;
            case 14: return [4 /*yield*/, copyFileAsync(regoPolicyFixturePath, (0, path_1.resolve)(expectedPoliciesPath, 'workload-events.rego'))];
            case 15:
                _a.sent();
                expectedHeader = 'token test-service-account-token';
                return [4 /*yield*/, readFileAsync(regoPolicyFixturePath, 'utf8')];
            case 16:
                regoPolicyContents = _a.sent();
                (0, nock_1["default"])('https://api.khulnasoft.com')
                    .post('/v2/kubernetes-upstream/api/v1/policy?version=2023-02-10')
                    .matchHeader('Authorization', expectedHeader)
                    .times(1)
                    .reply(200, function (uri, requestBody) {
                    expect(requestBody).toEqual({
                        agentId: agentId,
                        cluster: expect.any(String),
                        userLocator: expect.any(String),
                        policy: regoPolicyContents
                    });
                });
                (0, nock_1["default"])('https://api.khulnasoft.com')
                    .post('/v2/kubernetes-upstream/api/v1/cluster?version=2023-02-10')
                    .matchHeader('Authorization', expectedHeader)
                    .times(1)
                    .reply(200, function (uri, requestBody) {
                    expect(requestBody).toEqual({
                        agentId: agentId,
                        cluster: expect.any(String),
                        userLocator: expect.any(String)
                    });
                });
                // TODO: These nocks are not working as expected and causing nock checks to fail
                // nock(/https\:\/\/127\.0\.0\.1\:\d+/, { allowUnmocked: true })
                //   .get('/apis/apps/v1/deployments')
                //   .times(1)
                //   .replyWithError({
                //     code: 'ECONNREFUSED',
                //   })
                //   .get('/apis/apps/v1/deployments')
                //   .times(1)
                //   .replyWithError({
                //     code: 'ECONNRESET',
                //   });
                // nock(/https\:\/\/127\.0\.0\.1\:\d+/)
                //   .get('/apis/argoproj.io/v1alpha1/rollouts')
                //   .query(true)
                //   .times(1)
                //   .reply(200);
                (0, nock_1["default"])('https://api.khulnasoft.com')
                    .post('/v2/kubernetes-upstream/api/v1/workload?version=2023-02-10')
                    .matchHeader('Authorization', expectedHeader)
                    .times(1)
                    .reply(200, function (uri, requestBody) {
                    expect(requestBody).toEqual({
                        workloadLocator: {
                            cluster: expect.any(String),
                            name: expect.any(String),
                            namespace: expect.any(String),
                            type: expect.any(String),
                            userLocator: expect.any(String)
                        },
                        workloadMetadata: expect.objectContaining({
                            annotations: expect.any(Object)
                        }),
                        agentId: agentId
                    });
                });
                (0, nock_1["default"])('https://api.khulnasoft.com')
                    .post('/v2/kubernetes-upstream/api/v1/scan-results?version=2023-02-10')
                    .matchHeader('Authorization', expectedHeader)
                    .times(1)
                    .replyWithError({
                    code: 'ECONNRESET',
                    message: 'socket hang up'
                });
                (0, nock_1["default"])('https://api.khulnasoft.com')
                    .post('/v2/kubernetes-upstream/api/v1/scan-results?version=2023-02-10')
                    .matchHeader('Authorization', expectedHeader)
                    .times(1)
                    .replyWithError({
                    code: 'EAI_AGAIN',
                    message: 'getaddrinfo EAI_AGAIN kubernetes-upstream.khulnasoft.com'
                });
                (0, nock_1["default"])('https://api.khulnasoft.com')
                    .post('/v2/kubernetes-upstream/api/v1/scan-results?version=2023-02-10')
                    .matchHeader('Authorization', expectedHeader)
                    .times(1)
                    // Reply with an error (500) so that we can see that khulnasoft-monitor falls back to sending to the /dependency-graph API.
                    .reply(500, function (uri, requestBody) {
                    expect(requestBody).toEqual({
                        agentId: agentId,
                        telemetry: {
                            enqueueDurationMs: expect.any(Number),
                            imagePullDurationMs: expect.any(Number),
                            imageScanDurationMs: expect.any(Number),
                            imageSizeBytes: expect.any(Number),
                            queueSize: expect.any(Number)
                        },
                        imageLocator: expect.objectContaining({
                            imageId: expect.any(String)
                        }),
                        scanResults: [
                            {
                                facts: expect.arrayContaining([
                                    { type: 'depGraph', data: expect.any(Object) },
                                    { type: 'keyBinariesHashes', data: expect.any(Array) },
                                    { type: 'imageId', data: expect.any(String) },
                                    { type: 'imageLayers', data: expect.any(Array) },
                                    { type: 'rootFs', data: expect.any(Array) },
                                    { type: 'imageOsReleasePrettyName', data: expect.any(String) },
                                    {
                                        type: 'imageNames',
                                        data: {
                                            names: [
                                                'docker.io/library/openjdk:latest',
                                                expect.stringContaining('docker.io/library/openjdk@sha256:'),
                                            ]
                                        }
                                    },
                                ]),
                                target: { image: 'docker-image|docker.io/library/openjdk' },
                                identity: { type: 'rpm', args: { platform: 'linux/amd64' } }
                            },
                            {
                                facts: [
                                    { type: 'jarFingerprints', data: expect.any(Object) },
                                    { type: 'imageId', data: expect.any(String) },
                                ],
                                identity: {
                                    type: 'maven',
                                    targetFile: '/usr/java/openjdk-18/lib'
                                },
                                target: { image: 'docker-image|docker.io/library/openjdk' }
                            },
                        ]
                    });
                });
                (0, nock_1["default"])('https://api.khulnasoft.com')
                    .post('/v2/kubernetes-upstream/api/v1/dependency-graph?version=2023-02-10')
                    .matchHeader('Authorization', expectedHeader)
                    .times(1)
                    .reply(200, function (uri, requestBody) {
                    expect(requestBody).toEqual({
                        agentId: agentId,
                        dependencyGraph: expect.stringContaining('docker-image|docker.io/library/openjdk'),
                        imageLocator: {
                            userLocator: expect.any(String),
                            cluster: expect.any(String),
                            imageId: expect.any(String),
                            name: expect.any(String),
                            namespace: expect.any(String),
                            type: expect.any(String),
                            imageWithDigest: expect.any(String)
                        }
                    });
                    expect(retryKubernetesApiRequestMock).toHaveBeenCalled();
                });
                // Start the monitor
                require('../../src');
                expect(emptyDirSyncStub).toHaveBeenCalled();
                console.log('waiting for expected https requests to be called');
                retries = 18;
                _a.label = 17;
            case 17:
                if (!(!nock_1["default"].isDone() && retries > 0)) return [3 /*break*/, 19];
                console.log("waiting for https requests to have been called, ".concat(retries, "0 seconds left"));
                console.log("nock pending mocks: ".concat(nock_1["default"].pendingMocks()));
                retries--;
                return [4 /*yield*/, (0, sleep_promise_1["default"])(10 * 1000)];
            case 18:
                _a.sent();
                return [3 /*break*/, 17];
            case 19:
                try {
                    expect(nock_1["default"].isDone()).toBeTruthy();
                }
                catch (err) {
                    console.error("nock pending mocks: ".concat(nock_1["default"].pendingMocks()));
                    throw err;
                }
                return [2 /*return*/];
        }
    });
}); });
