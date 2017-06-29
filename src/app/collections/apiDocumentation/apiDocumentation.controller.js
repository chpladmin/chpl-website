(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('ApiDocumentationController', ApiDocumentationController);

    /** @ngInject */
    function ApiDocumentationController ($compile, $scope) {
        var vm = this;

        vm.apiTransform = apiTransform;
        vm.disclosuresTransform = disclosuresTransform;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'developer', display: 'Developer', sortType: 'single' },
                { predicate: 'product', display: 'Product', sortType: 'single' },
                { predicate: 'version', display: 'Version', sortType: 'single' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true },
                { predicate: 'apiDocumentation', display: 'API Documentation', sortType: 'single', transformFn: vm.apiTransform },
                { predicate: 'transparencyAttestationUrl', display: 'Mandatory Disclosures URL', sortType: 'single', transformFn: vm.disclosuresTransform },
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
                ret = '<dl>';
                angular.forEach(apis, function (value, key) {
                    ret += '<dt>' + value.join(', ') + '</dt><dd>' + '<a ai-a href="' + key + '">' + key + '</a></dd>';
                });
                ret += '</dl>';
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
