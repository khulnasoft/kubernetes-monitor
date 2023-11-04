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
var http_1 = require("http");
var https_1 = require("https");
var proxy_1 = require("../../src/transmitter/proxy");
describe('transmitter proxy tests', function () {
    test.concurrent('returns correct default agent when no proxy options are set', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect((0, proxy_1.getProxyAgent)({}, 'http://example.endpoint')).toEqual(http_1.globalAgent);
            expect((0, proxy_1.getProxyAgent)({}, 'https://example.endpoint')).toEqual(https_1.globalAgent);
            return [2 /*return*/];
        });
    }); });
    test.concurrent('returns correct default agent on empty PROXY values', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect((0, proxy_1.getProxyAgent)({ HTTP_PROXY: '' }, 'http://example.endpoint')).toEqual(http_1.globalAgent);
            expect((0, proxy_1.getProxyAgent)({ HTTP_PROXY: '' }, 'https://example.endpoint')).toEqual(https_1.globalAgent);
            expect((0, proxy_1.getProxyAgent)({ HTTPS_PROXY: '' }, 'http://example.endpoint')).toEqual(http_1.globalAgent);
            expect((0, proxy_1.getProxyAgent)({ HTTPS_PROXY: '' }, 'https://example.endpoint')).toEqual(https_1.globalAgent);
            return [2 /*return*/];
        });
    }); });
    test.concurrent('returns the default agent when the endpoint is present in NO_PROXY', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect((0, proxy_1.getProxyAgent)({ NO_PROXY: 'example.endpoint' }, 'http://example.endpoint')).toEqual(http_1.globalAgent);
            expect((0, proxy_1.getProxyAgent)({ NO_PROXY: 'example.endpoint' }, 'https://example.endpoint')).toEqual(https_1.globalAgent);
            return [2 /*return*/];
        });
    }); });
    test.concurrent('returns the HTTP_PROXY address for HTTP URLs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var agent;
        return __generator(this, function (_a) {
            agent = (0, proxy_1.getProxyAgent)({
                HTTP_PROXY: 'http://should-return',
                HTTPS_PROXY: 'http://should-not-return'
            }, 'http://example.endpoint');
            expect(agent.options).toEqual({
                proxy: {
                    host: 'should-return',
                    port: 80
                }
            });
            return [2 /*return*/];
        });
    }); });
    test.concurrent('returns the HTTPS_PROXY address for HTTPS URLs', function () { return __awaiter(void 0, void 0, void 0, function () {
        var agent;
        return __generator(this, function (_a) {
            agent = (0, proxy_1.getProxyAgent)({
                HTTP_PROXY: 'http://should-not-return',
                HTTPS_PROXY: 'http://should-return'
            }, 'https://example.endpoint');
            expect(agent.options).toEqual({
                proxy: {
                    host: 'should-return',
                    port: 443
                }
            });
            return [2 /*return*/];
        });
    }); });
    test.concurrent('NO_PROXY takes precedence over HTTP_PROXY or HTTPS_PROXY', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect((0, proxy_1.getProxyAgent)({
                NO_PROXY: 'example.endpoint',
                HTTP_PROXY: 'http://should-not-return',
                HTTPS_PROXY: 'http://should-not-return'
            }, 'http://example.endpoint')).toEqual(http_1.globalAgent);
            expect((0, proxy_1.getProxyAgent)({
                NO_PROXY: 'example.endpoint',
                HTTP_PROXY: 'http://should-not-return',
                HTTPS_PROXY: 'http://should-not-return'
            }, 'https://example.endpoint')).toEqual(https_1.globalAgent);
            return [2 /*return*/];
        });
    }); });
    test.concurrent('CIDR addresses in NO_PROXY are not yet supported', function () { return __awaiter(void 0, void 0, void 0, function () {
        var agent;
        return __generator(this, function (_a) {
            agent = (0, proxy_1.getProxyAgent)({
                NO_PROXY: '192.168.0.0/16',
                HTTP_PROXY: 'http://should-return'
            }, 'http://192.168.1.1');
            expect(agent.options).toEqual({
                proxy: {
                    host: 'should-return',
                    port: 80
                }
            });
            return [2 /*return*/];
        });
    }); });
    test.concurrent('wildcards in NO_PROXY are not yet supported', function () { return __awaiter(void 0, void 0, void 0, function () {
        var agent;
        return __generator(this, function (_a) {
            agent = (0, proxy_1.getProxyAgent)({
                NO_PROXY: '*.example.endpoint',
                HTTP_PROXY: 'http://should-return'
            }, 'http://test.example.endpoint');
            expect(agent.options).toEqual({
                proxy: {
                    host: 'should-return',
                    port: 80
                }
            });
            return [2 /*return*/];
        });
    }); });
    test.concurrent('throws on providing bad URLs for HTTP/S_PROXY', function () { return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
            expect(function () {
                (0, proxy_1.getProxyAgent)({
                    HTTP_PROXY: 'bad-url'
                }, 'http://test.example.endpoint');
            }).toThrow();
            expect(function () {
                (0, proxy_1.getProxyAgent)({
                    HTTPS_PROXY: 'bad-url'
                }, 'https://test.example.endpoint');
            }).toThrow();
            return [2 /*return*/];
        });
    }); });
});
