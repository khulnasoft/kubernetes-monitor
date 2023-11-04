"use strict";
exports.__esModule = true;
var yaml_1 = require("./yaml");
var operator_olm_1 = require("./operator-olm");
var operator_openshift_1 = require("./operator-openshift");
var helm_1 = require("./helm");
var helm_with_proxy_1 = require("./helm-with-proxy");
exports["default"] = {
    YAML: yaml_1.yamlDeployer,
    OperatorOLM: operator_olm_1.operatorDeployer,
    OperatorOS: operator_openshift_1.operatorDeployer,
    Helm: helm_1.helmDeployer,
    Proxy: helm_with_proxy_1.helmWithProxyDeployer
};
