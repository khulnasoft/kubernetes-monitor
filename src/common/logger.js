"use strict";
exports.__esModule = true;
exports.logger = void 0;
var bunyan = require("bunyan");
var config_1 = require("./config");
try {
    // Validate if LOG_LEVEL has valid bunyan logging level
    config_1.config.LOGGING.level = bunyan.resolveLevel(process.env.LOG_LEVEL || config_1.config.LOGGING.level);
}
catch (e) {
    console.error("Log level \"".concat(process.env.LOG_LEVEL, "\" is not valid logging level. Falling back to \"INFO\""));
}
var logger = bunyan.createLogger({
    name: config_1.config.LOGGING.name,
    level: config_1.config.LOGGING.level,
    serializers: {
        req: bunyan.stdSerializers.req,
        res: bunyan.stdSerializers.res,
        err: bunyan.stdSerializers.err,
        error: bunyan.stdSerializers.err
    }
});
exports.logger = logger;
if (process.env.NODE_ENV === 'test') {
    logger.level(bunyan.FATAL + 1);
}
