(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('SedCollectionController', SedCollectionController);

    /** @ngInject */
    function SedCollectionController ($compile, $scope, $uibModal) {
        var vm = this;

        vm.viewDetails = viewDetails;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'developer', display: 'Developer', sortType: 'single' },
                { predicate: 'product', display: 'Product', sortType: 'single' },
                { predicate: 'version', display: 'Version', sortType: 'single' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true },
                { predicate: 'id', display: 'Details', sortType: 'none', transformFn: vm._makeDetailsButton },
            ];
            vm.filters = ['acb', 'edition', 'certificationStatus'];
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

        function viewDetails (id) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/collections/sed/sedModal.html',
                controller: 'ViewSedModalController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    id: function () { return id; },
                },
            });
        }

        ////////////////////////////////////////////////////////////////////

        vm._makeDetailsButton = _makeDetailsButton;

        function _makeDetailsButton (data) {
            var ret;
            ret = '<button class="btn btn-primary" ng-click="vm.viewDetails(' + data + ')"><i class="fa fa-eye"></i> View Details</button>';
            ret = $compile(ret)($scope)[0].outerHTML;
            return ret;
        }
    }
})();
