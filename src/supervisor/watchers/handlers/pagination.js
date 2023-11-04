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
exports.paginatedClusterList = exports.paginatedNamespacedList = exports.PAGE_SIZE = void 0;
var sleep_promise_1 = require("sleep-promise");
var kuberenetes_api_wrappers_1 = require("../../kuberenetes-api-wrappers");
var workload_sanitization_1 = require("../../workload-sanitization");
var types_1 = require("../types");
exports.PAGE_SIZE = 100;
/**
 * This function ensures that when listing workloads from the Kubernetes API, they are paginated in batches of 100.
 * The workloads collected are additionally trimmed to contain only the relevant data for vulnerability analysis.
 * The combination of both listing and trimming ensures we reduce our memory footprint and prevent overloading the API server.
 */
function paginatedNamespacedList(namespace, list, listPromise) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var continueToken, pretty, allowWatchBookmarks, fieldSelector, labelSelector, incomingMessage, listCall, trimmedItems, err_1, error, seconds, _c, seconds;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    continueToken = undefined;
                    pretty = undefined;
                    allowWatchBookmarks = undefined;
                    fieldSelector = undefined;
                    labelSelector = undefined;
                    incomingMessage = undefined;
                    _e.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 13];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 12]);
                    return [4 /*yield*/, listPromise(namespace, pretty, allowWatchBookmarks, continueToken, fieldSelector, labelSelector, exports.PAGE_SIZE)];
                case 3:
                    listCall = _e.sent();
                    incomingMessage = listCall.response;
                    list.metadata = listCall.body.metadata;
                    if (Array.isArray(listCall.body.items)) {
                        trimmedItems = (0, workload_sanitization_1.trimWorkloads)(listCall.body.items);
                        (_d = list.items).push.apply(_d, trimmedItems);
                    }
                    continueToken = (_a = listCall.body.metadata) === null || _a === void 0 ? void 0 : _a._continue;
                    if (!continueToken) {
                        return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 12];
                case 4:
                    err_1 = _e.sent();
                    error = err_1;
                    if (!(types_1.RETRYABLE_NETWORK_ERROR_CODES.includes(error.code || '') ||
                        types_1.RETRYABLE_NETWORK_ERROR_MESSAGES.includes(error.message || ''))) return [3 /*break*/, 6];
                    seconds = (0, kuberenetes_api_wrappers_1.calculateSleepSeconds)();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(seconds)];
                case 5:
                    _e.sent();
                    return [3 /*break*/, 1];
                case 6:
                    _c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.statusCode;
                    switch (_c) {
                        case 410: return [3 /*break*/, 7];
                        case 429: return [3 /*break*/, 8];
                        case 502: return [3 /*break*/, 8];
                        case 503: return [3 /*break*/, 8];
                        case 504: return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 7: // Gone
                return [3 /*break*/, 13];
                case 8:
                    seconds = (0, kuberenetes_api_wrappers_1.calculateSleepSeconds)(error.response);
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(seconds)];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 1];
                case 10: throw err_1;
                case 11: return [3 /*break*/, 12];
                case 12: return [3 /*break*/, 1];
                case 13:
                    if (!incomingMessage) {
                        throw new Error('could not list workload');
                    }
                    return [2 /*return*/, {
                            response: incomingMessage,
                            body: list
                        }];
            }
        });
    });
}
exports.paginatedNamespacedList = paginatedNamespacedList;
/**
 * This function ensures that when listing workloads from the Kubernetes API, they are paginated in batches of 100.
 * The workloads collected are additionally trimmed to contain only the relevant data for vulnerability analysis.
 * The combination of both listing and trimming ensures we reduce our memory footprint and prevent overloading the API server.
 */
function paginatedClusterList(list, listPromise) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function () {
        var continueToken, allowWatchBookmarks, fieldSelector, labelSelector, incomingMessage, listCall, trimmedItems, err_2, error, seconds, _c, seconds;
        var _d;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0:
                    continueToken = undefined;
                    allowWatchBookmarks = undefined;
                    fieldSelector = undefined;
                    labelSelector = undefined;
                    incomingMessage = undefined;
                    _e.label = 1;
                case 1:
                    if (!true) return [3 /*break*/, 13];
                    _e.label = 2;
                case 2:
                    _e.trys.push([2, 4, , 12]);
                    return [4 /*yield*/, listPromise(allowWatchBookmarks, continueToken, fieldSelector, labelSelector, exports.PAGE_SIZE)];
                case 3:
                    listCall = _e.sent();
                    incomingMessage = listCall.response;
                    list.metadata = listCall.body.metadata;
                    if (Array.isArray(listCall.body.items)) {
                        trimmedItems = (0, workload_sanitization_1.trimWorkloads)(listCall.body.items);
                        (_d = list.items).push.apply(_d, trimmedItems);
                    }
                    continueToken = (_a = listCall.body.metadata) === null || _a === void 0 ? void 0 : _a._continue;
                    if (!continueToken) {
                        return [3 /*break*/, 13];
                    }
                    return [3 /*break*/, 12];
                case 4:
                    err_2 = _e.sent();
                    error = err_2;
                    if (!(types_1.RETRYABLE_NETWORK_ERROR_CODES.includes(error.code || '') ||
                        types_1.RETRYABLE_NETWORK_ERROR_MESSAGES.includes(error.message || ''))) return [3 /*break*/, 6];
                    seconds = (0, kuberenetes_api_wrappers_1.calculateSleepSeconds)();
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(seconds)];
                case 5:
                    _e.sent();
                    return [3 /*break*/, 1];
                case 6:
                    _c = (_b = error.response) === null || _b === void 0 ? void 0 : _b.statusCode;
                    switch (_c) {
                        case 410: return [3 /*break*/, 7];
                        case 429: return [3 /*break*/, 8];
                        case 502: return [3 /*break*/, 8];
                        case 503: return [3 /*break*/, 8];
                        case 504: return [3 /*break*/, 8];
                    }
                    return [3 /*break*/, 10];
                case 7: // Gone
                return [3 /*break*/, 13];
                case 8:
                    seconds = (0, kuberenetes_api_wrappers_1.calculateSleepSeconds)(error.response);
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(seconds)];
                case 9:
                    _e.sent();
                    return [3 /*break*/, 1];
                case 10: throw err_2;
                case 11: return [3 /*break*/, 12];
                case 12: return [3 /*break*/, 1];
                case 13:
                    if (!incomingMessage) {
                        throw new Error('could not list workload');
                    }
                    return [2 /*return*/, {
                            response: incomingMessage,
                            body: list
                        }];
            }
        });
    });
}
exports.paginatedClusterList = paginatedClusterList;
