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
var sleep_promise_1 = require("sleep-promise");
var YAML = require("yaml");
// NOTE: Very important that the mock is set up before application code is imported!
var pushCallCount = 0;
jest.mock('async', function () { return ({
    queue: function () { return ({
        error: function () { },
        pushAsync: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, pushCallCount++];
        }); }); }
    }); }
}); });
jest.mock('fastq', function () { return ({
    promise: function () { return ({
        push: function () { return __awaiter(void 0, void 0, void 0, function () { return __generator(this, function (_a) {
            return [2 /*return*/, pushCallCount++];
        }); }); }
    }); }
}); });
var metadataExtractor = require("../../../src/supervisor/metadata-extractor");
var pod = require("../../../src/supervisor/watchers/handlers/pod");
describe('image and workload image cache', function () {
    var podSpecFixture = fs.readFileSync('./test/fixtures/pod-spec.json', 'utf8');
    var podSpec = YAML.parse(podSpecFixture);
    var workloadMetadata = [
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
            podSpec: podSpec
        },
    ];
    var buildMetadataSpy = jest
        .spyOn(metadataExtractor, 'buildMetadataForWorkload')
        .mockResolvedValue(workloadMetadata);
    afterAll(function () {
        asyncQueueSpy.mockRestore();
        buildMetadataSpy.mockRestore();
        jest.restoreAllMocks();
    });
    var podFixture = fs.readFileSync('./test/fixtures/sidecar-containers/pod.yaml', 'utf8');
    var podObject = YAML.parse(podFixture);
    it('pushed data to send', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pod.podWatchHandler(podObject)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(500)];
                case 2:
                    _a.sent();
                    expect(pushCallCount).toEqual(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('cached info, no data pushed to send', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, pod.podWatchHandler(podObject)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(500)];
                case 2:
                    _a.sent();
                    expect(pushCallCount).toEqual(2);
                    return [2 /*return*/];
            }
        });
    }); });
    it('new image parsed, workload is cached', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    workloadMetadata[0].imageId = 'newImageName';
                    return [4 /*yield*/, pod.podWatchHandler(podObject)];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(1000)];
                case 2:
                    _a.sent();
                    expect(pushCallCount).toEqual(3);
                    return [2 /*return*/];
            }
        });
    }); });
});
