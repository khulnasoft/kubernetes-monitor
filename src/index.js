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
var fsExtra = require("fs-extra");
var SourceMapSupport = require("source-map-support");
var state_1 = require("./state");
var config_1 = require("./common/config");
var logger_1 = require("./common/logger");
var cluster_1 = require("./supervisor/cluster");
var watchers_1 = require("./supervisor/watchers");
var policy_1 = require("./common/policy");
var transmitter_1 = require("./transmitter");
var agent_1 = require("./supervisor/agent");
var data_scraper_1 = require("./data-scraper");
var healthcheck_1 = require("./healthcheck");
process.on('uncaughtException', function (error) {
    if (state_1.state.shutdownInProgress) {
        return;
    }
    try {
        logger_1.logger.error({ error: error }, 'UNCAUGHT EXCEPTION!');
    }
    catch (ignore) {
        console.log('UNCAUGHT EXCEPTION!', error);
    }
    finally {
        process.exit(1);
    }
});
process.on('unhandledRejection', function (reason, promise) {
    if (state_1.state.shutdownInProgress) {
        return;
    }
    try {
        logger_1.logger.error({ reason: reason, promise: promise }, 'UNHANDLED REJECTION!');
    }
    catch (ignore) {
        console.log('UNHANDLED REJECTION!', reason, promise);
    }
    finally {
        process.exit(1);
    }
});
function cleanUpTempStorage() {
    var IMAGE_STORAGE_ROOT = config_1.config.IMAGE_STORAGE_ROOT;
    try {
        fsExtra.emptyDirSync(IMAGE_STORAGE_ROOT);
        logger_1.logger.info({}, 'Cleaned temp storage');
    }
    catch (err) {
        logger_1.logger.error({ err: err }, 'Error deleting files');
    }
}
function monitor() {
    return __awaiter(this, void 0, void 0, function () {
        var error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    logger_1.logger.info({
                        cluster: cluster_1.currentClusterName,
                        useKeepalive: config_1.config.USE_KEEPALIVE
                    }, 'starting to monitor');
                    return [4 /*yield*/, (0, watchers_1.beginWatchingWorkloads)()];
                case 1:
                    _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    logger_1.logger.error({ error: error_1 }, 'an error occurred while monitoring the cluster');
                    process.exit(1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function setupSysdigIntegration() {
    return __awaiter(this, void 0, void 0, function () {
        var initialInterval, interval;
        var _this = this;
        return __generator(this, function (_a) {
            if (!config_1.config.SYSDIG_ENDPOINT || !config_1.config.SYSDIG_TOKEN) {
                logger_1.logger.info({}, 'Sysdig integration not detected');
                return [2 /*return*/];
            }
            initialInterval = 20 * 60 * 1000;
            setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
                var error_2;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, data_scraper_1.scrapeData)()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_2 = _a.sent();
                            logger_1.logger.error({ error: error_2 }, 'an error occurred while scraping initial runtime data');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, initialInterval).unref();
            interval = 4 * 60 * 60 * 1000;
            setInterval(function () { return __awaiter(_this, void 0, void 0, function () {
                var error_3;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, (0, data_scraper_1.scrapeData)()];
                        case 1:
                            _a.sent();
                            return [3 /*break*/, 3];
                        case 2:
                            error_3 = _a.sent();
                            logger_1.logger.error({ error: error_3 }, 'an error occurred while scraping runtime data');
                            return [3 /*break*/, 3];
                        case 3: return [2 /*return*/];
                    }
                });
            }); }, interval).unref();
            return [2 /*return*/];
        });
    });
}
SourceMapSupport.install();
cleanUpTempStorage();
// Allow running in an async context
setImmediate(function setUpAndMonitor() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, agent_1.setKhulnasoftMonitorAgentId)()];
                case 1:
                    _a.sent();
                    return [4 /*yield*/, (0, transmitter_1.sendClusterMetadata)()];
                case 2:
                    _a.sent();
                    return [4 /*yield*/, (0, policy_1.loadAndSendWorkloadEventsPolicy)()];
                case 3:
                    _a.sent();
                    return [4 /*yield*/, monitor()];
                case 4:
                    _a.sent();
                    return [4 /*yield*/, setupSysdigIntegration()];
                case 5:
                    _a.sent();
                    return [4 /*yield*/, (0, healthcheck_1.setupHealthCheck)()];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
});
