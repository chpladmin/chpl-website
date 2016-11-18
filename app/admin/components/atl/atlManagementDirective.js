;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AtlManagementController', ['commonService', 'authService', '$log', '$modal', function (commonService, authService, $log, $modal) {
            var self = this;

            self.doWork = doWork;
            self.activate = activate;
            self.activateAtl = activateAtl;
            self.loadData = loadData;
            self.createAtl = createAtl;
            self.editAtl = editAtl;

            self.activate();

            ////////////////////////////////////////////////////////////////////

            function doWork (workType) {
                if (workType === 'newAtl') {
                    self.activeAtl = null;
                }
                self.workType = workType;
            }

            function activate () {
                self.isChplAdmin = authService.isChplAdmin();
                self.isAtlAdmin = authService.isAtlAdmin();
                self.atls = [];
                self.workType = 'atl';
            }

            function activateAtl (atl) {
                self.workType = 'atl';
                self.activeAtl = atl;
            }

            function loadData () {
                return commonService.getAtls()
                    .then (function (data) {
                        self.atls = data.atls;
                    });
            }

            function createAtl () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/atlEdit.html',
                    controller: 'EditAtlController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        atl: function () { return {}; },
                        action: function () { return 'create'; },
                        isChplAdmin: function () { return self.isChplAdmin; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    self.activate();
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

            function editAtl (atl) {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/atlEdit.html',
                    controller: 'EditAtlController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        atl: function () { return atl; },
                        action: function () { return 'edit'; },
                        isChplAdmin: function () { return self.isChplAdmin; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    if (result !== 'deleted') {
                        self.activeAtl = result;
                    } else {
                        self.activate();
                    }
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

            self.cancelATL = function() {
                self.loadData();
            };

            self.deleteATL = function (atl) {
                commonService.deleteATL(atl.id)
                    .then(function (response) {
                        self.activate();
                    });
            };

            self.addressRequired = function (atl) {
                if (atl)
                    return commonService.addressRequired(atl.address);
            };
        }])
        .directive('aiAtlManagement', ['commonService', 'authService', '$log', function (commonService, authService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/atl/atlManagement.html',
                bindToController: {
                    workType: '=',
                    activeAtl: '='
                },
                scope: {},
                controllerAs: 'vm',
                controller: 'AtlManagementController'
            };
        }]);
})();
