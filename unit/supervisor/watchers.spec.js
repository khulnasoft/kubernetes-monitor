"use strict";
exports.__esModule = true;
var config_1 = require("../../../src/common/config");
var internal_namespaces_1 = require("../../../src/supervisor/watchers/internal-namespaces");
describe('extractNamespaceName()', function () {
    test.each([
        ['empty input', {}],
        ['empty metadata', { metadata: {} }],
        ['undefined name', { metadata: { name: undefined } }],
        ['empty name', { metadata: { name: '' } }],
    ])('throws on %s', function (_testCaseName, input) {
        expect(function () { return (0, internal_namespaces_1.extractNamespaceName)(input); }).toThrowError('Namespace missing metadata.name');
    });
    test('returns namespace.metadata.name', function () {
        expect((0, internal_namespaces_1.extractNamespaceName)({
            metadata: { name: 'literally anything else' }
        })).toEqual('literally anything else');
    });
});
describe('isExcludedNamespace() internal Kubernetes namespaces', function () {
    test('list against snapshot', function () {
        expect(internal_namespaces_1.kubernetesInternalNamespaces).toMatchSnapshot();
    });
    var _loop_1 = function (internalNamespace) {
        test("isExcludedNamespace(".concat(internalNamespace, ") -> true"), function () {
            expect((0, internal_namespaces_1.isExcludedNamespace)(internalNamespace)).toEqual(true);
        });
    };
    for (var _i = 0, kubernetesInternalNamespaces_1 = internal_namespaces_1.kubernetesInternalNamespaces; _i < kubernetesInternalNamespaces_1.length; _i++) {
        var internalNamespace = kubernetesInternalNamespaces_1[_i];
        _loop_1(internalNamespace);
    }
    test.each([
        ['kube-node-lease-'],
        ['node-lease'],
        ['khulnasoft-monitor'],
        ['egg'],
        [''],
        [undefined],
    ])('isExcludedNamespace(%s) -> false', function (input) {
        expect((0, internal_namespaces_1.isExcludedNamespace)(input)).toEqual(false);
    });
});
describe('isExcludedNamespace() openshift internal namespaces', function () {
    test('list against snapshot', function () {
        expect(internal_namespaces_1.openshiftInternalNamespaces).toMatchSnapshot();
    });
    var _loop_2 = function (internalNamespace) {
        test("isExcludedNamespace(".concat(internalNamespace, ") -> true"), function () {
            expect((0, internal_namespaces_1.isExcludedNamespace)(internalNamespace)).toEqual(true);
        });
    };
    for (var _i = 0, openshiftInternalNamespaces_1 = internal_namespaces_1.openshiftInternalNamespaces; _i < openshiftInternalNamespaces_1.length; _i++) {
        var internalNamespace = openshiftInternalNamespaces_1[_i];
        _loop_2(internalNamespace);
    }
    test.each([
        ['openshif'],
        ['openshift-'],
        ['egg'],
        [''],
        [undefined],
    ])('isExcludedNamespace(%s) -> false', function (input) {
        expect((0, internal_namespaces_1.isExcludedNamespace)(input)).toEqual(false);
    });
});
describe('isExcludedNamespace() excluded namespaces from config', function () {
    var excludedNamespacesFromConfig = ['one', 'two', 'three'];
    beforeAll(function () {
        config_1.config.EXCLUDED_NAMESPACES = excludedNamespacesFromConfig;
    });
    afterAll(function () {
        config_1.config.EXCLUDED_NAMESPACES = null;
    });
    excludedNamespacesFromConfig.forEach(function (namespace) {
        test("[excluded namespaces from config] isExcludedNamespace(".concat(namespace, ") -> true"), function () {
            expect((0, internal_namespaces_1.isExcludedNamespace)(namespace)).toEqual(true);
        });
    });
    var _loop_3 = function (internalNamespace) {
        test("[openshift internal namespaces] isExcludedNamespace(".concat(internalNamespace, ") -> true"), function () {
            expect((0, internal_namespaces_1.isExcludedNamespace)(internalNamespace)).toEqual(true);
        });
    };
    for (var _i = 0, openshiftInternalNamespaces_2 = internal_namespaces_1.openshiftInternalNamespaces; _i < openshiftInternalNamespaces_2.length; _i++) {
        var internalNamespace = openshiftInternalNamespaces_2[_i];
        _loop_3(internalNamespace);
    }
    test.each([['kube-system']['egg'], [''], [undefined]])('isExcludedNamespace(%s) -> false', function (input) {
        expect((0, internal_namespaces_1.isExcludedNamespace)(input)).toEqual(false);
    });
});
