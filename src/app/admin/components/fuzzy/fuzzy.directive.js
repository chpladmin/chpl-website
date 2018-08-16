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
            templateUrl: 'chpl.admin/components/fuzzy/fuzzy.html',
        };
        return directive;
    }

    /** @ngInject */
    function FuzzyManagementController ($log, $uibModal, networkService) {
        var vm = this;

        vm.edit = edit;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            _getFuzzyTypes();
        }

        function edit (type) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'chpl.admin/components/fuzzy/edit.html',
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
