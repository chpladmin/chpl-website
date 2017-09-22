(function () {
    'use strict';

    angular.module('chpl.collections')
        .controller('SedCollectionController', SedCollectionController);

    /** @ngInject */
    function SedCollectionController ($compile, $log, $scope, $uibModal) {
        var vm = this;

        vm.viewDetails = viewDetails;
        $scope.viewDetails = viewDetails;
        vm.showMessage = function (m) {
            alert(m);
        }
        vm.test ="<button ng-click='vm.showMessage(\"sed\")'>click me</button>";

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            vm.columnSet = [
                { predicate: 'developer', display: 'Developer', sortType: 'single' },
                { predicate: 'product', display: 'Product', sortType: 'single' },
                { predicate: 'version', display: 'Version', sortType: 'single' },
                { predicate: 'chplProductNumber', display: 'CHPL ID', sortType: 'single', sortDefault: true, isLink: true },
                { predicate: 'id', display: 'Details', sortType: 'none', transformFn: _makeDetailsButton },
            ];
            vm.filters = ['acb', 'certificationStatus', 'edition'];
            vm.refineModel = {
                acb: [
                    { value: 'Drummond Group', selected: true },
                    { value: 'ICSA Labs', selected: true },
                    { value: 'InfoGard', selected: true },
                ],
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
            console.log(id);
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
            ret = /*angular.element(*/'<span><a class="btn btn-primary" ng-click="alert(3); vm.viewDetails(' + data + ')"><i class="fa fa-eye"></i> View Details (' + data + ')</a></span>';//);
            ret = "<button ng-click='alert(\"message\")'>alert me</button><button ng-click='$parent.$parent.showMessage(\"repeat\")'>click me</button>";
            //ret = $compile(ret)($scope)[0].outerHTML;
            return ret;
        }
    }
})();
