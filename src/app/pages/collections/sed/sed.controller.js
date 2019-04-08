(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('SedCollectionController', SedCollectionController);

    /** @ngInject */
    function SedCollectionController ($compile, $log, $scope, $uibModal, API, authService) {
        var vm = this;

        vm.viewDetails = viewDetails;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.API = API;
            vm.API_KEY = authService.getApiKey();
            vm.columnSet = [
                { predicate: 'developer', display: 'Developer', sortType: 'single' },
                { predicate: 'product', display: 'Product', sortType: 'single' },
                { predicate: 'version', display: 'Version', sortType: 'single' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true, initialPanel: 'sed' },
                { predicate: 'id', display: 'Details', sortType: 'none', transformFn: _makeDetailsButton },
            ];
            vm.filters = ['acb', 'certificationStatus']; //, 'edition'];
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
                edition: [
                    { value: '2014', selected: false },
                    { value: '2015', selected: true },
                ],
            };
        }

        function viewDetails (id) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.collections/sed/sed-modal.html',
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
            ret = '<button class="btn btn-ai" ng-click="vm.callFunction({id:' + data + '})"><i class="fa fa-eye"></i> View</button>';
            return ret;
        }
    }
})();
