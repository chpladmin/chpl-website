(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('InactiveCertificatesController', InactiveCertificatesController);

    /** @ngInject */
    function InactiveCertificatesController (commonService) {
        var vm = this;

        vm.getMeaningfulUseUsersAccurateAsOfDate = getMeaningfulUseUsersAccurateAsOfDate;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'edition', display: 'Edition' },
                { predicate: 'developer', display: 'Developer' },
                { predicate: 'product', display: 'Product' },
                { predicate: 'version', display: 'Version' },
                { predicate: 'decertificationDate', display: 'Decertification Date', isDate: true },
                { predicate: 'estimatedUsers', display: '# of Known User', nullDisplay: 'Unknown' },
                { predicate: 'acb', display: 'ONC-ACB' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortDefault: true, isLink: true },
            ];
            vm.filters = ['acb', 'decertificationDate', 'edition'];
            vm.refineModel = {
                acb: [
                    { value: 'Drummond Group', selected: true },
                    { value: 'ICSA Labs', selected: true },
                    { value: 'InfoGard', selected: true },
                ],
                edition: [
                    { value: '2014', selected: true },
                    { value: '2015', selected: true },
                ],
                certificationStatus: [
                    { value: 'Withdrawn by Developer', selected: true },
                ],
            };

            vm.getMeaningfulUseUsersAccurateAsOfDate();
        }

        function getMeaningfulUseUsersAccurateAsOfDate () {
            commonService.getMeaningfulUseUsersAccurateAsOfDate()
                .then(function (response) {
                    vm.muuAccurateAsOf = response.accurateAsOfDate;
                });
        }
    }
})();
