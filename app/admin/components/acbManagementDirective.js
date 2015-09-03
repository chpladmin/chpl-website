;(function () {
    'use strict';

    angular.module('app.admin')
        .controller('AcbManagementController', ['commonService', 'adminService', 'authService', '$log', '$timeout', function (commonService, adminService, authService, $log, $timeout) {
            var self = this;
            self.isChplAdmin = authService.isChplAdmin();
            self.isAcbAdmin = authService.isAcbAdmin();
            self.newACB = {address: {}};
            self.acbs = [];

            self.loadAcbs = function () {
                return adminService.getAcbs()
                    .then (function (data) {
                        self.acbs = data.acbs;
                    });
            };
            self.loadUsers = function (acb) {
                adminService.getUsersAtAcb(acb.id)
                    .then(function (data) {
                        acb.users = data.users;
                    });
            };
            self.loadData = function () {
                self.loadAcbs()
                .then(function () {
                    for (var i = 0; i < self.acbs.length; i++) {
                        self.loadUsers(self.acbs[i]);
                    }
                });
            };
            self.loadData();

            self.createACB = function () {
                adminService.createACB(self.newACB)
                    .then($timeout(self.loadData,1000));
                self.newACB = {address: {}};
            };

            self.modifyACB = function (acb) {
                adminService.modifyACB(acb)
                    .then($timeout(self.loadData,1000));
            };

            self.cancelACB = function() {
                self.loadData();
            };

            self.deleteACB = function (acb) {
                adminService.deleteACB(acb.id)
                    .then($timeout(self.loadData,1000));
            };

            self.addressRequired = function (acb) {
                if (acb.address === null) return false;
                if (acb.address.line1 && acb.address.line1.length > 0) return true;
                if (acb.address.line2 && acb.address.line2.length > 0) return true;
                if (acb.address.city && acb.address.city.length > 0) return true;
                if (acb.address.region && acb.address.region.length > 0) return true;
                if (acb.address.country && acb.address.country.length > 0) return true;
                return false;
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
