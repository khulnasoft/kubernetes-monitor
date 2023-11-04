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
var state = require("../../../src/state");
var transmitter = require("../../../src/transmitter");
var scannerImages = require("../../../src/scanner/images");
var transmitterPayload = require("../../../src/transmitter/payload");
var scanner_1 = require("../../../src/scanner");
var pod_1 = require("../../../src/supervisor/watchers/handlers/pod");
var queue_1 = require("../../../src/supervisor/watchers/handlers/queue");
describe('scan results caching', function () {
    var workload = {
        cluster: 'cluster',
        namespace: 'namespace',
        type: 'type',
        uid: 'uid',
        name: 'name',
        imageName: 'imageName',
        imageId: 'imageId',
        containerName: 'containerName',
        revision: 1,
        podSpec: { containers: [] },
        annotations: undefined,
        labels: undefined,
        specAnnotations: undefined,
        specLabels: undefined
    };
    describe('when receiving workloads to scan', function () {
        afterEach(function () {
            jest.restoreAllMocks();
        });
        it('stores workload images to cache and pushes to queue when not already seen', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queuePushMock, setWorkloadImageAlreadyScannedMock, workloadMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queuePushMock = jest
                            .spyOn(queue_1.workloadsToScanQueue, 'pushAsync')
                            .mockResolvedValue(undefined);
                        setWorkloadImageAlreadyScannedMock = jest
                            .spyOn(state, 'setWorkloadImageAlreadyScanned')
                            .mockReturnValue(true);
                        workloadMetadata = [workload];
                        return [4 /*yield*/, (0, pod_1.handleReadyPod)(workloadMetadata)];
                    case 1:
                        _a.sent();
                        // Assert
                        expect(queuePushMock).toHaveBeenCalledWith({
                            key: workload.uid,
                            workloadMetadata: workloadMetadata,
                            enqueueTimestampMs: expect.any(Number)
                        });
                        expect(setWorkloadImageAlreadyScannedMock).toHaveBeenCalledWith(workload, 'imageName', 'imageId');
                        setWorkloadImageAlreadyScannedMock.mockRestore();
                        queuePushMock.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('stores images to cache and pushes to queue when imageId is different', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queuePushMock, setWorkloadImageAlreadyScannedMock, workloadWithNewImageId, workloadMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        queuePushMock = jest
                            .spyOn(queue_1.workloadsToScanQueue, 'pushAsync')
                            .mockResolvedValue(undefined);
                        setWorkloadImageAlreadyScannedMock = jest
                            .spyOn(state, 'setWorkloadImageAlreadyScanned')
                            .mockReturnValue(true);
                        workloadWithNewImageId = __assign(__assign({}, workload), { imageId: 'newImageId' });
                        workloadMetadata = [workloadWithNewImageId];
                        return [4 /*yield*/, (0, pod_1.handleReadyPod)(workloadMetadata)];
                    case 1:
                        _a.sent();
                        // Assert
                        expect(queuePushMock).toHaveBeenCalledWith({
                            key: workload.uid,
                            workloadMetadata: workloadMetadata,
                            enqueueTimestampMs: expect.any(Number)
                        });
                        expect(setWorkloadImageAlreadyScannedMock).toHaveBeenCalledWith(workloadWithNewImageId, 'imageName', 'newImageId');
                        setWorkloadImageAlreadyScannedMock.mockRestore();
                        queuePushMock.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('skips storing images to cache and skips pushing to queue when imageId is already seen', function () { return __awaiter(void 0, void 0, void 0, function () {
            var queuePushMock, setWorkloadImageAlreadyScannedMock, workloadMetadata;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        // Arrange
                        state.setWorkloadImageAlreadyScanned(workload, workload.imageName, workload.imageId);
                        queuePushMock = jest
                            .spyOn(queue_1.workloadsToScanQueue, 'pushAsync')
                            .mockResolvedValue(undefined);
                        setWorkloadImageAlreadyScannedMock = jest
                            .spyOn(state, 'setWorkloadImageAlreadyScanned')
                            .mockReturnValue(true);
                        workloadMetadata = [workload];
                        return [4 /*yield*/, (0, pod_1.handleReadyPod)(workloadMetadata)];
                    case 1:
                        _a.sent();
                        // Assert
                        expect(queuePushMock).not.toHaveBeenCalled();
                        expect(setWorkloadImageAlreadyScannedMock).not.toHaveBeenCalled();
                        setWorkloadImageAlreadyScannedMock.mockRestore();
                        queuePushMock.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
    describe('when scanning and sending scan results', function () {
        afterEach(function () {
            jest.restoreAllMocks();
        });
        test.each([
            [
                'with cached workload state',
                "".concat(workload.namespace, "/").concat(workload.type, "/").concat(workload.uid),
                undefined,
            ],
            [
                'with cached image state',
                undefined,
                "".concat(workload.namespace, "/").concat(workload.type, "/").concat(workload.uid, "/").concat(workload.imageId),
            ],
            [
                'with cached workload and image state',
                "".concat(workload.namespace, "/").concat(workload.type, "/").concat(workload.uid),
                "".concat(workload.namespace, "/").concat(workload.type, "/").concat(workload.uid, "/").concat(workload.imageId),
            ],
        ])('%s', function (_testCaseName, workloadState, imageState) { return __awaiter(void 0, void 0, void 0, function () {
            var scanImagesMock, constructScanResultsMock, sendScanResultsMock, workloadName, pulledImages, workloadMetadata, telemetry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scanImagesMock = jest
                            .spyOn(scannerImages, 'scanImages')
                            .mockResolvedValue([
                            {
                                image: 'image',
                                imageWithDigest: 'image@sha256:3e46ed577bf26f1bd0bf265b25b3ac3f72831bc87edee0c9da7bb8006b9b8836',
                                imageWithTag: 'image:tag',
                                pluginResult: {},
                                scanResults: []
                            },
                        ]);
                        constructScanResultsMock = jest
                            .spyOn(transmitterPayload, 'constructScanResults')
                            .mockReturnValue([]);
                        sendScanResultsMock = jest.spyOn(transmitter, 'sendScanResults');
                        // Act
                        state.setWorkloadAlreadyScanned(workload, workloadState);
                        state.setWorkloadImageAlreadyScanned(workload, workload.imageName, imageState);
                        workloadName = 'mock';
                        pulledImages = [];
                        workloadMetadata = [workload];
                        telemetry = {};
                        return [4 /*yield*/, (0, scanner_1.scanImagesAndSendResults)(workloadName, pulledImages, workloadMetadata, telemetry)];
                    case 1:
                        _a.sent();
                        // Assert
                        expect(sendScanResultsMock).toHaveBeenCalled();
                        sendScanResultsMock.mockRestore();
                        constructScanResultsMock.mockRestore();
                        scanImagesMock.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
        it('skips sending scan results when a workload is no longer in cache', function () { return __awaiter(void 0, void 0, void 0, function () {
            var scanImagesMock, sendScanResultsMock, workloadName, pulledImages, workloadMetadata, telemetry;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        scanImagesMock = jest
                            .spyOn(scannerImages, 'scanImages')
                            .mockResolvedValue([
                            {
                                image: 'image',
                                imageWithDigest: 'image@sha256:3e46ed577bf26f1bd0bf265b25b3ac3f72831bc87edee0c9da7bb8006b9b8836',
                                imageWithTag: 'image:tag',
                                pluginResult: {},
                                scanResults: []
                            },
                        ]);
                        sendScanResultsMock = jest.spyOn(transmitter, 'sendScanResults');
                        // Act
                        state.state.workloadsAlreadyScanned.reset();
                        state.state.imagesAlreadyScanned.reset();
                        workloadName = 'mock';
                        pulledImages = [];
                        workloadMetadata = [workload];
                        telemetry = {};
                        return [4 /*yield*/, (0, scanner_1.scanImagesAndSendResults)(workloadName, pulledImages, workloadMetadata, telemetry)];
                    case 1:
                        _a.sent();
                        // Assert
                        expect(sendScanResultsMock).not.toHaveBeenCalled();
                        sendScanResultsMock.mockRestore();
                        scanImagesMock.mockRestore();
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
