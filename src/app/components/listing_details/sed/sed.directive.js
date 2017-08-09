(function () {
    'use strict';

    angular
        .module('chpl')
        .directive('aiSed', aiSed)
        .controller('SedController', SedController);

    /** @ngInject */
    function aiSed () {
        var directive = {
            bindToController: {
                listing: '=',
                taskCount: '=?',
            },
            controller: 'SedController',
            controllerAs: 'vm',
            replace: true,
            restrict: 'E',
            scope: {},
            templateUrl: 'app/components/listing_details/sed/sed.html',
        };
        return directive;
    }

    /** @ngInject */
    function SedController ($filter, $log, $uibModal, utilService) {
        var vm = this;

        vm.sortCert = utilService.sortCert;
        vm.sortCerts = sortCerts;
        vm.viewDetails = viewDetails;
        vm.viewParticipants = viewParticipants;

        activate();

        ////////////////////////////////////////////////////////////////////

        function activate () {
            analyzeCriteria();
        }

        function sortCerts (task) {
            return utilService.sortCerts(task.criteria);
        }

        function viewDetails (task) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/sed/view/taskModal.html',
                controller: 'ViewSedTaskController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    task: function () { return task; },
                },
            });
        }

        function viewParticipants (task) {
            vm.modalInstance = $uibModal.open({
                templateUrl: 'app/components/listing_details/sed/view/participantsModal.html',
                controller: 'ViewSedParticipantsController',
                controllerAs: 'vm',
                animation: false,
                backdrop: 'static',
                keyboard: false,
                size: 'lg',
                resolve: {
                    participants: function () { return task.testParticipants; },
                },
            });
        }

        ////////////////////////////////////////////////////////////////////

        function analyzeCriteria () {
            var cert, i, j, object, task;
            object = {};
            for (i = 0; i < vm.listing.certificationResults.length; i++) {
                cert = vm.listing.certificationResults[i];
                if (cert.sed) {
                    for (j = 0; j < cert.testTasks.length; j++) {
                        task = cert.testTasks[j];
                        if (angular.isUndefined(object[task.id])) {
                            object[task.id] = task;
                            object[task.id].criteria = [];
                        }
                        object[task.id].criteria.push(cert.number);
                        object[task.id].criteria = $filter('orderBy')(object[task.id].criteria, vm.sortCert);
                    }
                }
            }
            vm.tasks = [];
            angular.forEach(object, function (task) {
                vm.tasks.push(task);
            });
            vm.taskCount = vm.tasks.length;
        }
    }
})();
