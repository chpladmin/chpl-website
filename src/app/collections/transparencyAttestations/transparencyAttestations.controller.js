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
                ret ='<ul>' +
                    data.map(function (item) {
                        return '<li><a href="' + item + '">' + item +
                            '<a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" class="pull-right">' +
                            '<i class="fa fa-external-link"></i>' +
                            '<span class="sr-only">Web Site Disclaimers</span>' +
                            '</a>' +
                            '</a></li>';
                    }) + '</ul>';
            } else {
                ret = 'Not available';
            }
            return ret;
        }
    }
})();
