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
exports.calculateSleepSeconds = exports.retryKubernetesApiRequestIndefinitely = exports.retryKubernetesApiRequest = exports.MAX_SLEEP_SEC = exports.DEFAULT_SLEEP_SEC = exports.ATTEMPTS_MAX = void 0;
var fastq = require("fastq");
var sleep_promise_1 = require("sleep-promise");
var config_1 = require("../common/config");
var logger_1 = require("../common/logger");
var types_1 = require("./watchers/types");
exports.ATTEMPTS_MAX = 3;
exports.DEFAULT_SLEEP_SEC = 1;
exports.MAX_SLEEP_SEC = 5;
var reqQueue = fastq.promise(function (promise) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, promise()];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}, config_1.config.REQUEST_QUEUE_LENGTH);
function retryKubernetesApiRequest(func) {
    return __awaiter(this, void 0, void 0, function () {
        var attempt, err_1, sleepSeconds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempt = 1;
                    _a.label = 1;
                case 1:
                    if (!(attempt <= exports.ATTEMPTS_MAX)) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, reqQueue.push(func)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    err_1 = _a.sent();
                    if (!shouldRetryRequest(err_1, attempt)) {
                        throw err_1;
                    }
                    sleepSeconds = calculateSleepSeconds(err_1.response);
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(sleepSeconds * 1000)];
                case 5:
                    _a.sent();
                    return [3 /*break*/, 6];
                case 6:
                    attempt++;
                    return [3 /*break*/, 1];
                case 7: throw new Error('Could not receive a response from the Kubernetes API');
            }
        });
    });
}
exports.retryKubernetesApiRequest = retryKubernetesApiRequest;
/**
 * This function retries requests to the Kubernetes API indefinitely. We use this
 * function when starting the Kubernetes Monitor to ensure the agentId is correctly
 * set to the deployment ID.
 *
 * @param func function to retry
 * @param maxSleepDuration maximum sleep duration in seconds (e.g. 300)
 * @returns Promise<ResponseType>
 */
function retryKubernetesApiRequestIndefinitely(func, maxSleepDuration) {
    return __awaiter(this, void 0, void 0, function () {
        var attempts, err_2, backoff, sleepSeconds;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    attempts = 1;
                    _a.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 7];
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 6]);
                    return [4 /*yield*/, reqQueue.push(func)];
                case 3: return [2 /*return*/, _a.sent()];
                case 4:
                    err_2 = _a.sent();
                    if (!shouldRetryRequest(err_2, 1)) {
                        throw err_2;
                    }
                    backoff = Math.pow(2, attempts);
                    sleepSeconds = Math.min(backoff, maxSleepDuration);
                    logger_1.logger.error({ error: err_2, attempts: attempts }, 'connection to kubernetes API failed, retrying');
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(sleepSeconds * 1000)];
                case 5:
                    _a.sent();
                    attempts++;
                    return [3 /*break*/, 6];
                case 6: return [3 /*break*/, 1];
                case 7: return [2 /*return*/];
            }
        });
    });
}
exports.retryKubernetesApiRequestIndefinitely = retryKubernetesApiRequestIndefinitely;
function calculateSleepSeconds(httpResponse) {
    var sleepSeconds = exports.DEFAULT_SLEEP_SEC;
    if (httpResponse &&
        httpResponse.headers &&
        httpResponse.headers['Retry-After']) {
        try {
            sleepSeconds = Number(httpResponse.headers['Retry-After']);
            if (isNaN(sleepSeconds) || sleepSeconds <= 0) {
                sleepSeconds = exports.DEFAULT_SLEEP_SEC;
            }
        }
        catch (err) {
            sleepSeconds = exports.DEFAULT_SLEEP_SEC;
        }
    }
    return Math.min(sleepSeconds, exports.MAX_SLEEP_SEC);
}
exports.calculateSleepSeconds = calculateSleepSeconds;
function shouldRetryRequest(err, attempt) {
    if (attempt >= exports.ATTEMPTS_MAX) {
        return false;
    }
    if (err.code && types_1.RETRYABLE_NETWORK_ERROR_CODES.includes(err.code)) {
        return true;
    }
    if (err.message && types_1.RETRYABLE_NETWORK_ERROR_MESSAGES.includes(err.message)) {
        return true;
    }
    if (!err.response) {
        return false;
    }
    if (err.response.statusCode === 429) {
        return true;
    }
    return false;
}
