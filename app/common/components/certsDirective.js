;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CertsController', ['$scope', '$log', function ($scope, $log) {
            var vm = this;

            vm.addIds = addIds;
            vm.saveEdits = saveEdits;
            vm.showPanel = showPanel;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.editCqms = {};
                vm.addIds();
                vm.panelShown = '';
            }

/*            vm.certs = [];
            vm.cqms = [];
            vm.builtCqms = [];
            $scope.$watch('certs', function (newCerts) {
                if (newCerts) {
                    vm.certs = newCerts;
                }}, true);
                */
            $scope.$watch('cqms', function (newCqms) {
                if (newCqms) {
                    vm.cqms = newCqms;
                    vm.addIds();
                }}, true);
            /*
            $scope.$watch('countCerts', function (newCount) {
                if (newCount) {
                    vm.countCerts = newCount;
                }}, true);
            $scope.$watch('countCqms', function (newCount) {
                if (newCount) {
                    vm.countCqms = newCount;
                }}, true);
            $scope.$watch('reportFileLocation', function (location) {
                if (location) {
                    vm.reportFileLocation = location;
                }}, true);
            $scope.$watch('isEditing', function (editing) {
                if (editing !== null) {
                    vm.isEditing = editing;
                }}, true);
            vm.viewAllCerts = $scope.viewAllCerts;
            vm.editMode = $scope.editMode;
*/
            function addIds () {
                if (vm.cqms) {
                    for (var i = 0; i < vm.cqms.length; i++) {
                        vm.cqms[i].id = i;
                    }
                }
            }

            function saveEdits () {
                vm.countCerts = 0;
                vm.countCqms = 0;

                for (var i = 0; i < vm.certs.length; i++) {
                    if (vm.certs[i].success) {
                        vm.countCerts += 1;
                    }
                }

                for (var i = 0; i < vm.cqms.length; i++) {
                    if (vm.cqms[i].success || vm.cqms[i].successVersions.length > 0) {
                        vm.countCqms += 1;
                    }
                }
            }

            function showPanel (panel) {
                if (vm.panelShown === panel) {
                    vm.panelShown = '';
                } else {
                    vm.panelShown = panel
                }
            }
/*
            vm.cancelEdits = function () {
              pp  $log.info('cancelling edits');
                vm.certs = angular.copy($scope.certs);
                vm.cqms = angular.copy($scope.cqms);
                vm.isEditing = !vm.isEditing
            };
            */
        }]);

    angular.module('app.common')
        .directive('aiCerts', ['commonService', '$log', function (commonService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/certs.html',
                bindToController: {
                    certs: '=',
                    cqms: '=',
                    viewAllCerts: '=defaultAll',
                    countCerts: '@',
                    countCqms: '@',
                    editMode: '=',
                    reportFileLocation: '@',
                    isEditing: '=',
                    save: '&'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'CertsController',
                link: function (scope, element, attr, ctrl) {
                    var handler = ctrl.save({
                        handler: function () {
                            ctrl.saveEdits();
                        }
                    });
                    scope.$on('$destroy', handler);
                }
            };
        }]);
})();
