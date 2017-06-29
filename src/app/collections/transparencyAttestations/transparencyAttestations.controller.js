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
                { predicate: 'developer', display: 'Developer', sortType: 'single', sortDefault: true },
                { predicate: 'transparencyAttestation', display: 'Attestation', sortType: 'single' },
                { predicate: 'disclosureUrl', display: 'Disclosure URL(s)', sortType: 'none', transformFn: urlTransform },
            ];
        }

        ////////////////////////////////////////////////////////////////////

        function urlTransform (data) {
            return data
                .map(function (item) {
                    return '<a ai-a href="' + item + '">' + item + '</a>';
                })
                .join('<br />');
        }
    }
})();
