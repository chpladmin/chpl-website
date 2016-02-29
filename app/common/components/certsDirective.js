;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CertsController', ['$scope', '$log', function ($scope, $log) {
            var vm = this;

            vm.addIds = addIds;
            vm.saveEdits = saveEdits;
            vm.sortCerts = sortCerts;
            vm.sortCqms = sortCqms;
            vm.showDetails = showDetails;
            vm.showPanel = showPanel;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (vm.isEditing === undefined) {
                    vm.isEditing = false;
                }
                if (vm.viewAllCerts === undefined) {
                    vm.viewAllCerts = false;
                }
                vm.editCqms = {};
                vm.addIds();
                vm.panelShown = 'cert';
                if (vm.isEditing) {
                    attachBooleans();
                }
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
                    if (vm.certs[i].gap === 'null') {
                        delete (vm.certs[i].gap);
                    }
                    if (vm.certs[i].g1Success === 'null') {
                        delete (vm.certs[i].g1Success);
                    }
                    if (vm.certs[i].g2Success === 'null') {
                        delete (vm.certs[i].g2Success);
                    }
                    if (vm.certs[i].sed === 'null') {
                        delete (vm.certs[i].sed);
                    }
                }

                for (var i = 0; i < vm.cqms.length; i++) {
                    if (vm.cqms[i].success || vm.cqms[i].successVersions.length > 0) {
                        vm.countCqms += 1;
                    }
                }
            }

            function sortCerts (cert) {
                var ret = 0;
                if (cert.number) {
                    var letter;
                    var number;
                    letter = cert.number.substring(9,10);
                    if (cert.number.substring(0,6) === '170.30') {
                        number = cert.number.substring(6,7);
                        ret = parseInt(number) * 100 + letter.charCodeAt(0);
                    } else {
                        number = cert.number.substring(12,14);
                        if (number.substring(1,2) === ')')
                            number = number.substring(0,1);
                        ret = letter.charCodeAt(0) * 100 + parseInt(number);
                    }
                }
                return ret;
            }

            function sortCqms (cqm) {
                var ret = 0;
                if (cqm.cmsId) {
                    ret = parseInt(cqm.cmsId.substring(3));
                } else {
                    ret = parseInt(cqm.nqfNumber);
                }
                return ret;
            }

            function showDetails (number) {
                vm.certDetails = vm.certDetails === number ? '' : number;
                vm.showSed = false;
            }

            function showPanel (panel) {
                vm.panelShown = vm.panelShown === panel ? '' : panel;
            }

            ////////////////////////////////////////////////////////////////////

            function attachBooleans () {
                for (var i = 0; i < vm.certs.length; i++) {
//                    vm.editForm['data_' + vm.certs[i].number + '_gap'] = vm.certs[i].gap;
                }
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
