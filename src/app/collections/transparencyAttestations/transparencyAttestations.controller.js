(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('TransparencyAttestationsController', TransparencyAttestationsController);

    /** @ngInject */
    function TransparencyAttestationsController () {
        var vm = this;

        vm._urlTransform = urlTransform;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'name', display: 'Developer', sortType: 'single', sortDefault: true },
                { predicate: 'acbAttestations', display: 'Attestation', sortType: 'none' },
                { predicate: 'transparencyAttestationUrls', display: 'Disclosure URL(s)', sortType: 'none', transformFn: urlTransform },
            ];
            vm.filters = ['acb', 'acbAttestations'];
            vm.refineModel = {
                acb: [
                    { value: 'Drummond Group', selected: true },
                    { value: 'ICSA Labs', selected: true },
                    { value: 'InfoGard', selected: true },
                    { value: 'SLI Compliance', selected: true },
                ],
                acbAttestations: [
                    { value: 'Supports', selected: true },
                    { value: 'Declined to Support', selected: true },
                    { value: 'Not Applicable', selected: true },
                    { value: 'Has not fulfilled requirement', selected: true },
                ],
            };
        }

        ////////////////////////////////////////////////////////////////////

        function urlTransform (data) {
            var ret;
            if (data && data.length > 0) {
                ret = '<ul class="list-unstyled">' +
                    data.map(function (item) {
                        return '<li><a ai-a href="' + item + '">' + item + '</a></li>';
                    })
                    + '</ul>';
            } else {
                ret = 'Not available';
            }
            return ret;
        }
    }
})();
