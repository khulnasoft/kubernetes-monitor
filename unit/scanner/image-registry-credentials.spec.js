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
var credentials = require("../../../src/scanner/images/credentials");
describe('ECR image parsing tests', function () {
    test.concurrent('ecrRegionFromFullImageName()', function () { return __awaiter(void 0, void 0, void 0, function () {
        var imageFullNameTemplate, ecrRegionTemplate, imageFullName, ecrRegion;
        return __generator(this, function (_a) {
            imageFullNameTemplate = 'aws_account_id.dkr.ecr.region.amazonaws.com/my-web-app:latest';
            ecrRegionTemplate = credentials.ecrRegionFromFullImageName(imageFullNameTemplate);
            expect(ecrRegionTemplate).toEqual('region');
            imageFullName = '291964488713.dkr.ecr.us-east-2.amazonaws.com/khulnasoft/debian:10';
            ecrRegion = credentials.ecrRegionFromFullImageName(imageFullName);
            expect(ecrRegion).toEqual('us-east-2');
            expect(function () {
                credentials.ecrRegionFromFullImageName('');
            }).toThrow();
            expect(function () {
                credentials.ecrRegionFromFullImageName('dkr.ecr.region.amazonaws.com/my-web-app:latest');
            }).toThrow();
            expect(function () {
                credentials.ecrRegionFromFullImageName('aws_account_id.dkr.ecr.amazonaws.com/my-web-app:latest');
            }).toThrow();
            expect(function () {
                credentials.ecrRegionFromFullImageName('aws_account_id.dkr.ecr.region.amazonaws.com');
            }).toThrow();
            return [2 /*return*/];
        });
    }); });
    test.concurrent('isEcrSource()', function () { return __awaiter(void 0, void 0, void 0, function () {
        var sourceCredentialsForRandomImageName, sourceCredentialsForInvalidEcrImage, sourceCredentialsForEcrImage, sourceCredentialsForEcrImageWithRepo, sourceCredentialsForEcrImageMixedCase;
        return __generator(this, function (_a) {
            sourceCredentialsForRandomImageName = credentials.isEcrSource('derka');
            expect(sourceCredentialsForRandomImageName).toEqual(false);
            sourceCredentialsForInvalidEcrImage = credentials.isEcrSource('derka.ecr.derka');
            expect(sourceCredentialsForInvalidEcrImage).toEqual(false);
            sourceCredentialsForEcrImage = credentials.isEcrSource('aws_account_id.dkr.ecr.region.amazonaws.com/my-web-app:latest');
            expect(sourceCredentialsForEcrImage).toEqual(true);
            sourceCredentialsForEcrImageWithRepo = credentials.isEcrSource('a291964488713.dkr.ecr.us-east-2.amazonaws.com/khulnasoft/debian:10');
            expect(sourceCredentialsForEcrImageWithRepo).toEqual(true);
            sourceCredentialsForEcrImageMixedCase = credentials.isEcrSource('aws_account_id.dKr.ecR.region.amazonAWS.cOm/my-web-app:latest');
            expect(sourceCredentialsForEcrImageMixedCase).toEqual(true);
            return [2 /*return*/];
        });
    }); });
});
