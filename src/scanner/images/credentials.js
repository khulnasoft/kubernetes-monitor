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
exports.ecrRegionFromFullImageName = exports.isEcrSource = exports.getSourceCredentials = void 0;
var buffer_1 = require("buffer");
var aws = require("aws-sdk");
var logger_1 = require("../../common/logger");
function getSourceCredentials(imageSource) {
    return __awaiter(this, void 0, void 0, function () {
        var ecrRegion;
        return __generator(this, function (_a) {
            if (isEcrSource(imageSource)) {
                ecrRegion = ecrRegionFromFullImageName(imageSource);
                return [2 /*return*/, getEcrCredentials(ecrRegion)];
            }
            return [2 /*return*/, undefined];
        });
    });
}
exports.getSourceCredentials = getSourceCredentials;
function isEcrSource(imageSource) {
    // this regex tests the image source against the template:
    // <SOMETHING>.dkr.ecr.<SOMETHING>.amazonaws.com/<SOMETHING>
    var ecrImageRegex = new RegExp('.dkr.ecr..*.amazonaws.com/', 'i');
    return ecrImageRegex.test(imageSource);
}
exports.isEcrSource = isEcrSource;
function getEcrCredentials(region) {
    var _this = this;
    return new Promise(function (resolve, reject) { return __awaiter(_this, void 0, void 0, function () {
        var ecr;
        return __generator(this, function (_a) {
            ecr = new aws.ECR({ region: region });
            return [2 /*return*/, ecr.getAuthorizationToken({}, function (err, data) {
                    if (err) {
                        return reject(err);
                    }
                    if (!(data &&
                        data.authorizationData &&
                        Array.isArray(data.authorizationData) &&
                        data.authorizationData.length > 0)) {
                        return reject('unexpected data format from ecr.getAuthorizationToken');
                    }
                    var authorizationTokenBase64 = data.authorizationData[0].authorizationToken;
                    if (!authorizationTokenBase64) {
                        return reject('empty authorization token from ecr.getAuthorizationToken');
                    }
                    var buff = buffer_1.Buffer.from(authorizationTokenBase64, 'base64');
                    var userColonPassword = buff.toString('utf-8');
                    return resolve(userColonPassword);
                })];
        });
    }); });
}
function ecrRegionFromFullImageName(imageFullName) {
    // should look like this
    // aws_account_id.dkr.ecr.region.amazonaws.com/my-web-app:latest
    // https://docs.aws.amazon.com/AmazonECR/latest/userguide/ECR_on_EKS.html
    try {
        var _a = imageFullName.split('/'), registry = _a[0], repository = _a[1];
        if (!repository) {
            throw new Error('ECR image full name missing repository');
        }
        var parts = registry.split('.');
        if (!(parts.length === 6 &&
            parts[1] === 'dkr' &&
            parts[2] === 'ecr' &&
            parts[4] === 'amazonaws')) {
            throw new Error('ECR image full name in unexpected format');
        }
        return parts[3];
    }
    catch (error) {
        logger_1.logger.error({ error: error, imageFullName: imageFullName }, 'failed extracting ECR region from image full name');
        throw error;
    }
}
exports.ecrRegionFromFullImageName = ecrRegionFromFullImageName;
