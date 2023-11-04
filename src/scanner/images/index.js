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
exports.scanImages = exports.getImageParts = exports.removePulledImages = exports.getImagesWithFileSystemPath = exports.pullImages = void 0;
var fs_1 = require("fs");
var util_1 = require("util");
var khulnasoft_docker_plugin_1 = require("khulnasoft-docker-plugin");
var dep_graph_1 = require("@khulnasoft/dep-graph");
var logger_1 = require("../../common/logger");
var skopeo_1 = require("./skopeo");
var docker_plugin_shim_1 = require("./docker-plugin-shim");
var statAsync = (0, util_1.promisify)(fs_1.stat);
/*
 pulled images by skopeo archive repo type:
 1st try to pull by docker archive image if it fail try to pull by oci archive
*/
function pullImageBySkopeoRepo(imageToPull, workloadName) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var scanId;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    scanId = (_a = imageToPull.imageWithDigest) !== null && _a !== void 0 ? _a : imageToPull.imageName;
                    return [4 /*yield*/, (0, skopeo_1.pull)(scanId, imageToPull.fileSystemPath, imageToPull.skopeoRepoType, workloadName)];
                case 1:
                    _b.sent();
                    return [2 /*return*/, imageToPull];
            }
        });
    });
}
function pullImages(images, workloadName) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var pulledImages, _i, images_1, image, pulledImage, error_1;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    pulledImages = [];
                    _i = 0, images_1 = images;
                    _b.label = 1;
                case 1:
                    if (!(_i < images_1.length)) return [3 /*break*/, 6];
                    image = images_1[_i];
                    if (!image.fileSystemPath) {
                        return [3 /*break*/, 5];
                    }
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, pullImageBySkopeoRepo(image, workloadName)];
                case 3:
                    pulledImage = _b.sent();
                    pulledImages.push(pulledImage);
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _b.sent();
                    logger_1.logger.error({ error: error_1, image: (_a = image.imageWithDigest) !== null && _a !== void 0 ? _a : image.imageName }, 'failed to pull image docker/oci archive image');
                    return [3 /*break*/, 5];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, pulledImages];
            }
        });
    });
}
exports.pullImages = pullImages;
function getImagesWithFileSystemPath(images) {
    return images.map(function (image) { return (__assign(__assign({}, image), { fileSystemPath: (0, skopeo_1.getDestinationForImage)(image.imageName) })); });
}
exports.getImagesWithFileSystemPath = getImagesWithFileSystemPath;
function removePulledImages(images) {
    return __awaiter(this, void 0, void 0, function () {
        var _loop_1, _i, images_2, _a, imageName, fileSystemPath;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _loop_1 = function (imageName, fileSystemPath) {
                        var error_2;
                        return __generator(this, function (_c) {
                            switch (_c.label) {
                                case 0:
                                    _c.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, new Promise(function (resolve) { return (0, fs_1.unlink)(fileSystemPath, resolve); })];
                                case 1:
                                    _c.sent();
                                    return [3 /*break*/, 3];
                                case 2:
                                    error_2 = _c.sent();
                                    logger_1.logger.warn({ error: error_2, image: imageName }, 'failed to delete pulled image');
                                    return [3 /*break*/, 3];
                                case 3: return [2 /*return*/];
                            }
                        });
                    };
                    _i = 0, images_2 = images;
                    _b.label = 1;
                case 1:
                    if (!(_i < images_2.length)) return [3 /*break*/, 4];
                    _a = images_2[_i], imageName = _a.imageName, fileSystemPath = _a.fileSystemPath;
                    return [5 /*yield**/, _loop_1(imageName, fileSystemPath)];
                case 2:
                    _b.sent();
                    _b.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.removePulledImages = removePulledImages;
// Exported for testing
function getImageParts(imageWithTag) {
    // we're matching pattern: <registry:port_number>(optional)/<image_name>(mandatory):<image_tag>(optional)@<tag_identifier>(optional)
    // extracted from https://github.com/docker/distribution/blob/master/reference/regexp.go
    var regex = /^((?:(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9])(?:(?:\.(?:[a-zA-Z0-9]|[a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]))+)?(?::[0-9]+)?\/)?[a-z0-9]+(?:(?:(?:[._]|__|[-]*)[a-z0-9]+)+)?(?:(?:\/[a-z0-9]+(?:(?:(?:[._]|__|[-]*)[a-z0-9]+)+)?)+)?)(?::([\w][\w.-]{0,127}))?(?:@([A-Za-z][A-Za-z0-9]*(?:[-_+.][A-Za-z][A-Za-z0-9]*)*[:][A-Fa-f0-9]{32,}))?$/gi;
    var groups = regex.exec(imageWithTag);
    if (!groups) {
        logger_1.logger.error({ image: imageWithTag }, 'Image with tag is malformed, cannot extract valid parts');
        return { imageName: imageWithTag, imageTag: '', imageDigest: '' };
    }
    var IMAGE_NAME_GROUP = 1;
    var IMAGE_TAG_GROUP = 2;
    var IMAGE_DIGEST_GROUP = 3;
    return {
        imageName: groups[IMAGE_NAME_GROUP],
        imageTag: groups[IMAGE_TAG_GROUP] || '',
        imageDigest: groups[IMAGE_DIGEST_GROUP] || ''
    };
}
exports.getImageParts = getImageParts;
function scanImages(images, telemetry) {
    return __awaiter(this, void 0, void 0, function () {
        var scannedImages, _i, images_3, _a, imageName, fileSystemPath, imageWithDigest, archivePath, pluginResponse, fileStats, error_3, depTree, imageParts, imageDigest, result, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    scannedImages = [];
                    _i = 0, images_3 = images;
                    _b.label = 1;
                case 1:
                    if (!(_i < images_3.length)) return [3 /*break*/, 11];
                    _a = images_3[_i], imageName = _a.imageName, fileSystemPath = _a.fileSystemPath, imageWithDigest = _a.imageWithDigest;
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 9, , 10]);
                    archivePath = "docker-archive:".concat(fileSystemPath);
                    return [4 /*yield*/, (0, khulnasoft_docker_plugin_1.scan)({
                            path: archivePath,
                            imageNameAndTag: imageName,
                            imageNameAndDigest: imageWithDigest
                        })];
                case 3:
                    pluginResponse = _b.sent();
                    if (!pluginResponse ||
                        !Array.isArray(pluginResponse.scanResults) ||
                        pluginResponse.scanResults.length === 0) {
                        throw Error('Unexpected empty result from docker-plugin');
                    }
                    _b.label = 4;
                case 4:
                    _b.trys.push([4, 6, , 7]);
                    return [4 /*yield*/, statAsync(fileSystemPath)];
                case 5:
                    fileStats = _b.sent();
                    if (!telemetry.imageSizeBytes) {
                        telemetry.imageSizeBytes = 0;
                    }
                    telemetry.imageSizeBytes += fileStats.size;
                    return [3 /*break*/, 7];
                case 6:
                    error_3 = _b.sent();
                    logger_1.logger.warn({ error: error_3, imageName: imageName, imageWithDigest: imageWithDigest, fileSystemPath: fileSystemPath }, 'could not determine archive size');
                    return [3 /*break*/, 7];
                case 7: return [4 /*yield*/, getDependencyTreeFromPluginResponse(pluginResponse, imageName)];
                case 8:
                    depTree = _b.sent();
                    imageParts = getImageParts(imageName);
                    imageDigest = imageWithDigest && getImageParts(imageWithDigest).imageDigest;
                    result = getLegacyPluginResponse(depTree, imageParts, imageDigest);
                    scannedImages.push({
                        image: imageParts.imageName,
                        imageWithTag: imageName,
                        imageWithDigest: imageWithDigest,
                        pluginResult: result,
                        scanResults: pluginResponse.scanResults
                    });
                    return [3 /*break*/, 10];
                case 9:
                    error_4 = _b.sent();
                    logger_1.logger.warn({ error: error_4, image: imageName }, 'failed to scan image');
                    return [3 /*break*/, 10];
                case 10:
                    _i++;
                    return [3 /*break*/, 1];
                case 11: return [2 /*return*/, scannedImages];
            }
        });
    });
}
exports.scanImages = scanImages;
function getLegacyPluginResponse(depTree, imageParts, imageDigest) {
    var _a, _b, _c;
    return {
        package: depTree,
        manifestFiles: [],
        plugin: {
            name: 'khulnasoft-docker-plugin',
            imageLayers: ((_a = depTree.docker) === null || _a === void 0 ? void 0 : _a.imageLayers) || [],
            dockerImageId: depTree.dockerImageId || ((_b = depTree.docker) === null || _b === void 0 ? void 0 : _b.dockerImageId) || '',
            packageManager: depTree.type,
            runtime: undefined
        },
        imageMetadata: {
            image: imageParts.imageName,
            imageTag: imageParts.imageTag,
            imageDigest: imageDigest
        },
        hashes: ((_c = depTree.docker) === null || _c === void 0 ? void 0 : _c.hashes) || []
    };
}
/**
 * Converts from the new plugin format back to the old DependencyTree format.
 * May throw if the expected data is missing.
 */
function getDependencyTreeFromPluginResponse(pluginResponse, imageName) {
    var _a;
    return __awaiter(this, void 0, void 0, function () {
        var osDepGraph, depTree, osScanResultFacts, dockerDepTree;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    osDepGraph = (_a = pluginResponse.scanResults[0].facts.find(function (fact) { return fact.type === 'depGraph'; })) === null || _a === void 0 ? void 0 : _a.data;
                    if (!osDepGraph) {
                        throw new Error('Missing dependency graph');
                    }
                    return [4 /*yield*/, dep_graph_1.legacy.graphToDepTree(osDepGraph, osDepGraph.pkgManager.name)];
                case 1:
                    depTree = _b.sent();
                    osScanResultFacts = (0, docker_plugin_shim_1.extractFactsFromDockerPluginResponse)(pluginResponse);
                    dockerDepTree = (0, docker_plugin_shim_1.buildDockerPropertiesOnDepTree)(depTree, osScanResultFacts, imageName);
                    return [2 /*return*/, dockerDepTree];
            }
        });
    });
}
