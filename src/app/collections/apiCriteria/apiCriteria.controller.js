(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('ApiCriteriaController', ApiCriteriaController);

    /** @ngInject */
    function ApiCriteriaController () {
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
                { predicate: 'mandatoryDisclosures', display: 'Mandatory Disclosures URL', transformFn: vm.disclosuresTransform },
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
                ret = '<ul class="list-unstyled">';
                angular.forEach(apis, function (value, key) {
                    ret += '<li>' + value.join(', ') + ': ' + '<ai-a href="' + key + '">' + key + '</ai-a></li>';
                });
                ret += '</ul>';
            }
            return ret;
        }

        function disclosuresTransform (data) {
            var ret = 'Unknown';
            if (data) {
                ret = '<ai-a href="' + data + '">' + data + '</ai-a>';
            }
            return ret;
        }
    }
})();
