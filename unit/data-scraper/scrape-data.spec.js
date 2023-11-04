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
var nock_1 = require("nock");
var config_1 = require("../../../src/common/config");
var data_scraper_1 = require("../../../src/data-scraper");
describe('dataScraper()', function () {
    beforeAll(function () {
        config_1.config.SYSDIG_ENDPOINT = 'https://sysdig';
        config_1.config.SYSDIG_TOKEN = 'token123';
    });
    afterAll(function () {
        delete config_1.config.SYSDIG_ENDPOINT;
        delete config_1.config.SYSDIG_TOKEN;
    });
    it('correctly sends data to kubernetes-upstream', function () { return __awaiter(void 0, void 0, void 0, function () {
        var bodyWithToken, bodyNoToken, expectedHeader;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    bodyWithToken = {
                        data: [
                            {
                                imageID: 'something',
                                namespace: 'sysdig',
                                workloadName: 'workload',
                                workloadKind: 'Deployment',
                                container: 'box',
                                packages: []
                            },
                        ],
                        page: {
                            returned: 10,
                            next: 'xxx'
                        }
                    };
                    bodyNoToken = {
                        data: [
                            {
                                imageID: 'something',
                                namespace: 'sysdig',
                                workloadName: 'workload',
                                workloadKind: 'Deployment',
                                container: 'box',
                                packages: []
                            },
                        ],
                        page: {
                            returned: 10,
                            next: ''
                        }
                    };
                    expectedHeader = 'Bearer token123';
                    (0, nock_1["default"])('https://sysdig', { reqheaders: { authorization: expectedHeader } })
                        .get('/v1/runtimeimages?limit=10&cursor=')
                        .times(1)
                        .reply(200, bodyWithToken);
                    (0, nock_1["default"])('https://sysdig', { reqheaders: { authorization: expectedHeader } })
                        .get('/v1/runtimeimages?limit=10&cursor=xxx')
                        .times(1)
                        .reply(200, bodyNoToken);
                    (0, nock_1["default"])('https://api.khulnasoft.com')
                        .post('/v2/kubernetes-upstream/api/v1/runtime-results?version=2023-02-10')
                        .times(1)
                        .reply(200, function (uri, requestBody) {
                        expect(requestBody).toEqual({
                            identity: {
                                type: 'sysdig'
                            },
                            target: {
                                userLocator: expect.any(String),
                                cluster: 'Default cluster',
                                agentId: expect.any(String)
                            },
                            facts: [
                                {
                                    type: 'loadedPackages',
                                    data: bodyWithToken.data
                                },
                            ]
                        });
                    })
                        .post('/v2/kubernetes-upstream/api/v1/runtime-results?version=2023-02-10')
                        .times(1)
                        .reply(200, function (uri, requestBody) {
                        expect(requestBody).toEqual({
                            identity: {
                                type: 'sysdig'
                            },
                            target: {
                                userLocator: expect.any(String),
                                cluster: 'Default cluster',
                                agentId: expect.any(String)
                            },
                            facts: [
                                {
                                    type: 'loadedPackages',
                                    data: bodyNoToken.data
                                },
                            ]
                        });
                    });
                    return [4 /*yield*/, (0, data_scraper_1.scrapeData)()];
                case 1:
                    _a.sent();
                    try {
                        expect(nock_1["default"].isDone()).toBeTruthy();
                    }
                    catch (err) {
                        console.error("nock pending mocks: ".concat(nock_1["default"].pendingMocks()));
                        throw err;
                    }
                    return [2 /*return*/];
            }
        });
    }); });
});
