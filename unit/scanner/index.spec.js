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
var scanner = require("../../../src/scanner");
describe('scanner module tests', function () {
    test.concurrent('getUniqueImages()', function () { return __awaiter(void 0, void 0, void 0, function () {
        var workload, result, resultWithDigest, resultWithoutDigest;
        return __generator(this, function (_a) {
            workload = [
                // 1.DCR
                {
                    imageName: 'redis:latest',
                    imageId: 'docker.io/library/redis@sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6'
                },
                // 2.Duplicate to verify uniqueness
                {
                    imageName: 'redis:latest',
                    imageId: 'docker.io/library/redis@sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6'
                },
                // 3. With SHA instead of tag
                {
                    imageName: 'redis@sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6',
                    imageId: 'docker.io/library/redis@sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6'
                },
                // 4. With SHA missing in imageId
                {
                    imageName: 'redis:prod',
                    imageId: 'docker.io/library/redis:eaa6f054e4a140bc3a1696cc7b1e84529e7e9567'
                },
                // 5. GCR
                {
                    imageName: 'gcr.io/test-dummy/redis:latest',
                    imageId: 'sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6'
                },
                // 6. ECR
                {
                    imageName: '291964488713.dkr.ecr.us-east-2.amazonaws.com/khulnasoft/redis:latest',
                    imageId: 'sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6'
                },
                // 7. With docker-pullable as protocol in imageId
                {
                    imageName: 'redis:some-tag',
                    imageId: 'docker-pullable://name@sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6'
                },
                // 8. With docker as protocol in imageId
                {
                    imageName: 'redis:another-tag',
                    imageId: 'docker://name@sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6'
                },
            ];
            result = scanner.getUniqueImages(workload);
            expect(result).toHaveLength(7);
            resultWithDigest = result.filter(function (_a) {
                var imageWithDigest = _a.imageWithDigest;
                return imageWithDigest;
            });
            expect(resultWithDigest).toHaveLength(6);
            resultWithoutDigest = result.filter(function (_a) {
                var imageWithDigest = _a.imageWithDigest;
                return !imageWithDigest;
            });
            expect(resultWithoutDigest).toHaveLength(1);
            resultWithDigest.map(function (metaData) {
                var _a;
                expect(metaData.imageWithDigest).toMatch('redis');
                expect(metaData.imageWithDigest).toMatch('sha256:8e9f8546050da8aae393a41d65ad37166b4f0d8131d627a520c0f0451742e9d6');
                if ((_a = metaData.imageWithDigest) === null || _a === void 0 ? void 0 : _a.includes('gcr')) {
                    expect(metaData.imageWithDigest).toMatch('/');
                }
                if (metaData.imageWithDigest.includes('ecr')) {
                    expect(metaData.imageWithDigest).toMatch('/');
                }
            });
            resultWithoutDigest.map(function (metadata) {
                expect(metadata.imageName).toMatch('redis');
                expect(metadata.imageWithDigest).toBeUndefined();
            });
            return [2 /*return*/];
        });
    }); });
});
