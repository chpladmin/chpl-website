(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('TransparencyAttestationsController', TransparencyAttestationsController);

    /** @ngInject */
    function TransparencyAttestationsController () {
        var vm = this;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'name', display: 'Developer', sortType: 'single', sortDefault: true },
                { predicate: 'acbAttestations', display: 'Attestation', sortType: 'none' },
                { predicate: 'transparencyAttestationUrls', display: 'Disclosure URL(s)', sortType: 'none', transformFn: urlTransform },
            ];
        }

        ////////////////////////////////////////////////////////////////////

        function urlTransform (data) {
            return data
                .map(function (item) {
                    return '<a href="' + item + '">' + item +
                        '<a href="http://www.hhs.gov/disclaimer.html" title="Web Site Disclaimers" class="pull-right">' +
                        '<i class="fa fa-external-link"></i>' +
                        '<span class="sr-only">Web Site Disclaimers</span>' +
                        '</a>' +
                        '</a>';
                })
                .join('<br />');
        }
    }
})();
