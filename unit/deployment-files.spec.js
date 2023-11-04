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
exports.validateVolumeMounts = exports.validateSecureConfiguration = exports.validateEnvironmentVariables = void 0;
var yaml_1 = require("yaml");
var fs_1 = require("fs");
var config_1 = require("../../src/common/config");
/**
 * Note that these checks are also performed at runtime on the deployed khulnasoft-monitor, see the integration tests.
 */
describe('deployment files tests', function () {
    test.concurrent('ensure the security properties of the deployment files are unchanged', function () { return __awaiter(void 0, void 0, void 0, function () {
        var deploymentFiles, _i, deploymentFiles_1, filePath, fileContent, deployment;
        return __generator(this, function (_a) {
            expect(config_1.config.IMAGE_STORAGE_ROOT).toEqual('/var/tmp');
            deploymentFiles = ['./khulnasoft-monitor-deployment.yaml'];
            for (_i = 0, deploymentFiles_1 = deploymentFiles; _i < deploymentFiles_1.length; _i++) {
                filePath = deploymentFiles_1[_i];
                fileContent = (0, fs_1.readFileSync)(filePath, 'utf8');
                deployment = (0, yaml_1.parse)(fileContent);
                validateSecureConfiguration(deployment);
                validateVolumeMounts(deployment);
                validateEnvironmentVariables(deployment);
            }
            return [2 /*return*/];
        });
    }); });
});
function validateEnvironmentVariables(deployment) {
    if (!deployment.spec ||
        !deployment.spec.template.spec ||
        !deployment.spec.template.spec.containers ||
        deployment.spec.template.spec.containers.length === 0 ||
        !deployment.spec.template.spec.containers[0].env) {
        fail('bad container spec or missing env');
    }
    var env = deployment.spec.template.spec.containers[0].env;
    var envHasHomeEntry = env.some(function (entry) { return entry.name === 'HOME' && entry.value === '/srv/app'; });
    expect(envHasHomeEntry).toBeTruthy();
}
exports.validateEnvironmentVariables = validateEnvironmentVariables;
function validateSecureConfiguration(deployment) {
    if (!deployment.spec ||
        !deployment.spec.template.spec ||
        !deployment.spec.template.spec.containers ||
        deployment.spec.template.spec.containers.length === 0 ||
        !deployment.spec.template.spec.containers[0].securityContext) {
        fail('bad container spec or missing securityContext');
    }
    var securityContext = deployment.spec.template.spec.containers[0].securityContext;
    if (!securityContext.capabilities) {
        fail('missing capabilities section in pod securityContext');
    }
    expect(securityContext.capabilities.drop).toEqual(['ALL']);
    if (securityContext.capabilities.add) {
        expect(securityContext.capabilities.add.includes('SYS_ADMIN')).toEqual(false);
    }
    expect(securityContext.readOnlyRootFilesystem).toEqual(true);
    expect(securityContext.allowPrivilegeEscalation).toEqual(false);
    expect(securityContext.privileged).toEqual(false);
    expect(securityContext.runAsNonRoot).toEqual(true);
}
exports.validateSecureConfiguration = validateSecureConfiguration;
function validateVolumeMounts(deployment) {
    if (!deployment.spec ||
        !deployment.spec.template.spec ||
        !deployment.spec.template.spec.containers ||
        deployment.spec.template.spec.containers.length === 0 ||
        !deployment.spec.template.spec.containers[0].volumeMounts) {
        fail('bad container spec or missing volumeMounts');
    }
    var volumeMounts = deployment.spec.template.spec.containers[0].volumeMounts;
    var temporaryStorageMount = volumeMounts.find(function (mount) { return mount.name === 'temporary-storage'; });
    if (!temporaryStorageMount) {
        fail('missing deployment mount "temporary-storage"');
    }
    expect(temporaryStorageMount.mountPath).toEqual('/var/tmp');
    var dockerConfigMount = volumeMounts.find(function (mount) { return mount.name === 'docker-config'; });
    if (!dockerConfigMount) {
        fail('missing deployment mount "docker-config"');
    }
    expect(dockerConfigMount.readOnly).toEqual(true);
    expect(dockerConfigMount.mountPath).toEqual('/srv/app/.docker');
}
exports.validateVolumeMounts = validateVolumeMounts;
