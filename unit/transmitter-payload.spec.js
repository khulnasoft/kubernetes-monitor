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
var fs_1 = require("fs");
var path_1 = require("path");
var config_1 = require("../../src/common/config");
var payload = require("../../src/transmitter/payload");
var podSpecFixture = JSON.parse((0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../', 'fixtures', 'pod-spec.json'), {
    encoding: 'utf8'
}));
describe('transmitter payload tests', function () {
    test.concurrent('constructScanResults breaks when workloadMetadata is missing items', function () { return __awaiter(void 0, void 0, void 0, function () {
        var scannedImages, workloadMetadata, telemetry;
        return __generator(this, function (_a) {
            scannedImages = [
                {
                    image: 'myImage',
                    imageWithTag: 'myImage:tag',
                    imageWithDigest: 'myImage@sha256:idontcarewhatissha',
                    pluginResult: 'whatever1',
                    scanResults: []
                },
                {
                    image: 'anotherImage',
                    imageWithTag: 'anotherImage:1.2.3-alpha',
                    imageWithDigest: 'myImage@sha256:somuchdifferentsha256',
                    pluginResult: 'whatever3',
                    scanResults: []
                },
            ];
            workloadMetadata = [
                {
                    type: 'type',
                    name: 'workloadName',
                    namespace: 'spacename',
                    labels: undefined,
                    annotations: undefined,
                    uid: 'udi',
                    specLabels: undefined,
                    specAnnotations: undefined,
                    containerName: 'contener',
                    imageName: 'myImage',
                    imageId: 'does this matter?',
                    cluster: 'grapefruit',
                    revision: undefined,
                    podSpec: podSpecFixture
                },
            ];
            telemetry = {};
            expect(function () {
                return payload.constructScanResults(scannedImages, workloadMetadata, telemetry);
            }).toThrow();
            return [2 /*return*/];
        });
    }); });
    test.concurrent('constructScanResults happy flow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var scannedImages, workloadMetadata, telemetry, backups, payloads, firstPayload;
        return __generator(this, function (_a) {
            scannedImages = [
                {
                    image: 'myImage',
                    imageWithTag: 'myImage:tag',
                    imageWithDigest: 'myImage@sha256:idontcarewhatissha',
                    pluginResult: 'whatever1',
                    scanResults: [
                        { facts: [], identity: { type: 'foo' }, target: { image: 'foo' } },
                    ]
                },
            ];
            workloadMetadata = [
                {
                    type: 'type',
                    name: 'workloadName',
                    namespace: 'spacename',
                    labels: undefined,
                    annotations: undefined,
                    uid: 'udi',
                    specLabels: undefined,
                    specAnnotations: undefined,
                    containerName: 'contener',
                    imageName: 'myImage:tag',
                    imageId: 'does this matter?',
                    cluster: 'grapefruit',
                    revision: 1,
                    podSpec: podSpecFixture
                },
            ];
            telemetry = {};
            backups = {
                namespace: config_1.config.WATCH_NAMESPACE,
                version: config_1.config.MONITOR_VERSION
            };
            config_1.config.WATCH_NAMESPACE = 'b7';
            config_1.config.MONITOR_VERSION = '1.2.3';
            payloads = payload.constructScanResults(scannedImages, workloadMetadata, telemetry);
            expect(payloads).toHaveLength(1);
            firstPayload = payloads[0];
            expect(firstPayload.scanResults).toEqual([
                { facts: [], identity: { type: 'foo' }, target: { image: 'foo' } },
            ]);
            expect(firstPayload.imageLocator).toEqual(expect.objectContaining({
                cluster: 'grapefruit',
                imageId: 'myImage',
                name: 'workloadName',
                type: 'type'
            }));
            config_1.config.WATCH_NAMESPACE = backups.namespace;
            config_1.config.MONITOR_VERSION = backups.version;
            return [2 /*return*/];
        });
    }); });
    test.concurrent('constructWorkloadMetadata happy flow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workloadWithImages, workloadMetadataPayload;
        var _a, _b;
        return __generator(this, function (_c) {
            workloadWithImages = {
                type: 'type',
                name: 'workloadName',
                namespace: 'spacename',
                labels: undefined,
                annotations: undefined,
                uid: 'udi',
                specLabels: undefined,
                specAnnotations: undefined,
                containerName: 'contener',
                imageName: 'myImage:tag',
                imageId: 'does this matter?',
                cluster: 'grapefruit',
                revision: 1,
                podSpec: podSpecFixture
            };
            workloadMetadataPayload = payload.constructWorkloadMetadata(workloadWithImages);
            expect(workloadMetadataPayload.workloadLocator).toEqual(expect.objectContaining({
                cluster: 'grapefruit',
                namespace: 'spacename',
                name: 'workloadName',
                type: 'type'
            }));
            expect(workloadMetadataPayload.workloadMetadata).toEqual(expect.objectContaining({
                podSpec: expect.any(Object),
                annotations: undefined,
                specAnnotations: undefined,
                labels: undefined,
                specLabels: undefined
            }));
            expect(workloadMetadataPayload.workloadMetadata.revision).toEqual(1);
            expect((_b = (_a = workloadMetadataPayload.workloadMetadata.podSpec.containers[0].resources) === null || _a === void 0 ? void 0 : _a.limits) === null || _b === void 0 ? void 0 : _b.memory).toEqual('2Gi');
            expect(workloadMetadataPayload.workloadMetadata.podSpec.serviceAccountName).toEqual('khulnasoft-monitor');
            return [2 /*return*/];
        });
    }); });
    test.concurrent('constructDeleteWorkload happy flow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var localWorkloadLocator, deleteWorkloadParams;
        return __generator(this, function (_a) {
            localWorkloadLocator = {
                name: 'wl-name',
                namespace: 'wl-namespace',
                type: 'wl-type'
            };
            deleteWorkloadParams = payload.constructDeleteWorkload(localWorkloadLocator);
            expect(deleteWorkloadParams).toEqual({
                workloadLocator: expect.any(Object),
                agentId: expect.any(String)
            });
            expect(deleteWorkloadParams.workloadLocator).toEqual({
                userLocator: expect.any(String),
                cluster: expect.any(String),
                name: 'wl-name',
                namespace: 'wl-namespace',
                type: 'wl-type'
            });
            return [2 /*return*/];
        });
    }); });
    test.concurrent('constructRuntimeData happy flow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeDataPayload;
        return __generator(this, function (_a) {
            runtimeDataPayload = payload.constructRuntimeData([
                {
                    imageID: 'something',
                    namespace: 'sysdig',
                    workloadName: 'workload',
                    workloadKind: 'deployment',
                    container: 'box',
                    packages: []
                },
            ]);
            expect(runtimeDataPayload).toEqual({
                identity: {
                    type: 'sysdig'
                },
                target: {
                    userLocator: expect.any(String),
                    cluster: 'Default cluster',
                    agentId: expect.any(String)
                },
                facts: [
                    {
                        type: 'loadedPackages',
                        data: [
                            {
                                imageID: 'something',
                                namespace: 'sysdig',
                                workloadName: 'workload',
                                workloadKind: 'Deployment',
                                container: 'box',
                                packages: []
                            },
                        ]
                    },
                ]
            });
            return [2 /*return*/];
        });
    }); });
    test.concurrent('constructRuntimeData with excluded namespace happy flow', function () { return __awaiter(void 0, void 0, void 0, function () {
        var runtimeDataPayload;
        return __generator(this, function (_a) {
            config_1.config.EXCLUDED_NAMESPACES = ['test'];
            runtimeDataPayload = payload.constructRuntimeData([
                {
                    imageID: 'something',
                    namespace: 'sysdig',
                    workloadName: 'workload',
                    workloadKind: 'deployment',
                    container: 'box',
                    packages: []
                },
                {
                    imageID: 'something',
                    namespace: 'test',
                    workloadName: 'workload',
                    workloadKind: 'deployment',
                    container: 'box',
                    packages: []
                },
            ]);
            expect(runtimeDataPayload).toEqual({
                identity: {
                    type: 'sysdig'
                },
                target: {
                    userLocator: expect.any(String),
                    cluster: 'Default cluster',
                    agentId: expect.any(String)
                },
                facts: [
                    {
                        type: 'loadedPackages',
                        data: [
                            {
                                imageID: 'something',
                                namespace: 'sysdig',
                                workloadName: 'workload',
                                workloadKind: 'Deployment',
                                container: 'box',
                                packages: []
                            },
                        ]
                    },
                ]
            });
            return [2 /*return*/];
        });
    }); });
});
