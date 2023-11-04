"use strict";
exports.__esModule = true;
exports.getProxyAgent = void 0;
var tunnel_1 = require("tunnel");
var http_1 = require("http");
var https_1 = require("https");
var logger_1 = require("../common/logger");
function getProxyAgent(config, endpoint) {
    var url = new URL(endpoint);
    // Check if the address is explicitly marked not to be proxied.
    if (config.NO_PROXY) {
        var hosts = config.NO_PROXY.split(',').map(function (host) { return host.toLowerCase(); });
        if (hosts.includes(url.hostname.toLowerCase())) {
            return url.protocol === 'https:' ? https_1.globalAgent : http_1.globalAgent;
        }
        // CIDR ranges are not supported, e.g. NO_PROXY=192.168.0.0/16.
        // Wildcards are also not supported, e.g. NO_PROXY=*.mydomain.local
        // HTTPS proxies (the connection to the proxy, not to the upstream) are not supported.
    }
    switch (url.protocol) {
        case 'http:':
            if (!config.HTTP_PROXY) {
                return http_1.globalAgent;
            }
            var httpProxyUrl = new URL(config.HTTP_PROXY);
            return (0, tunnel_1.httpOverHttp)({
                proxy: {
                    host: httpProxyUrl.hostname,
                    port: parseInt(httpProxyUrl.port) || 80
                }
            });
        case 'https:':
            if (!config.HTTPS_PROXY) {
                return https_1.globalAgent;
            }
            var httpsProxyUrl = new URL(config.HTTPS_PROXY);
            return (0, tunnel_1.httpsOverHttp)({
                proxy: {
                    host: httpsProxyUrl.hostname,
                    port: parseInt(httpsProxyUrl.port) || 443
                }
            });
        default:
            logger_1.logger.error({ urlHost: url.host, urlProtocol: url.protocol }, 'Unsupported protocol for proxying');
            throw new Error('Unsupported protocol for proxying');
    }
}
exports.getProxyAgent = getProxyAgent;
