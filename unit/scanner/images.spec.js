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
var types_1 = require("../../../src/scanner/images/types");
var config_1 = require("../../../src/common/config");
var scannerImages = require("../../../src/scanner/images");
describe('getImagesWithFileSystemPath()', function () {
    it('correctly maps an empty array', function () {
        var noImages = [];
        var noImagesResult = scannerImages.getImagesWithFileSystemPath(noImages);
        expect(noImagesResult).toEqual([]);
    });
    it('correctly returns an image without a file system path', function () {
        var image = [
            {
                imageName: 'nginx:latest',
                imageWithDigest: 'nginx@sha256:4949aa7259aa6f827450207db5ad94cabaa9248277c6d736d5e1975d200c7e43',
                skopeoRepoType: types_1.SkopeoRepositoryType.DockerArchive
            },
        ];
        var imageResult = scannerImages.getImagesWithFileSystemPath(image);
        expect(imageResult.length).toEqual(1);
        var resultWithExpectedPath = imageResult[0];
        expect(resultWithExpectedPath.imageName).toEqual('nginx:latest');
        var fileSystemPath = resultWithExpectedPath.fileSystemPath;
        expect(fileSystemPath).toBeTruthy();
        expect(fileSystemPath.endsWith('.tar')).toBeTruthy();
        var expectedPattern = fileSystemPath.indexOf("".concat(config_1.config.IMAGE_STORAGE_ROOT, "/nginx_latest_")) !==
            -1;
        expect(expectedPattern).toBeTruthy();
    });
    it('ensure that two consecutive calls do not return the same file system path', function () {
        var someImage = [
            {
                imageName: 'centos:latest',
                imageWithDigest: 'centos@sha256:fc4a234b91cc4b542bac8a6ad23b2ddcee60ae68fc4dbd4a52efb5f1b0baad71',
                skopeoRepoType: types_1.SkopeoRepositoryType.DockerArchive
            },
        ];
        var firstCallResult = scannerImages.getImagesWithFileSystemPath(someImage)[0];
        var secondCallResult = scannerImages.getImagesWithFileSystemPath(someImage)[0];
        expect(firstCallResult.fileSystemPath !== secondCallResult.fileSystemPath).toBeTruthy();
    });
});
describe('pullImages()', function () {
    it('skips on missing file system path', function () { return __awaiter(void 0, void 0, void 0, function () {
        var badImage, workloadName, result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    badImage = [{ imageName: 'nginx:latest' }];
                    workloadName = 'workload';
                    return [4 /*yield*/, scannerImages.pullImages(badImage, workloadName)];
                case 1:
                    result = _a.sent();
                    expect(result).toEqual([]);
                    return [2 /*return*/];
            }
        });
    }); });
});
describe('getImageParts()', function () {
    it('image digest is returned', function () {
        var imageWithSha = 'nginx@sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2';
        var imageWithShaResult = scannerImages.getImageParts(imageWithSha);
        expect(imageWithShaResult.imageTag).toEqual('');
        expect(imageWithShaResult.imageDigest).toEqual('sha256:45b23dee08af5e43a7fea6c4cf9c25ccf269ee113168c19722f87876677c5cb2');
    });
    it('image tag is returned', function () {
        var imageWithTag = 'nginx:latest';
        var imageWithTagResult = scannerImages.getImageParts(imageWithTag);
        expect(imageWithTagResult.imageTag).toEqual('latest');
    });
    it('image tag is returned when full repo specified', function () {
        var imageWithFullRepository = 'kind-registry:5000/nginx:latest';
        var imageWithFullRepositoryResult = scannerImages.getImageParts(imageWithFullRepository);
        expect(imageWithFullRepositoryResult.imageTag).toEqual('latest');
    });
    it('empty tag returned when no tag is specified', function () {
        var imageWithoutTag = 'nginx';
        var imageWithoutTagResult = scannerImages.getImageParts(imageWithoutTag);
        expect(imageWithoutTagResult.imageTag).toEqual('');
    });
    it('empty tag is returned on malformed image name and tag', function () {
        var imageWithManySeparators = 'nginx@abc:tag@bad:reallybad';
        var imageWithManySeparatorsResult = scannerImages.getImageParts(imageWithManySeparators);
        expect(imageWithManySeparatorsResult.imageTag).toEqual('');
    });
    it('empty tag is returned on malformed image name and tag with full repo', function () {
        var imageWithFullRepoAndManySeparators = 'kind-registry:5000/nginx@abc:tag@bad:reallybad';
        var imageWithFullRepoAndManySeparatorsResult = scannerImages.getImageParts(imageWithFullRepoAndManySeparators);
        expect(imageWithFullRepoAndManySeparatorsResult.imageTag).toEqual('');
    });
    describe('extracted image name tests', function () {
        it('removed image:tag', function () {
            expect(scannerImages.getImageParts('nginx:latest').imageName).toEqual('nginx');
        });
        it('removed image@sha:hex', function () {
            expect(scannerImages.getImageParts('node@sha256:215a9fbef4df2c1ceb7c79481d3cfd94ad8f1f0105bade39f3be907bf386c5e1').imageName).toEqual('node');
        });
        it('removed repository/image:tag', function () {
            expect(scannerImages.getImageParts('kind-registry:5000/python:rc-buster')
                .imageName).toEqual('kind-registry:5000/python');
        });
        it('removed repository/image:tag containing dashes', function () {
            expect(scannerImages.getImageParts('kind-registry:5000/python-27:rc-buster')
                .imageName).toEqual('kind-registry:5000/python-27');
        });
        it('removed repository/image:tag continuing dashes', function () {
            expect(scannerImages.getImageParts('kind-registry:5000/test/python-27:rc-buster').imageName).toEqual('kind-registry:5000/test/python-27');
        });
    });
});
