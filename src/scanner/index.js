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
exports.scanImagesAndSendResults = exports.getUniqueImages = exports.sendDeleteWorkloadRequest = exports.processWorkload = void 0;
var logger_1 = require("../common/logger");
var images_1 = require("./images");
var transmitter_1 = require("../transmitter");
var payload_1 = require("../transmitter/payload");
var types_1 = require("./images/types");
var state_1 = require("../state");
function processWorkload(workloadMetadata, telemetry) {
    return __awaiter(this, void 0, void 0, function () {
        var workloadName, uniqueImages, imagesWithFileSystemPath, imagePullStartTimestampMs, pulledImages, imagePullDurationMs;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workloadName = workloadMetadata[0].name;
                    uniqueImages = getUniqueImages(workloadMetadata);
                    logger_1.logger.info({ workloadName: workloadName, imageCount: uniqueImages.length }, 'pulling unique images');
                    imagesWithFileSystemPath = (0, images_1.getImagesWithFileSystemPath)(uniqueImages);
                    imagePullStartTimestampMs = Date.now();
                    return [4 /*yield*/, (0, images_1.pullImages)(imagesWithFileSystemPath, workloadName)];
                case 1:
                    pulledImages = _a.sent();
                    imagePullDurationMs = Date.now() - imagePullStartTimestampMs;
                    if (pulledImages.length === 0) {
                        logger_1.logger.info({ workloadName: workloadName }, 'no images were pulled, halting scanner process.');
                        return [2 /*return*/];
                    }
                    telemetry.imagePullDurationMs = imagePullDurationMs;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, , 4, 6]);
                    return [4 /*yield*/, scanImagesAndSendResults(workloadName, pulledImages, workloadMetadata, telemetry)];
                case 3:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 4: return [4 /*yield*/, (0, images_1.removePulledImages)(pulledImages)];
                case 5:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.processWorkload = processWorkload;
// TODO: should be extracted from here and moved to the supervisor
function sendDeleteWorkloadRequest(workloadName, localWorkloadLocator) {
    return __awaiter(this, void 0, void 0, function () {
        var deletePayload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    deletePayload = (0, payload_1.constructDeleteWorkload)(localWorkloadLocator);
                    logger_1.logger.info({ workloadName: workloadName, workload: localWorkloadLocator }, 'removing workloads from upstream');
                    return [4 /*yield*/, (0, transmitter_1.deleteWorkload)(deletePayload)];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.sendDeleteWorkloadRequest = sendDeleteWorkloadRequest;
function getUniqueImages(workloadMetadata) {
    var uniqueImages = workloadMetadata.reduce(function (accum, meta) {
        logger_1.logger.info({
            workloadName: workloadMetadata[0].name,
            imageName: meta.imageName,
            id: meta.imageId
        }, 'image metadata');
        // example: For DCR "redis:latest"
        // example: For GCR "gcr.io/test-dummy/redis:latest"
        // example: For ECR "291964488713.dkr.ecr.us-east-2.amazonaws.com/khulnasoft/redis:latest"
        // meta.imageName can be different depends on CR
        var imageName = (0, images_1.getImageParts)(meta.imageName).imageName;
        // meta.imageId can be different depends on CR
        // example: For DCR "docker.io/library/redis@sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6"
        // example: For GCR "sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6"
        // example: For ECR "sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6"
        var digest = undefined;
        if (meta.imageId.lastIndexOf('@') > -1 || meta.imageId.startsWith('sha')) {
            digest = meta.imageId.substring(meta.imageId.lastIndexOf('@') + 1);
        }
        accum[meta.imageName] = {
            imageWithDigest: digest && "".concat(imageName, "@").concat(digest),
            imageName: meta.imageName,
            skopeoRepoType: types_1.SkopeoRepositoryType.DockerArchive
        };
        return accum;
    }, {});
    return Object.values(uniqueImages);
}
exports.getUniqueImages = getUniqueImages;
/** Exported for testing */
function scanImagesAndSendResults(workloadName, pulledImages, workloadMetadata, telemetry) {
    return __awaiter(this, void 0, void 0, function () {
        var imageScanStartTimestampMs, scannedImages, imageScanDurationMs, workload, workloadState, imageState, scanResultsPayloads, success, depGraphPayloads, pulledImagesNames, pulledImageMetadata;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    imageScanStartTimestampMs = Date.now();
                    return [4 /*yield*/, (0, images_1.scanImages)(pulledImages, telemetry)];
                case 1:
                    scannedImages = _a.sent();
                    imageScanDurationMs = Date.now() - imageScanStartTimestampMs;
                    if (scannedImages.length === 0) {
                        logger_1.logger.info({ workloadName: workloadName }, 'no images were scanned, halting scanner process.');
                        return [2 /*return*/];
                    }
                    workload = workloadMetadata[0];
                    workloadState = (0, state_1.getWorkloadAlreadyScanned)(workload);
                    imageState = (0, state_1.getWorkloadImageAlreadyScanned)(workload, workload.imageName, workload.imageId);
                    if (workloadState === undefined && imageState === undefined) {
                        logger_1.logger.info({ workloadName: workloadName }, 'the workload has been deleted while scanning was in progress, skipping sending scan results');
                        return [2 /*return*/];
                    }
                    telemetry.imageScanDurationMs = imageScanDurationMs;
                    logger_1.logger.info({ workloadName: workloadName, imageCount: scannedImages.length }, 'successfully scanned images');
                    scanResultsPayloads = (0, payload_1.constructScanResults)(scannedImages, workloadMetadata, telemetry);
                    return [4 /*yield*/, (0, transmitter_1.sendScanResults)(scanResultsPayloads)];
                case 2:
                    success = _a.sent();
                    if (!!success) return [3 /*break*/, 4];
                    depGraphPayloads = (0, payload_1.constructDepGraph)(scannedImages, workloadMetadata);
                    return [4 /*yield*/, transmitter_1.sendDepGraph.apply(void 0, depGraphPayloads)];
                case 3:
                    _a.sent();
                    _a.label = 4;
                case 4:
                    pulledImagesNames = pulledImages.map(function (image) { return image.imageName; });
                    pulledImageMetadata = workloadMetadata.filter(function (meta) {
                        return pulledImagesNames.includes(meta.imageName);
                    });
                    logger_1.logger.info({ workloadName: workloadName, imageCount: pulledImageMetadata.length }, 'processed images');
                    return [2 /*return*/];
            }
        });
    });
}
exports.scanImagesAndSendResults = scanImagesAndSendResults;
