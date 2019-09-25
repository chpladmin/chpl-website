(function () {
    'use strict';

    angular.module('chpl.components')
        .controller('AdditionalSoftwareController', AdditionalSoftwareController)
        .directive('aiAdditionalSoftware', function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'chpl.components/listing/details/relied-upon-software/view.html',
                bindToController: {
                    additionalSoftware: '=?',
                    isEditing: '=?',
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'AdditionalSoftwareController',
            };
        });

    /** @ngInject */
    function AdditionalSoftwareController ($log, $scope, $uibModal) {
        var vm = this;

        vm.addItem = addItem;
        vm.buildGrouping = buildGrouping;
        vm.editItem = editItem;
        vm.isAndOrOr = isAndOrOr;
        vm.removeItem = removeItem;

        ////////////////////////////////////////////////////////////////////

        this.$onInit = function () {
            vm.buildGrouping();
        }

        function addItem () {
            vm.editModalInstance = $uibModal.open({
                templateUrl: 'chpl.components/listing/details/relied-upon-software/edit.html',
                controller: 'EditAdditionalSoftwareController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    software: function () { return { name: '', version: '', certifiedProductSelfCHPLId: '' }; },
                },
            });
            vm.editModalInstance.result.then(function (result) {
                if (!vm.additionalSoftware) {
                    vm.additionalSoftware = [];
                }
                vm.additionalSoftware.push(result);
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                }
            });
        }

        function buildGrouping () {
            vm.displaySw = {};
            vm.groupCount = 0;
            if (vm.additionalSoftware) {
                for (var i = 0; i < vm.additionalSoftware.length; i++) {
                    if (vm.additionalSoftware[i].grouping === null) {
                        vm.displaySw['defaultGroup' + i] = [vm.additionalSoftware[i]];
                        vm.groupCount += 1;
                    } else {
                        if (!vm.displaySw[vm.additionalSoftware[i].grouping]) {
                            vm.displaySw[vm.additionalSoftware[i].grouping] = [];
                            vm.groupCount += 1;
                        }
                        vm.displaySw[vm.additionalSoftware[i].grouping].push(vm.additionalSoftware[i]);
                    }
                }
            }
        }

        function editItem (sw, index) {
            vm.editModalInstance = $uibModal.open({
                templateUrl: 'chpl.components/listing/details/relied-upon-software/edit.html',
                controller: 'EditAdditionalSoftwareController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                resolve: {
                    software: function () { return sw; },
                },
            });
            vm.editModalInstance.result.then(function (result) {
                vm.additionalSoftware[index] = result;
            }, function (result) {
                if (result !== 'cancelled') {
                    $log.debug('dismissed', result);
                }
            });
        }

        function isAndOrOr (index, groupLength, parentIndex, groupCount) {
            if (index < (groupLength - 1)) {
                return 'OR';
            } else if (parentIndex < (groupCount - 1)) {
                return 'AND';
            }
            return '';
        }

        function removeItem (index) {
            vm.additionalSoftware.splice(index, 1);
        }
    }
})();
