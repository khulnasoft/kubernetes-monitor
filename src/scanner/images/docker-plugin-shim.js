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
exports.getApplicationDependencyTrees = exports.buildDockerPropertiesOnDepTree = exports.extractFactsFromDockerPluginResponse = void 0;
var depGraphLib = require("@khulnasoft/dep-graph");
function extractFactsFromDockerPluginResponse(pluginResponse) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    var depGraph = (_a = pluginResponse.scanResults[0].facts.find(function (fact) { return fact.type === 'depGraph'; })) === null || _a === void 0 ? void 0 : _a.data;
    var manifestFiles = (_b = pluginResponse.scanResults[0].facts.find(function (fact) { return fact.type === 'imageManifestFiles'; })) === null || _b === void 0 ? void 0 : _b.data;
    var hashes = (_c = pluginResponse.scanResults[0].facts.find(function (fact) { return fact.type === 'keyBinariesHashes'; })) === null || _c === void 0 ? void 0 : _c.data;
    var imageLayers = (_d = pluginResponse.scanResults[0].facts.find(function (fact) { return fact.type === 'imageLayers'; })) === null || _d === void 0 ? void 0 : _d.data;
    var rootFs = (_e = pluginResponse.scanResults[0].facts.find(function (fact) { return fact.type === 'rootFs'; })) === null || _e === void 0 ? void 0 : _e.data;
    var imageId = (_f = pluginResponse.scanResults[0].facts.find(function (fact) { return fact.type === 'imageId'; })) === null || _f === void 0 ? void 0 : _f.data;
    var imageOsReleasePrettyName = (_g = pluginResponse.scanResults[0].facts.find(function (fact) { return fact.type === 'imageOsReleasePrettyName'; })) === null || _g === void 0 ? void 0 : _g.data;
    var platform = (_h = pluginResponse.scanResults[0].identity.args) === null || _h === void 0 ? void 0 : _h.platform;
    return {
        depGraph: depGraph,
        manifestFiles: manifestFiles,
        hashes: hashes,
        imageLayers: imageLayers,
        rootFs: rootFs,
        imageId: imageId,
        imageOsReleasePrettyName: imageOsReleasePrettyName,
        platform: platform
    };
}
exports.extractFactsFromDockerPluginResponse = extractFactsFromDockerPluginResponse;
function buildDockerPropertiesOnDepTree(depTree, dockerPluginFacts, image) {
    var hashes = dockerPluginFacts.hashes, imageLayers = dockerPluginFacts.imageLayers, rootFs = dockerPluginFacts.rootFs, imageId = dockerPluginFacts.imageId, imageOsReleasePrettyName = dockerPluginFacts.imageOsReleasePrettyName, platform = dockerPluginFacts.platform;
    var mutatedDepTree = depTree;
    mutatedDepTree.docker = {
        hashes: hashes,
        imageLayers: imageLayers,
        rootFs: rootFs,
        dockerImageId: imageId,
        imageName: image
    };
    mutatedDepTree.dockerImageId = imageId || '';
    if (mutatedDepTree.targetOS) {
        mutatedDepTree.targetOS.prettyName = imageOsReleasePrettyName || '';
    }
    if (!mutatedDepTree.meta) {
        mutatedDepTree.meta = {};
    }
    mutatedDepTree.meta.platform = platform;
    return mutatedDepTree;
}
exports.buildDockerPropertiesOnDepTree = buildDockerPropertiesOnDepTree;
/**
 * Produces a DependencyTree (DepsDiscoveryResult) for every ScanResult
 * that contains a dependency graph. ScanResults with other data are ignored
 * because the data cannot be resolved to a DepTree.
 */
function getApplicationDependencyTrees(applicationScanResults) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var dependencyTrees, _i, applicationScanResults_1, scanResult, appDepGraph, appDepTree, testedFiles;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    dependencyTrees = [];
                    _i = 0, applicationScanResults_1 = applicationScanResults;
                    _c.label = 1;
                case 1:
                    if (!(_i < applicationScanResults_1.length)) return [3 /*break*/, 4];
                    scanResult = applicationScanResults_1[_i];
                    appDepGraph = (_a = scanResult.facts.find(function (fact) { return fact.type === 'depGraph'; })) === null || _a === void 0 ? void 0 : _a.data;
                    // Skip this ScanResult if we could not read a dependency graph.
                    // Some ScanResults like Java will not contain a graph but instead a list of hashes.
                    // These are not supported by the current API.
                    if (appDepGraph === undefined) {
                        return [3 /*break*/, 3];
                    }
                    return [4 /*yield*/, depGraphLib.legacy.graphToDepTree(appDepGraph, appDepGraph.pkgManager.name)];
                case 2:
                    appDepTree = _c.sent();
                    if (!appDepTree.name || !appDepTree.type) {
                        return [3 /*break*/, 3];
                    }
                    testedFiles = (_b = scanResult.facts.find(function (fact) { return fact.type === 'testedFiles'; })) === null || _b === void 0 ? void 0 : _b.data;
                    dependencyTrees.push({
                        name: appDepTree.name,
                        version: appDepTree.version,
                        type: appDepTree.type,
                        dependencies: appDepTree.dependencies,
                        targetFile: scanResult.identity.targetFile,
                        testedFiles: testedFiles
                    });
                    _c.label = 3;
                case 3:
                    _i++;
                    return [3 /*break*/, 1];
                case 4: return [2 /*return*/, dependencyTrees];
            }
        });
    });
}
exports.getApplicationDependencyTrees = getApplicationDependencyTrees;
