;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdditionalSoftwareController', ['$log', '$scope', '$modal', function ($log, $scope, $modal) {
            var vm = this;

            vm.format = format;
            vm.addItem = addItem;
            vm.editItem = editItem;
            vm.removeItem = removeItem;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.format();
            }

            function format () {
                var ret = '';
                if (!vm.additionalSoftware || vm.additionalSoftware.length === 0) {
                    ret = 'None';
                } else {
                    for (var i = 0; i < vm.additionalSoftware.length; i++) {
                        ret += vm.additionalSoftware[i].name;
                        if (vm.additionalSoftware[i].version !== '-1') {
                            ret += " (Version: " + vm.additionalSoftware[i].version + ")";
                        }
                        if (vm.additionalSoftware[i].chplId) {
                            ret += " (CHPL Id: " + vm.additionalSoftware[i].certifiedProductCHPLId + ")";
                        }
                        ret += "; ";
                    }
                    ret = ret.substring(0, ret.length - 2);
                }
                return ret;
            }

            function addItem () {
                vm.editModalInstance = $modal.open({
                    templateUrl: 'admin/components/additionalSoftwareModal.html',
                    controller: 'EditAdditionalSoftwareController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        software: function () { return { name: '', version: '', certifiedProductSelfCHPLId: '' }; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    if (!vm.additionalSoftware) {
                        vm.additionalSoftware = [];
                    }
                    vm.additionalSoftware.push(result);
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }

            function editItem (sw, index) {
                vm.editModalInstance = $modal.open({
                    templateUrl: 'admin/components/additionalSoftwareModal.html',
                    controller: 'EditAdditionalSoftwareController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        software: function () { return sw; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    vm.additionalSoftware[index] = result;
                }, function (result) {
                    if (result !== 'cancelled') {
                        console.debug('dismissed', result);
                    }
                });
            }

            function removeItem (index) {
                vm.additionalSoftware.splice(index, 1);
            }
        }])
        .directive('aiAdditionalSoftware', [function () {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/additionalSoftware.html',
                bindToController: {
                    additionalSoftware: '=',
                    isEditing: '='
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'AdditionalSoftwareController'
            };
        }]);
})();
