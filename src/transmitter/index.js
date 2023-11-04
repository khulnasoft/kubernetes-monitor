"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
exports.__esModule = true;
exports.sendRuntimeData = exports.sendClusterMetadata = exports.retryRequest = exports.deleteWorkload = exports.sendWorkloadEventsPolicy = exports.sendWorkloadMetadata = exports.sendScanResults = exports.sendDepGraph = void 0;
var fastq = require("fastq");
var needle_1 = require("needle");
var sleep_promise_1 = require("sleep-promise");
var http_1 = require("http");
var https_1 = require("https");
var logger_1 = require("../common/logger");
var config_1 = require("../common/config");
var proxy_1 = require("./proxy");
var path_1 = require("path");
var upstreamUrl = config_1.config.INTEGRATION_API || config_1.config.DEFAULT_KUBERNETES_UPSTREAM_URL;
var upstreamRequestVersion = '2023-02-10';
var httpAgent = new http_1.Agent({
    keepAlive: config_1.config.USE_KEEPALIVE
});
var httpsAgent = new https_1.Agent({
    keepAlive: config_1.config.USE_KEEPALIVE
});
function getAgent(u) {
    var url = new URL(u);
    return url.protocol === 'https:' ? httpsAgent : httpAgent;
}
// Async queue wraps around the call to retryRequest in order to limit
// the number of requests in flight to kubernetes upstream at any one time.
var reqQueue = fastq.promise(function (req) {
    return __awaiter(this, void 0, void 0, function () {
        var payload;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    payload = req.payload ? req.payload : null;
                    return [4 /*yield*/, retryRequest(req.method, req.url, payload, req.options)];
                case 1: return [2 /*return*/, _a.sent()];
            }
        });
    });
}, config_1.config.REQUEST_QUEUE_LENGTH);
var upstreamRequestOptions = {
    headers: {
        Authorization: "token ".concat(config_1.config.SERVICE_ACCOUNT_API_TOKEN)
    }
};
function constructUpstreamRequestUrl(requestPath, queryParams) {
    var requestUrl = new URL(upstreamUrl);
    requestUrl.pathname = path_1["default"].join(requestUrl.pathname, requestPath);
    requestUrl.searchParams.set('version', upstreamRequestVersion);
    for (var key in queryParams) {
        requestUrl.searchParams.set(key, queryParams[key]);
    }
    return requestUrl.toString();
}
function sendDepGraph() {
    var payloads = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        payloads[_i] = arguments[_i];
    }
    return __awaiter(this, void 0, void 0, function () {
        var _a, payloads_1, payload, dependencyGraph, payloadWithoutDepGraph, request, _b, response, attempt, error_1;
        return __generator(this, function (_c) {
            switch (_c.label) {
                case 0:
                    _a = 0, payloads_1 = payloads;
                    _c.label = 1;
                case 1:
                    if (!(_a < payloads_1.length)) return [3 /*break*/, 6];
                    payload = payloads_1[_a];
                    dependencyGraph = payload.dependencyGraph, payloadWithoutDepGraph = __rest(payload, ["dependencyGraph"]);
                    _c.label = 2;
                case 2:
                    _c.trys.push([2, 4, , 5]);
                    request = {
                        method: 'post',
                        url: constructUpstreamRequestUrl('/api/v1/dependency-graph'),
                        payload: payload,
                        options: upstreamRequestOptions
                    };
                    return [4 /*yield*/, reqQueue.push(request)];
                case 3:
                    _b = _c.sent(), response = _b.response, attempt = _b.attempt;
                    if (!isSuccessStatusCode(response.statusCode)) {
                        throw new Error("".concat(response.statusCode, " ").concat(response.statusMessage));
                    }
                    else {
                        logger_1.logger.info({ payload: payloadWithoutDepGraph, attempt: attempt }, 'dependency graph sent upstream successfully');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_1 = _c.sent();
                    logger_1.logger.error({ error: error_1, payload: payloadWithoutDepGraph }, 'could not send the dependency scan result upstream');
                    return [3 /*break*/, 5];
                case 5:
                    _a++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/];
            }
        });
    });
}
exports.sendDepGraph = sendDepGraph;
function sendScanResults(payloads) {
    return __awaiter(this, void 0, void 0, function () {
        var _i, payloads_2, payload, payloadWithoutScanResults, request, _a, response, attempt, error_2;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _i = 0, payloads_2 = payloads;
                    _b.label = 1;
                case 1:
                    if (!(_i < payloads_2.length)) return [3 /*break*/, 6];
                    payload = payloads_2[_i];
                    payloadWithoutScanResults = __assign(__assign({}, payload), { scanResults: undefined });
                    _b.label = 2;
                case 2:
                    _b.trys.push([2, 4, , 5]);
                    request = {
                        method: 'post',
                        url: constructUpstreamRequestUrl('/api/v1/scan-results'),
                        payload: payload,
                        options: upstreamRequestOptions
                    };
                    return [4 /*yield*/, reqQueue.push(request)];
                case 3:
                    _a = _b.sent(), response = _a.response, attempt = _a.attempt;
                    if (!isSuccessStatusCode(response.statusCode)) {
                        throw new Error("".concat(response.statusCode, " ").concat(response.statusMessage));
                    }
                    else {
                        logger_1.logger.info({ payload: payloadWithoutScanResults, attempt: attempt }, 'scan results sent upstream successfully');
                    }
                    return [3 /*break*/, 5];
                case 4:
                    error_2 = _b.sent();
                    logger_1.logger.error({ error: error_2, payload: payloadWithoutScanResults }, 'could not send the scan results upstream');
                    return [2 /*return*/, false];
                case 5:
                    _i++;
                    return [3 /*break*/, 1];
                case 6: return [2 /*return*/, true];
            }
        });
    });
}
exports.sendScanResults = sendScanResults;
function sendWorkloadMetadata(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var request, _a, response, attempt, error_3;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    logger_1.logger.info({ workloadLocator: payload.workloadLocator }, 'attempting to send workload metadata upstream');
                    request = {
                        method: 'post',
                        url: constructUpstreamRequestUrl('/api/v1/workload'),
                        payload: payload,
                        options: upstreamRequestOptions
                    };
                    return [4 /*yield*/, reqQueue.push(request)];
                case 1:
                    _a = _b.sent(), response = _a.response, attempt = _a.attempt;
                    if (!isSuccessStatusCode(response.statusCode)) {
                        throw new Error("".concat(response.statusCode, " ").concat(response.statusMessage));
                    }
                    else {
                        logger_1.logger.info({ workloadLocator: payload.workloadLocator, attempt: attempt }, 'workload metadata sent upstream successfully');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _b.sent();
                    logger_1.logger.error({ error: error_3, workloadLocator: payload.workloadLocator }, 'could not send workload metadata upstream');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.sendWorkloadMetadata = sendWorkloadMetadata;
function sendWorkloadEventsPolicy(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var _a, response, attempt, error_4;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    logger_1.logger.info({
                        userLocator: payload.userLocator,
                        cluster: payload.cluster,
                        agentId: payload.agentId
                    }, 'attempting to send workload auto-import policy');
                    return [4 /*yield*/, retryRequest('post', constructUpstreamRequestUrl('/api/v1/policy'), payload, upstreamRequestOptions)];
                case 1:
                    _a = _b.sent(), response = _a.response, attempt = _a.attempt;
                    if (!isSuccessStatusCode(response.statusCode)) {
                        throw new Error("".concat(response.statusCode, " ").concat(response.statusMessage));
                    }
                    logger_1.logger.info({
                        userLocator: payload.userLocator,
                        cluster: payload.cluster,
                        agentId: payload.agentId,
                        attempt: attempt
                    }, 'workload auto-import policy sent upstream successfully');
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _b.sent();
                    logger_1.logger.error({
                        error: error_4,
                        userLocator: payload.userLocator,
                        cluster: payload.cluster,
                        agentId: payload.agentId
                    }, 'could not send workload auto-import policy');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.sendWorkloadEventsPolicy = sendWorkloadEventsPolicy;
function deleteWorkload(deleteParams) {
    return __awaiter(this, void 0, void 0, function () {
        var workloadLocator, agentId, userLocator, cluster, namespace, type, name_1, queryParams, request, _a, response, attempt, error_5;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    workloadLocator = deleteParams.workloadLocator, agentId = deleteParams.agentId;
                    userLocator = workloadLocator.userLocator, cluster = workloadLocator.cluster, namespace = workloadLocator.namespace, type = workloadLocator.type, name_1 = workloadLocator.name;
                    queryParams = {
                        userLocator: userLocator,
                        cluster: cluster,
                        namespace: namespace,
                        type: type,
                        name: name_1,
                        agentId: agentId
                    };
                    request = {
                        method: 'delete',
                        url: constructUpstreamRequestUrl('api/v1/workload', queryParams),
                        payload: null,
                        options: upstreamRequestOptions
                    };
                    return [4 /*yield*/, reqQueue.push(request)];
                case 1:
                    _a = _b.sent(), response = _a.response, attempt = _a.attempt;
                    // TODO: Remove this check, the upstream no longer returns 404 in such cases
                    if (response.statusCode === 404) {
                        logger_1.logger.info({ deleteParams: deleteParams }, 'attempted to delete a workload the Upstream service could not find');
                        return [2 /*return*/];
                    }
                    if (!isSuccessStatusCode(response.statusCode)) {
                        throw new Error("".concat(response.statusCode, " ").concat(response.statusMessage));
                    }
                    else {
                        logger_1.logger.info({ workloadLocator: workloadLocator, attempt: attempt }, 'workload deleted successfully');
                    }
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _b.sent();
                    logger_1.logger.error({ error: error_5, deleteParams: deleteParams }, 'could not send delete a workload from the upstream');
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
exports.deleteWorkload = deleteWorkload;
function isSuccessStatusCode(statusCode) {
    return statusCode !== undefined && statusCode > 100 && statusCode < 400;
}
function retryRequest(verb, url, payload, reqOptions) {
    if (reqOptions === void 0) { reqOptions = {}; }
    return __awaiter(this, void 0, void 0, function () {
        var retry, options, response, attempt, stillHaveRetries, statusCode, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    retry = {
                        attempts: 3,
                        rateLimitIntervalSeconds: 60,
                        transientIntervalSeconds: 2
                    };
                    options = __assign({ json: true, compressed: true, agent: getAgent(url) }, reqOptions);
                    if (config_1.config.HTTP_PROXY || config_1.config.HTTPS_PROXY) {
                        options.agent = (0, proxy_1.getProxyAgent)(config_1.config, url);
                    }
                    attempt = 1;
                    _a.label = 1;
                case 1:
                    if (!(attempt <= retry.attempts)) return [3 /*break*/, 10];
                    stillHaveRetries = attempt + 1 <= retry.attempts;
                    statusCode = undefined;
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 4, , 5]);
                    return [4 /*yield*/, (0, needle_1["default"])(verb, url, payload, options)];
                case 3:
                    response = _a.sent();
                    statusCode = response.statusCode;
                    if (![429, 502, 503, 504].includes(statusCode || 0) ||
                        !stillHaveRetries) {
                        return [3 /*break*/, 10];
                    }
                    return [3 /*break*/, 5];
                case 4:
                    err_1 = _a.sent();
                    if (!shouldRetryRequest(err_1, stillHaveRetries)) {
                        throw err_1;
                    }
                    return [3 /*break*/, 5];
                case 5:
                    if (!(statusCode === 429)) return [3 /*break*/, 7];
                    return [4 /*yield*/, (0, sleep_promise_1["default"])(retry.rateLimitIntervalSeconds * 1000)];
                case 6:
                    _a.sent();
                    return [3 /*break*/, 9];
                case 7: return [4 /*yield*/, (0, sleep_promise_1["default"])(retry.transientIntervalSeconds * 1000)];
                case 8:
                    _a.sent();
                    _a.label = 9;
                case 9:
                    attempt++;
                    return [3 /*break*/, 1];
                case 10:
                    if (response === undefined) {
                        throw new Error('failed sending a request upstream');
                    }
                    return [2 /*return*/, { response: response, attempt: attempt }];
            }
        });
    });
}
exports.retryRequest = retryRequest;
function shouldRetryRequest(err, stillHaveRetries) {
    var networkErrorMessages = [
        'socket hang up',
        'Client network socket disconnected before secure TLS connection was established',
        'write ECONNRESET', // May happen due to Keep-Alive race condition - https://code-examples.net/en/q/28a8069
    ];
    if (!stillHaveRetries) {
        return false;
    }
    if (err.code === 'ECONNRESET' && networkErrorMessages.includes(err.message)) {
        return true;
    }
    if (err.code === 'EAI_AGAIN') {
        return true;
    }
    return false;
}
function sendClusterMetadata() {
    return __awaiter(this, void 0, void 0, function () {
        var payload, logContext, request, _a, response, attempt, error_6;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    payload = {
                        userLocator: config_1.config.INTEGRATION_ID,
                        cluster: config_1.config.CLUSTER_NAME,
                        agentId: config_1.config.AGENT_ID,
                        version: config_1.config.MONITOR_VERSION,
                        namespace: config_1.config.NAMESPACE
                    };
                    logContext = {
                        userLocator: payload.userLocator,
                        cluster: payload.cluster,
                        agentId: payload.agentId,
                        version: payload.version
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    logger_1.logger.info(logContext, 'attempting to send cluster metadata');
                    request = {
                        method: 'post',
                        url: constructUpstreamRequestUrl('/api/v1/cluster'),
                        payload: payload,
                        options: upstreamRequestOptions
                    };
                    return [4 /*yield*/, reqQueue.push(request)];
                case 2:
                    _a = _b.sent(), response = _a.response, attempt = _a.attempt;
                    if (!isSuccessStatusCode(response.statusCode)) {
                        throw new Error("".concat(response.statusCode, " ").concat(response.statusMessage));
                    }
                    logger_1.logger.info(__assign(__assign({}, logContext), { attempt: attempt }), 'cluster metadata sent upstream successfully');
                    return [3 /*break*/, 4];
                case 3:
                    error_6 = _b.sent();
                    logger_1.logger.error(__assign(__assign({}, logContext), { error: error_6 }), 'could not send cluster metadata');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.sendClusterMetadata = sendClusterMetadata;
function sendRuntimeData(payload) {
    return __awaiter(this, void 0, void 0, function () {
        var logContext, request, _a, response, attempt, error_7;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    logContext = {
                        userLocator: payload.target.userLocator,
                        cluster: payload.target.cluster,
                        agentId: payload.target.agentId,
                        identity: payload.identity
                    };
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    logger_1.logger.info(logContext, 'attempting to send runtime data');
                    request = {
                        method: 'post',
                        url: constructUpstreamRequestUrl('/api/v1/runtime-results'),
                        payload: payload,
                        options: upstreamRequestOptions
                    };
                    return [4 /*yield*/, reqQueue.push(request)];
                case 2:
                    _a = _b.sent(), response = _a.response, attempt = _a.attempt;
                    if (!isSuccessStatusCode(response.statusCode)) {
                        throw new Error("".concat(response.statusCode, " ").concat(response.statusMessage));
                    }
                    logger_1.logger.info(__assign({ attempt: attempt }, logContext), 'runtime data sent upstream successfully');
                    return [3 /*break*/, 4];
                case 3:
                    error_7 = _b.sent();
                    logger_1.logger.error(__assign({ error: error_7 }, logContext), 'could not send runtime data');
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
exports.sendRuntimeData = sendRuntimeData;
