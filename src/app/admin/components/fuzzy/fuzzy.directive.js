(function () {
    'use strict';

    angular.module('chpl.admin')
        .directive('aiFuzzyManagement', aiFuzzyManagement)
        .controller('FuzzyManagementController', FuzzyManagementController);

    /** @ngInject */
    function aiFuzzyManagement () {
        var directive = {
            bindToController: {},
            controller: 'FuzzyManagementController',
            controllerAs: 'vm',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'app/admin/components/fuzzy/fuzzy.html',
        };
        return directive;
    }

    /** @ngInject */
    function FuzzyManagementController ($log, $uibModal, networkService) {
        var vm = this;

        vm.edit = edit;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            _getFuzzyTypes();
        }

        function edit (type) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/admin/components/fuzzy/edit.html',
                controller: 'FuzzyEditController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    fuzzyType: function () { return type; },
                },
            });
            vm.modalInstance.result.then(function () {
                _getFuzzyTypes();
            });
        }

        ////////////////////////////////////////////////////////////////////

        function _getFuzzyTypes () {
            networkService.getFuzzyTypes().then(function (response) {
                vm.fuzzyTypes = response;
            });
        }
    }
})();
