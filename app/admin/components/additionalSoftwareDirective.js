;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AdditionalSoftwareController', ['$log', '$scope', '$modal', function ($log, $scope, $modal) {
            var vm = this;

            vm.format = format;
            vm.addItem = addItem;
            vm.editItem = editItem;
            vm.removeItem = removeItem;

            ////////////////////////////////////////////////////////////////////

            $scope.$watch('additionalSoftware', function (newSw) {
                if (newSw) {
                    vm.additionalSoftware = newSw;
                    vm.format();
                }}, true);
            $scope.$watch('isEditing', function (editing) {
                if (editing) {
                    vm.isEditing = editing;
                }}, true);

            function format () {
                var newString = "";
                for (var i = 0; i < vm.additionalSoftware.length; i++) {
                    newString += vm.additionalSoftware[i].name + " (Version: " + vm.additionalSoftware[i].version + "); ";
                }
                newString = newString.substring(0, newString.length - 2);
                vm.prettyPrint = newString;
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
                        software: function () { return { name: '', version: '' }; }
                    }
                });
                vm.editModalInstance.result.then(function (result) {
                    vm.additionalSoftware.push(result);
                    vm.format();
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
                    vm.format();
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
                scope: {
                    additionalSoftware: '=',
                    isEditing: '='
                },
                controllerAs: 'vm',
                controller: 'AdditionalSoftwareController'
            };
        }]);
})();
