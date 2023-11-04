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
exports.__esModule = true;
exports.exec = void 0;
var child_process_promise_1 = require("child-process-promise");
var logger_1 = require("./logger");
var config_1 = require("./config");
function exec(bin, env) {
    var processArgs = [];
    for (var _i = 2; _i < arguments.length; _i++) {
        processArgs[_i - 2] = arguments[_i];
    }
    if (process.env.DEBUG === 'true') {
        processArgs.push({ body: '--debug', sanitise: false });
    }
    // Ensure we're not passing the whole environment to the shelled out process...
    // For example, that process doesn't need to know secrets like our integrationId!
    var combinedEnv = __assign(__assign({}, env), { PATH: process.env.PATH, HOME: process.env.HOME, HTTPS_PROXY: config_1.config.HTTPS_PROXY, HTTP_PROXY: config_1.config.HTTP_PROXY, NO_PROXY: config_1.config.NO_PROXY });
    var allArguments = processArgs.map(function (arg) { return arg.body; });
    return (0, child_process_promise_1.spawn)(bin, allArguments, {
        env: combinedEnv,
        capture: ['stdout', 'stderr']
    })["catch"](function (error) {
        var message = (error === null || error === void 0 ? void 0 : error.stderr) || (error === null || error === void 0 ? void 0 : error.stdout) || (error === null || error === void 0 ? void 0 : error.message) || 'Unknown reason';
        var loggableArguments = processArgs
            .filter(function (arg) { return !arg.sanitise; })
            .map(function (arg) { return arg.body; });
        logger_1.logger.warn({ message: message, bin: bin, loggableArguments: loggableArguments }, 'child process failure');
        throw error;
    });
}
exports.exec = exec;
