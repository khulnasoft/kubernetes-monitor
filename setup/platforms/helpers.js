"use strict";
exports.__esModule = true;
exports.throwIfEnvironmentVariableUnset = void 0;
function throwIfEnvironmentVariableUnset(variableName) {
    if (!process.env[variableName]) {
        throw new Error("Missing required environment variable ".concat(variableName));
    }
}
exports.throwIfEnvironmentVariableUnset = throwIfEnvironmentVariableUnset;
