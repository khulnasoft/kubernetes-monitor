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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
exports.__esModule = true;
exports.getCertificatesParameters = exports.getCredentialParameters = exports.pull = exports.getDestinationForImage = void 0;
var fs = require("fs");
var sleep_promise_1 = require("sleep-promise");
var logger_1 = require("../../common/logger");
var config_1 = require("../../common/config");
var processWrapper = require("../../common/process");
var credentials = require("./credentials");
var types_1 = require("./types");
function getUniqueIdentifier() {
    var _a = process.hrtime(), seconds = _a[0], nanoseconds = _a[1];
    return "".concat(seconds, "_").concat(nanoseconds);
}
function getDestinationForImage(image) {
    var normalisedImageName = image.replace(/\W/g, '_');
    // If two workloads contain the same image and if the khulnasoft-monitor attempts to pull the two images at the same time,
    // this can result in a problem where both actions try to work with the same file resulting in a nasty crash.
    // This is why we try to make the name of the temporary file unique for every workload analysis.
    var uniqueIdentifier = getUniqueIdentifier();
    return "".concat(config_1.config.IMAGE_STORAGE_ROOT, "/").concat(normalisedImageName, "_").concat(uniqueIdentifier, ".tar");
}
exports.getDestinationForImage = getDestinationForImage;
function prefixRespository(target, type) {
    switch (type) {
        case types_1.SkopeoRepositoryType.ImageRegistry:
            return "".concat(type, "://").concat(target);
        case types_1.SkopeoRepositoryType.DockerArchive:
            return "".concat(type, ":").concat(target);
        default:
            throw new Error("Unhandled Skopeo repository type ".concat(type));
    }
}
function pull(image, destination, skopeoRepoType, workloadName) {
    return __awaiter(this, void 0, void 0, function () {
        var creds, credentialsParameters, certificatesParameters, args;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, credentials.getSourceCredentials(image)];
                case 1:
                    creds = _a.sent();
                    credentialsParameters = getCredentialParameters(creds);
                    certificatesParameters = getCertificatesParameters();
                    args = [];
                    args.push({ body: 'copy', sanitise: false });
                    args.push({ body: '--dest-compress-level', sanitise: false });
                    args.push({ body: "".concat(config_1.config.SKOPEO_COMPRESSION_LEVEL), sanitise: false });
                    args.push.apply(args, credentialsParameters);
                    args.push.apply(args, certificatesParameters);
                    args.push({
                        body: prefixRespository(image, types_1.SkopeoRepositoryType.ImageRegistry),
                        sanitise: false
                    });
                    args.push({
                        body: prefixRespository(destination, skopeoRepoType),
                        sanitise: false
                    });
                    return [4 /*yield*/, pullWithRetry(args, destination, workloadName)];
                case 2:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
exports.pull = pull;
function pullWithRetry(args, destination, workloadName) {
    return __awaiter(this, void 0, void 0, function () {
        var MAX_ATTEMPTS, RETRY_INTERVAL_SEC, attempt, env, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    MAX_ATTEMPTS = 10;
                    RETRY_INTERVAL_SEC = 0.2;
                    attempt = 1;
                    _a.label = 1;
                case 1:
                    if (!(attempt <= MAX_ATTEMPTS)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    env = {
                        // The Azure CR credentials helper requires these env vars:
                        AZURE_CLIENT_ID: process.env.AZURE_CLIENT_ID,
                        AZURE_TENANT_ID: process.env.AZURE_TENANT_ID,
                        AZURE_FEDERATED_TOKEN_FILE: process.env.AZURE_FEDERATED_TOKEN_FILE,
                        AZURE_FEDERATED_TOKEN: process.env.AZURE_FEDERATED_TOKEN,
                        AZURE_AUTHORITY_HOST: process.env.AZURE_AUTHORITY_HOST
                    };
                    return [4 /*yield*/, processWrapper.exec.apply(processWrapper, __spreadArray(['skopeo', env], args, false))];
                case 3:
                    _a.sent();
                    return [2 /*return*/];
                case 4:
                    err_1 = _a.sent();
                    try {
                        if (fs.existsSync(destination)) {
                            fs.unlinkSync(destination);
                        }
                    }
                    catch (deleteErr) {
                        logger_1.logger.warn({ workloadName: workloadName, error: deleteErr, destination: destination }, 'could not clean up the Skopeo-copy archive');
                    }
                    if (attempt + 1 > MAX_ATTEMPTS) {
                        throw err_1;
                    }
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(RETRY_INTERVAL_SEC * 1000)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
function getCredentialParameters(credentials) {
    var credentialsParameters = [];
    if (credentials) {
        credentialsParameters.push({ body: '--src-creds', sanitise: true });
        credentialsParameters.push({ body: credentials, sanitise: true });
    }
    return credentialsParameters;
}
exports.getCredentialParameters = getCredentialParameters;
function getCertificatesParameters() {
    var certificatesParameters = [];
    certificatesParameters.push({ body: '--src-cert-dir', sanitise: true });
    certificatesParameters.push({ body: '/srv/app/certs', sanitise: true });
    return certificatesParameters;
}
exports.getCertificatesParameters = getCertificatesParameters;
