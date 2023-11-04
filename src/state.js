"use strict";
exports.__esModule = true;
exports.state = exports.setCachedWorkloadMetadata = exports.getCachedWorkloadMetadata = exports.deleteNamespace = exports.storeNamespace = exports.kubernetesObjectToWorkloadAlreadyScanned = exports.deleteWorkloadImagesAlreadyScanned = exports.setWorkloadImageAlreadyScanned = exports.getWorkloadImageAlreadyScanned = exports.deleteWorkloadAlreadyScanned = exports.setWorkloadAlreadyScanned = exports.getWorkloadAlreadyScanned = void 0;
var lru_cache_1 = require("lru-cache");
var config_1 = require("./common/config");
var logger_1 = require("./common/logger");
var internal_namespaces_1 = require("./supervisor/watchers/internal-namespaces");
var imagesLruCacheOptions = {
    // limit cache size so we don't exceed memory limit
    max: config_1.config.IMAGES_SCANNED_CACHE.MAX_SIZE,
    // limit cache life so if our backend loses track of an image's data,
    // eventually we will report again for that image, if it's still relevant
    maxAge: config_1.config.IMAGES_SCANNED_CACHE.MAX_AGE_MS,
    updateAgeOnGet: false
};
var workloadsLruCacheOptions = {
    // limit cache size so we don't exceed memory limit
    max: config_1.config.WORKLOADS_SCANNED_CACHE.MAX_SIZE,
    // limit cache life so if our backend loses track of an image's data,
    // eventually we will report again for that image, if it's still relevant
    maxAge: config_1.config.WORKLOADS_SCANNED_CACHE.MAX_AGE_MS,
    updateAgeOnGet: false
};
var workloadMetadataLruCacheOptions = {
    max: config_1.config.WORKLOAD_METADATA_CACHE.MAX_SIZE,
    maxAge: config_1.config.WORKLOAD_METADATA_CACHE.MAX_AGE_MS,
    updateAgeOnGet: false
};
function getWorkloadImageAlreadyScannedKey(workload, imageName) {
    return "".concat(workload.uid, "/").concat(imageName);
}
function getWorkloadAlreadyScanned(workload) {
    var key = workload.uid;
    return exports.state.workloadsAlreadyScanned.get(key);
}
exports.getWorkloadAlreadyScanned = getWorkloadAlreadyScanned;
function setWorkloadAlreadyScanned(workload, revision) {
    var key = workload.uid;
    return exports.state.workloadsAlreadyScanned.set(key, revision);
}
exports.setWorkloadAlreadyScanned = setWorkloadAlreadyScanned;
function deleteWorkloadAlreadyScanned(workload) {
    var key = workload.uid;
    exports.state.workloadsAlreadyScanned.del(key);
}
exports.deleteWorkloadAlreadyScanned = deleteWorkloadAlreadyScanned;
function getWorkloadImageAlreadyScanned(workload, imageName, imageId) {
    var _a;
    var key = getWorkloadImageAlreadyScannedKey(workload, imageName);
    var hasImageId = (_a = exports.state.imagesAlreadyScanned.get(key)) === null || _a === void 0 ? void 0 : _a.has(imageId);
    var response = hasImageId ? imageId : undefined;
    if (response !== undefined) {
        logger_1.logger.debug({ 'kubernetes-monitor': { imageId: imageId } }, 'image already exists in cache');
    }
    return response;
}
exports.getWorkloadImageAlreadyScanned = getWorkloadImageAlreadyScanned;
function setWorkloadImageAlreadyScanned(workload, imageName, imageId) {
    var key = getWorkloadImageAlreadyScannedKey(workload, imageName);
    var images = exports.state.imagesAlreadyScanned.get(key);
    if (images !== undefined) {
        images.add(imageId);
    }
    else {
        var set = new Set();
        set.add(imageId);
        exports.state.imagesAlreadyScanned.set(key, set);
    }
    return true;
}
exports.setWorkloadImageAlreadyScanned = setWorkloadImageAlreadyScanned;
function deleteWorkloadImagesAlreadyScanned(workload) {
    for (var _i = 0, _a = workload.imageIds; _i < _a.length; _i++) {
        var imageId = _a[_i];
        var key = getWorkloadImageAlreadyScannedKey(workload, imageId);
        exports.state.imagesAlreadyScanned.del(key);
    }
}
exports.deleteWorkloadImagesAlreadyScanned = deleteWorkloadImagesAlreadyScanned;
function kubernetesObjectToWorkloadAlreadyScanned(workload) {
    if (workload.metadata &&
        workload.metadata.namespace &&
        workload.metadata.uid &&
        workload.kind) {
        return {
            namespace: workload.metadata.namespace,
            type: workload.kind,
            uid: workload.metadata.uid
        };
    }
    return undefined;
}
exports.kubernetesObjectToWorkloadAlreadyScanned = kubernetesObjectToWorkloadAlreadyScanned;
function storeNamespace(namespace) {
    var namespaceName = (0, internal_namespaces_1.extractNamespaceName)(namespace);
    exports.state.watchedNamespaces[namespaceName] = namespace;
}
exports.storeNamespace = storeNamespace;
function deleteNamespace(namespace) {
    var namespaceName = (0, internal_namespaces_1.extractNamespaceName)(namespace);
    delete exports.state.watchedNamespaces[namespaceName];
}
exports.deleteNamespace = deleteNamespace;
function getWorkloadMetadataCacheKey(workloadName, namespace) {
    return "".concat(namespace, "/").concat(workloadName);
}
function getCachedWorkloadMetadata(workloadName, namespace) {
    var key = getWorkloadMetadataCacheKey(workloadName, namespace);
    var cachedMetadata = exports.state.workloadMetadata.get(key);
    return cachedMetadata;
}
exports.getCachedWorkloadMetadata = getCachedWorkloadMetadata;
function setCachedWorkloadMetadata(workloadName, namespace, metadata) {
    var key = getWorkloadMetadataCacheKey(workloadName, namespace);
    exports.state.workloadMetadata.set(key, metadata);
}
exports.setCachedWorkloadMetadata = setCachedWorkloadMetadata;
exports.state = {
    shutdownInProgress: false,
    imagesAlreadyScanned: new lru_cache_1["default"](imagesLruCacheOptions),
    workloadsAlreadyScanned: new lru_cache_1["default"](workloadsLruCacheOptions),
    watchedNamespaces: {},
    workloadMetadata: new lru_cache_1["default"](workloadMetadataLruCacheOptions)
};
