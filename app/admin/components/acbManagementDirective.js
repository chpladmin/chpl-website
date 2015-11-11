;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AcbManagementController', ['commonService', 'authService', '$log', '$modal', function (commonService, authService, $log, $modal) {
            var self = this;

            self.doWork = doWork;
            self.activate = activate;
            self.activateAcb = activateAcb;
            self.loadData = loadData;
            self.createAcb = createAcb;
            self.editAcb = editAcb;

            self.activate();

            ////////////////////////////////////////////////////////////////////

            function doWork (workType) {
                if (workType === 'newAcb') {
                    self.activeAcb = null;
                }
                self.workType = workType;
            }

            function activate () {
                self.isChplAdmin = authService.isChplAdmin();
                self.isAcbAdmin = authService.isAcbAdmin();
                self.newACB = {address: {}};
                self.acbs = [];
                self.workType = 'acb';
                self.loadData()
                    .then(function () {
                        self.activeAcb = self.acbs[0]
                    });
            }

            function activateAcb (acb) {
                self.workType = 'acb';
                self.activeAcb = acb;
            }

            function loadData () {
                return commonService.getAcbs()
                    .then (function (data) {
                        self.acbs = data.acbs;
                    });
            }

            function createAcb () {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/acbEdit.html',
                    controller: 'EditAcbController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        acb: function () { return {}; },
                        action: function () { return 'create'; }
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

            function editAcb (acb) {
                self.modalInstance = $modal.open({
                    templateUrl: 'admin/components/acbEdit.html',
                    controller: 'EditAcbController',
                    controllerAs: 'vm',
                    animation: false,
                    backdrop: 'static',
                    keyboard: false,
                    resolve: {
                        acb: function () { return acb; },
                        action: function () { return 'edit'; }
                    }
                });
                self.modalInstance.result.then(function (result) {
                    if (result !== 'deleted') {
                        self.activeAcb = result;
                    } else {
                        self.activate();
                    }
                }, function (result) {
                    if (result !== 'cancelled') {
                        $log.debug(result);
                    }
                });
            }

            self.cancelACB = function() {
                self.loadData();
            };

            self.deleteACB = function (acb) {
                commonService.deleteACB(acb.id)
                    .then(function (response) {
                        self.activate();
                    });
            };

            self.addressRequired = function (acb) {
                if (acb)
                    return commonService.addressRequired(acb.address);
            };
        }])
        .directive('aiAcbManagement', ['commonService', 'authService', '$log', function (commonService, authService, $log) {
            return {
                restrict: 'E',
                replace: true,
                templateUrl: 'admin/components/acbManagement.html',
                scope: {},
                controllerAs: 'vm',
                controller: 'AcbManagementController'
            };
        }]);
})();
