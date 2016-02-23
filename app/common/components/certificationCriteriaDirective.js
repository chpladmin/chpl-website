;(function () {
    'use strict';

    angular.module('app.common')
        .controller('CertificationCriteriaController', ['$scope', '$log', '$timeout', function ($scope, $log, $timeout) {
            var vm = this;

            vm.saveEdits = saveEdits;

            activate();

            ////////////////////////////////////////////////////////////////////

            function activate () {
                if (vm.isEditing) {
                    $timeout(attachBooleans
                             ,1000);
//                    attachBooleans();
                }
            }

            function saveEdits () {
                if (vm.cert.gap === 'null') {
                    delete (vm.cert.gap);
                }
                if (vm.cert.g1Success === 'null') {
                    delete (vm.cert.g1Success);
                }
                if (vm.cert.g2Success === 'null') {
                    delete (vm.cert.g2Success);
                }
                if (vm.cert.sed === 'null') {
                    delete (vm.cert.sed);
                }
            }

            ////////////////////////////////////////////////////////////////////

            function attachBooleans () {
                vm.editForm['data_gap'].$viewValue = vm.cert.gap;
            }
        }]);

    angular.module('app.common')
        .directive('aiCertificationCriteria', ['commonService', '$log', function (commonService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'common/components/certificationCriteria.html',
                bindToController: {
                    cert: '=',
                    viewAll: '=',
                    isEditing: '=',
                    save: '&'
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'CertificationCriteriaController',
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
