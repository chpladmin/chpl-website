(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('ApiDocumentationController', ApiDocumentationController);

    /** @ngInject */
    function ApiDocumentationController ($compile, $scope, SPLIT_PRIMARY, SPLIT_SECONDARY) {
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
            vm.filters = ['certificationStatus'];
            vm.refineModel = {
                certificationStatus: [
                    { value: 'Active', selected: true },
                    { value: 'Suspended by ONC', selected: true },
                    { value: 'Suspended by ONC-ACB', selected: true },
                    { value: 'Retired', selected: false },
                    { value: 'Withdrawn by Developer', selected: false },
                    { value: 'Withdrawn by Developer Under Surveillance/Review', selected: false },
                    { value: 'Withdrawn by ONC-ACB', selected: false },
                    { value: 'Terminated by ONC', selected: false },
                ],
            };
        }

        ////////////////////////////////////////////////////////////////////

        function apiTransform (data) {
            var ret = 'Unknown';
            if (data) {
                var apis = {};
                var pairs = data.split(SPLIT_PRIMARY);
                var key, value;
                for (var i = 0; i < pairs.length; i++) {
                    var items = pairs[i].split(SPLIT_SECONDARY);
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
            }
            return ret;
        }

        function disclosuresTransform (data) {
            var ret = 'Unknown';
            if (data) {
                ret = '<a ai-a href="' + data + '">' + data + '</a>';
            }
            return ret;
        }
    }
})();
