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
var fs = require("fs");
var YAML = require("yaml");
var metadataExtractor = require("../../../src/supervisor/metadata-extractor");
describe('metadata extractor tests', function () {
    test.concurrent('isPodAssociatedWithParent', function () { return __awaiter(void 0, void 0, void 0, function () {
        var mockPodWithoutMetadata, mockPodWithEmptyMetadata, isPodWithEmptyMetadataAssociatedWithParent, mockPodWithEmptyOwnerReferences, isPodWithEmptyOwnerReferenceAssociatedWithParent, mockPodWithOwnerReferencesWithoutKind, isPodWithOwnerReferencesWithoutKindAssociatedWithParent, mockPodWithOwnerReferencesWithEmptyKInd, isPodWithOwnerReferencesWithEmptyKindAssociatedWithParent, mockPodWithOwnerReferencesWithKind, isPodWithOwnerReferencesWithKindAssociatedWithParent, mockPodWithMixedOwnerReferences, isPodWithMixedOwnerReferencesAssociatedWithParent;
        return __generator(this, function (_a) {
            mockPodWithoutMetadata = {};
            expect(metadataExtractor.isPodAssociatedWithParent(mockPodWithoutMetadata)).toEqual(false);
            mockPodWithEmptyMetadata = { metadata: {} };
            isPodWithEmptyMetadataAssociatedWithParent = metadataExtractor.isPodAssociatedWithParent(mockPodWithEmptyMetadata);
            expect(isPodWithEmptyMetadataAssociatedWithParent).toEqual(false);
            mockPodWithEmptyOwnerReferences = {
                metadata: { ownerReferences: [] }
            };
            isPodWithEmptyOwnerReferenceAssociatedWithParent = metadataExtractor.isPodAssociatedWithParent(mockPodWithEmptyOwnerReferences);
            expect(isPodWithEmptyOwnerReferenceAssociatedWithParent).toEqual(false);
            mockPodWithOwnerReferencesWithoutKind = {
                metadata: {
                    ownerReferences: [{}]
                }
            };
            isPodWithOwnerReferencesWithoutKindAssociatedWithParent = metadataExtractor.isPodAssociatedWithParent(mockPodWithOwnerReferencesWithoutKind);
            expect(isPodWithOwnerReferencesWithoutKindAssociatedWithParent).toEqual(false);
            mockPodWithOwnerReferencesWithEmptyKInd = {
                metadata: {
                    ownerReferences: [
                        { kind: '' },
                    ]
                }
            };
            isPodWithOwnerReferencesWithEmptyKindAssociatedWithParent = metadataExtractor.isPodAssociatedWithParent(mockPodWithOwnerReferencesWithEmptyKInd);
            expect(isPodWithOwnerReferencesWithEmptyKindAssociatedWithParent).toEqual(false);
            mockPodWithOwnerReferencesWithKind = {
                metadata: {
                    ownerReferences: [
                        { kind: 'BUTTER' },
                    ]
                }
            };
            isPodWithOwnerReferencesWithKindAssociatedWithParent = metadataExtractor.isPodAssociatedWithParent(mockPodWithOwnerReferencesWithKind);
            expect(isPodWithOwnerReferencesWithKindAssociatedWithParent).toEqual(true);
            mockPodWithMixedOwnerReferences = {
                metadata: {
                    ownerReferences: [
                        {},
                        { kind: '' },
                        { kind: 'BUTTER' },
                    ]
                }
            };
            isPodWithMixedOwnerReferencesAssociatedWithParent = metadataExtractor.isPodAssociatedWithParent(mockPodWithMixedOwnerReferences);
            expect(isPodWithMixedOwnerReferencesAssociatedWithParent).toEqual(true);
            return [2 /*return*/];
        });
    }); });
    test.concurrent('buildImageMetadata', function () { return __awaiter(void 0, void 0, void 0, function () {
        var deploymentFixture, deploymentObject, podFixture, podObject, deploymentWeirdWrapper, imageMetadataResult, container;
        return __generator(this, function (_a) {
            deploymentFixture = fs.readFileSync('./test/fixtures/sidecar-containers/deployment.yaml', 'utf8');
            deploymentObject = YAML.parse(deploymentFixture);
            podFixture = fs.readFileSync('./test/fixtures/sidecar-containers/pod.yaml', 'utf8');
            podObject = YAML.parse(podFixture);
            deploymentWeirdWrapper = {
                kind: 'Deployment',
                objectMeta: deploymentObject.metadata,
                specMeta: deploymentObject.spec.template.metadata,
                ownerRefs: deploymentObject.metadata.ownerReferences,
                podSpec: deploymentObject.spec.template.spec
            };
            imageMetadataResult = metadataExtractor.buildImageMetadata(deploymentWeirdWrapper, podObject.status.containerStatuses);
            expect(Array.isArray(imageMetadataResult)).toEqual(true);
            expect(imageMetadataResult).toHaveLength(1);
            expect(imageMetadataResult[0]).toEqual(expect.objectContaining({
                type: 'Deployment',
                imageId: 'docker-pullable://eu.gcr.io/cookie/hello-world@sha256:1ac413b2756364b7b856c64d557fdedb97a4ba44ca16fc656e08881650848fe2',
                imageName: 'eu.gcr.io/cookie/hello-world:1.20191125.132107-4664980'
            }));
            container = imageMetadataResult[0].podSpec.containers[0];
            expect(container.args).toBeUndefined();
            expect(container.command).toBeUndefined();
            expect(container.env).toBeUndefined();
            return [2 /*return*/];
        });
    }); });
    test.concurrent('buildImageMetadata from pod spec for unsupported workload', function () { return __awaiter(void 0, void 0, void 0, function () {
        var podFixture, podObject, workloadResult, container;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    podFixture = fs.readFileSync('./test/fixtures/sidecar-containers/node-pod.yaml', 'utf8');
                    podObject = YAML.parse(podFixture);
                    return [4 /*yield*/, metadataExtractor.buildMetadataForWorkload(podObject)];
                case 1:
                    workloadResult = _a.sent();
                    expect(Array.isArray(workloadResult)).toEqual(true);
                    expect(workloadResult).toHaveLength(2);
                    expect(workloadResult[0]).toEqual(expect.objectContaining({
                        type: 'Pod',
                        imageId: 'docker-pullable://eu.gcr.io/cookie/hello-world@sha256:1ac413b2756364b7b856c64d557fdedb97a4ba44ca16fc656e08881650848fe2',
                        imageName: 'eu.gcr.io/cookie/hello-world:1.20191125.132107-4664980'
                    }));
                    container = workloadResult[0].podSpec.containers[0];
                    expect(container.args).toBeUndefined();
                    expect(container.command).toBeUndefined();
                    expect(container.env).toBeUndefined();
                    return [2 /*return*/];
            }
        });
    }); });
});
