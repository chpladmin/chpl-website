;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CertsController', ['$scope', '$log', function ($scope, $log) {
            var vm = this;

            vm.addIds = addIds;
            vm.saveEdits = saveEdits;
            vm.showDetails = showDetails;
            vm.showPanel = showPanel;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                vm.editCqms = {};
                vm.addIds();
                vm.panelShown = 'cert';
            }

            $scope.$watch('cqms', function (newCqms) {
                if (newCqms) {
                    vm.cqms = newCqms;
                    vm.addIds();
                }}, true);

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

            function showDetails (number) {
                vm.certDetails = vm.certDetails === number ? '' : number;
                vm.showSed = false;
            }

            function showPanel (panel) {
                vm.panelShown = vm.panelShown === panel ? '' : panel;
            }
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
                    countCerts: '=',
                    countCqms: '=',
                    editMode: '=',
                    reportFileLocation: '@',
                    isEditing: '=',
                    isConfirming: '=',
                    save: '&',
                    product: '='
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
