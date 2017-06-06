(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('ApiCriteriaController', ApiCriteriaController);

    /** @ngInject */
    function ApiCriteriaController ($compile, $scope) {
        var vm = this;

        vm.apiTransform = apiTransform;
        vm.disclosuresTransform = disclosuresTransform;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'developer', display: 'Developer' },
                { predicate: 'product', display: 'Product' },
                { predicate: 'version', display: 'Version' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortDefault: true, isLink: true },
                { predicate: 'apiDocumentation', display: 'API Documentation', transformFn: vm.apiTransform },
                { predicate: 'transparencyAttestationUrl', display: 'Mandatory Disclosures URL', transformFn: vm.disclosuresTransform },
            ];
        }

        ////////////////////////////////////////////////////////////////////

        function apiTransform (data) {
            var ret = 'Unknown';
            if (data) {
                var apis = {};
                var pairs = data.split('☺');
                var key, value;
                for (var i = 0; i < pairs.length; i++) {
                    var items = pairs[i].split('☹');
                    key = items[0];
                    value = items[1];
                    if (value) {
                        if (!apis[value]) {
                            apis[value] = [];
                        }
                        apis[value].push(key);
                    }
                }
                ret = '<ul>';
                angular.forEach(apis, function (value, key) {
                    ret += '<li>' + value.join(', ') + ': ' + '<a ai-a href="' + key + '">' + key + '</a></li>';
                });
                ret += '</ul>';
                ret = $compile(ret)($scope)[0].outerHTML;
            }
            return ret;
        }

        function disclosuresTransform (data) {
            var ret = 'Unknown';
            if (data) {
                ret = '<a ai-a href="' + data + '">' + data + '</a>';
                ret = $compile(ret)($scope)[0].outerHTML;
            }
            return ret;
        }
    }
})();
