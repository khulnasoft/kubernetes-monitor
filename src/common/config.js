"use strict";
exports.__esModule = true;
exports.config = void 0;
var fs_1 = require("fs");
var crypto_1 = require("crypto");
var khulnasoft_config_1 = require("khulnasoft-config");
var config = (0, khulnasoft_config_1.loadConfig)(__dirname + '/../..', {
    secretConfig: process.env.CONFIG_SECRET_FILE
});
exports.config = config;
var namespacesFilePath = '/etc/config/excludedNamespaces';
function loadExcludedNamespaces() {
    try {
        var data = (0, fs_1.readFileSync)(namespacesFilePath, 'utf-8');
        var namespaces = data.split(/\r?\n/);
        return namespaces;
    }
    catch (err) {
        return null;
    }
}
function getClusterName() {
    if (!config.CLUSTER_NAME) {
        return 'Default cluster';
    }
    if (config.CLUSTER_NAME.includes('/')) {
        // logger is not yet created so defaulting to console.log
        console.log("removing disallowed character \"/\" from clusterName (".concat(config.CLUSTER_NAME, ")"));
        return config.CLUSTER_NAME.replace(/\//g, '');
    }
    return config.CLUSTER_NAME;
}
// NOTE: The agent identifier is replaced with a stable identifier once khulnasoft-monitor starts up
config.AGENT_ID = (0, crypto_1.randomUUID)();
config.INTEGRATION_ID = config.INTEGRATION_ID.trim();
config.SERVICE_ACCOUNT_API_TOKEN = config.SERVICE_ACCOUNT_API_TOKEN.trim();
config.CLUSTER_NAME = getClusterName();
config.IMAGE_STORAGE_ROOT = '/var/tmp';
config.POLICIES_STORAGE_ROOT = '/tmp/policies';
config.EXCLUDED_NAMESPACES = loadExcludedNamespaces();
config.WORKERS_COUNT = Number(config.WORKERS_COUNT) || 10;
config.SKOPEO_COMPRESSION_LEVEL = Number(config.SKOPEO_COMPRESSION_LEVEL) || 6;
// return Sysdig endpoint information
if (config.SYSDIG_ENDPOINT && config.SYSDIG_TOKEN) {
    config.SYSDIG_ENDPOINT = config.SYSDIG_ENDPOINT.trim();
    config.SYSDIG_TOKEN = config.SYSDIG_TOKEN.trim();
}
/**
 * Important: we delete the following env vars because we don't want to proxy requests to the Kubernetes API server.
 * The Kubernetes client library would honor the NO/HTTP/HTTPS_PROXY env vars.
 */
config.HTTPS_PROXY = process.env['HTTPS_PROXY'];
config.HTTP_PROXY = process.env['HTTP_PROXY'];
config.NO_PROXY = process.env['NO_PROXY'];
config.USE_KEEPALIVE = process.env.USE_KEEPALIVE === 'true';
delete process.env['HTTPS_PROXY'];
delete process.env['HTTP_PROXY'];
delete process.env['NO_PROXY'];
config.SKIP_K8S_JOBS = process.env.SKIP_K8S_JOBS === 'true';
