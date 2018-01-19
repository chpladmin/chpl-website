(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('BannedDevelopersController', BannedDevelopersController);

    /** @ngInject */
    function BannedDevelopersController () {
        var vm = this;

        vm._acbTransform = acbTransform;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'developer', display: 'Developer', sortType: 'single' },
                { predicate: 'decertificationDate', display: 'Date', sortType: 'single', isDate: true, sortDefault: true },
                { predicate: 'acb', display: 'ONC-ACB', transformFn: acbTransform, sortType: 'none' },
            ];
            vm.filters = ['acb', 'decertificationDate'];
            vm.refineModel = {
                acb: [
                    { value: 'Drummond Group', selected: true },
                    { value: 'ICSA Labs', selected: true },
                    { value: 'InfoGard', selected: true },
                ],
            };
        }

        ////////////////////////////////////////////////////////////////////

        function acbTransform (data) {
            return data.join('<br />');
        }
    }
})();
