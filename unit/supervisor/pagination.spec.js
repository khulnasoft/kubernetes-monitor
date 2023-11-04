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
var sleepMock = jest.fn();
jest.mock('sleep-promise', function () { return sleepMock; });
var pagination_1 = require("../../../src/supervisor/watchers/handlers/pagination");
describe('pagination', function () {
    afterEach(function () {
        sleepMock.mockRestore();
    });
    afterAll(function () {
        jest.resetAllMocks();
    });
    describe.each([
        [
            'paginatedNamespacedList',
            function (namespace, workloads, listFn) {
                return (0, pagination_1.paginatedNamespacedList)(namespace, workloads, listFn);
            },
        ],
        [
            'paginatedClusterList',
            function (_namespace, workloads, listFn) {
                return (0, pagination_1.paginatedClusterList)(workloads, listFn);
            },
        ],
    ])('error handling: %s', function (_testCaseName, listFn) {
        afterEach(function () {
            sleepMock.mockRestore();
        });
        it.each([['ECONNRESET']])('handles network error: %s', function (code) { return __awaiter(void 0, void 0, void 0, function () {
            var sleepError, listError, listMock, pushMock, workloads, namespace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sleepError = new Error('timeout');
                        sleepMock
                            .mockResolvedValueOnce(undefined)
                            .mockRejectedValueOnce(sleepError);
                        listError = { code: code };
                        listMock = jest.fn().mockRejectedValue(listError);
                        pushMock = jest.fn();
                        workloads = { items: [] };
                        workloads.items.push = pushMock;
                        namespace = 'unused';
                        return [4 /*yield*/, listFn(namespace, workloads, listMock)["catch"](function (error) {
                                return expect(error).toEqual(sleepError);
                            })];
                    case 1:
                        _a.sent();
                        expect(listMock).toHaveBeenCalledTimes(2);
                        expect(sleepMock).toHaveBeenCalledTimes(2);
                        expect(pushMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it.each([['EPIPE']])('handles unknown error: %s', function (code) { return __awaiter(void 0, void 0, void 0, function () {
            var listError, listMock, pushMock, workloads, namespace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listError = { code: code };
                        listMock = jest.fn().mockRejectedValue(listError);
                        pushMock = jest.fn();
                        workloads = { items: [] };
                        workloads.items.push = pushMock;
                        namespace = 'unused';
                        return [4 /*yield*/, listFn(namespace, workloads, listMock)["catch"](function (error) {
                                return expect(error).toEqual(listError);
                            })];
                    case 1:
                        _a.sent();
                        expect(listMock).toHaveBeenCalledTimes(1);
                        expect(sleepMock).not.toHaveBeenCalled();
                        expect(pushMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it.each([[429], [502], [503], [504]])('handles http error: %s', function (code) { return __awaiter(void 0, void 0, void 0, function () {
            var sleepError, listError, listMock, pushMock, workloads, namespace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        sleepError = new Error('timeout');
                        sleepMock
                            .mockResolvedValueOnce(undefined)
                            .mockRejectedValueOnce(sleepError);
                        listError = { response: { statusCode: code } };
                        listMock = jest.fn().mockRejectedValue(listError);
                        pushMock = jest.fn();
                        workloads = { items: [] };
                        workloads.items.push = pushMock;
                        namespace = 'unused';
                        return [4 /*yield*/, listFn(namespace, workloads, listMock)["catch"](function (error) {
                                return expect(error).toEqual(sleepError);
                            })];
                    case 1:
                        _a.sent();
                        expect(listMock).toHaveBeenCalledTimes(2);
                        expect(sleepMock).toHaveBeenCalledTimes(2);
                        expect(pushMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it.each([[410]])('handles unrecoverable http error: %s', function (code) { return __awaiter(void 0, void 0, void 0, function () {
            var listError, listMock, pushMock, workloads, namespace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listError = { response: { statusCode: code } };
                        listMock = jest.fn().mockRejectedValue(listError);
                        pushMock = jest.fn();
                        workloads = { items: [] };
                        workloads.items.push = pushMock;
                        namespace = 'unused';
                        return [4 /*yield*/, listFn(namespace, workloads, listMock)["catch"](function (error) {
                                return expect(error).toEqual(new Error('could not list workload'));
                            })];
                    case 1:
                        _a.sent();
                        expect(listMock).toHaveBeenCalledTimes(1);
                        expect(sleepMock).not.toHaveBeenCalled();
                        expect(pushMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it.each([[[429, 502, 503, 504, 410]]])('handles sequence of http errors: %s', function (codes) { return __awaiter(void 0, void 0, void 0, function () {
            var listMock, _i, codes_1, code, listError, pushMock, workloads, namespace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listMock = jest.fn();
                        for (_i = 0, codes_1 = codes; _i < codes_1.length; _i++) {
                            code = codes_1[_i];
                            listError = { response: { statusCode: code } };
                            listMock.mockRejectedValueOnce(listError);
                        }
                        pushMock = jest.fn();
                        workloads = { items: [] };
                        workloads.items.push = pushMock;
                        namespace = 'unused';
                        return [4 /*yield*/, listFn(namespace, workloads, listMock)["catch"](function (error) {
                                return expect(error).toEqual(new Error('could not list workload'));
                            })];
                    case 1:
                        _a.sent();
                        expect(listMock).toHaveBeenCalledTimes(codes.length);
                        expect(sleepMock).toHaveBeenCalledTimes(codes.length - 1);
                        expect(pushMock).not.toHaveBeenCalled();
                        return [2 /*return*/];
                }
            });
        }); });
        it('handles failure after success', function () { return __awaiter(void 0, void 0, void 0, function () {
            var listError, items, listMock, pushMock, workloads, namespace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listError = { response: { statusCode: 410 } };
                        items = [{ metadata: { name: 'pod ' } }];
                        listMock = jest
                            .fn()
                            .mockResolvedValueOnce({
                            response: {},
                            body: {
                                items: items,
                                metadata: {
                                    _continue: 'token'
                                }
                            }
                        })
                            .mockRejectedValueOnce(listError);
                        pushMock = jest.fn();
                        workloads = { items: [] };
                        workloads.items.push = pushMock;
                        namespace = 'unused';
                        return [4 /*yield*/, listFn(namespace, workloads, listMock)["catch"](function (error) {
                                return expect(error).toEqual(new Error('could not list workload'));
                            })];
                    case 1:
                        _a.sent();
                        expect(listMock).toHaveBeenCalledTimes(2);
                        expect(sleepMock).not.toHaveBeenCalled();
                        expect(pushMock).toHaveBeenCalledWith(expect.objectContaining({
                            metadata: { name: 'pod ' }
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
        it('retries after failure', function () { return __awaiter(void 0, void 0, void 0, function () {
            var listError, firstItems, secondItems, listMock, pushMock, workloads, namespace;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        listError = { response: { statusCode: 429 } };
                        firstItems = [{ metadata: { name: 'first ' } }];
                        secondItems = [{ metadata: { name: 'second ' } }];
                        listMock = jest
                            .fn()
                            .mockResolvedValueOnce({
                            response: {},
                            body: {
                                items: firstItems,
                                metadata: {
                                    _continue: 'token'
                                }
                            }
                        })
                            .mockRejectedValueOnce(listError)
                            .mockResolvedValueOnce({
                            response: {},
                            body: {
                                items: secondItems,
                                metadata: {
                                    _continue: undefined
                                }
                            }
                        });
                        pushMock = jest.fn();
                        workloads = { items: [] };
                        workloads.items.push = pushMock;
                        namespace = 'unused';
                        return [4 /*yield*/, listFn(namespace, workloads, listMock)["catch"](function (error) {
                                return expect(error).toEqual(new Error('could not list workload'));
                            })];
                    case 1:
                        _a.sent();
                        expect(listMock).toHaveBeenCalledTimes(3);
                        expect(sleepMock).toHaveBeenCalledTimes(1);
                        expect(pushMock).toHaveBeenNthCalledWith(1, expect.objectContaining({
                            metadata: { name: 'first ' }
                        }));
                        expect(pushMock).toHaveBeenNthCalledWith(2, expect.objectContaining({
                            metadata: { name: 'second ' }
                        }));
                        return [2 /*return*/];
                }
            });
        }); });
    });
});
