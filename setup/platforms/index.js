"use strict";
exports.__esModule = true;
exports.getKubernetesVersionForPlatform = void 0;
var kind = require("./kind");
var kindOlm = require("./kind-olm");
var eks = require("./eks");
var aks = require("./aks");
var openshift4 = require("./openshift4");
var kindSetup = {
    create: kind.createCluster,
    loadImage: kind.loadImageInCluster,
    "delete": kind.deleteCluster,
    config: kind.exportKubeConfig,
    clean: kind.clean,
    setupTester: kind.setupTester,
    validateRequiredEnvironment: kind.validateRequiredEnvironment
};
var kindOlmSetup = {
    create: kindOlm.createCluster,
    loadImage: kind.loadImageInCluster,
    "delete": kind.deleteCluster,
    config: kind.exportKubeConfig,
    clean: kind.clean,
    setupTester: kind.setupTester,
    validateRequiredEnvironment: kindOlm.validateRequiredEnvironment
};
var eksSetup = {
    create: eks.createCluster,
    loadImage: eks.loadImageInCluster,
    "delete": eks.deleteCluster,
    config: eks.exportKubeConfig,
    clean: eks.clean,
    setupTester: eks.setupTester,
    validateRequiredEnvironment: eks.validateRequiredEnvironment
};
var aksSetup = {
    create: aks.createCluster,
    loadImage: aks.loadImageInCluster,
    "delete": aks.deleteCluster,
    config: aks.exportKubeConfig,
    clean: aks.clean,
    setupTester: aks.setupTester,
    validateRequiredEnvironment: aks.validateRequiredEnvironment
};
var openshift4Setup = {
    create: openshift4.createCluster,
    loadImage: openshift4.returnUnchangedImageNameAndTag,
    "delete": openshift4.deleteCluster,
    config: openshift4.exportKubeConfig,
    clean: openshift4.clean,
    setupTester: openshift4.setupTester,
    validateRequiredEnvironment: openshift4.validateRequiredEnvironment
};
function getKubernetesVersionForPlatform(testPlatform) {
    switch (testPlatform) {
        default:
            return 'latest';
    }
}
exports.getKubernetesVersionForPlatform = getKubernetesVersionForPlatform;
exports["default"] = {
    kind: kindSetup,
    kindolm: kindOlmSetup,
    eks: eksSetup,
    aks: aksSetup,
    openshift4: openshift4Setup
};
